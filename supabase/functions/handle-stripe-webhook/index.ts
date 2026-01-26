import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Only allow POST requests for webhooks
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get the signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: Missing stripe-signature header");
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    // Get the raw body for signature verification
    const body = await req.text();

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logStep("ERROR: Webhook signature verification failed", { error: errorMessage });
      return new Response(`Webhook signature verification failed: ${errorMessage}`, { status: 400 });
    }

    logStep("Webhook verified", { type: event.type, id: event.id });

    // Initialize Supabase client with service role for admin access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription update", {
          subscriptionId: subscription.id,
          status: subscription.status
        });

        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) {
          logStep("Customer was deleted, skipping");
          break;
        }

        const email = customer.email;
        const userId = subscription.metadata?.user_id;
        const tier = subscription.metadata?.tier || "basic";

        if (!email && !userId) {
          logStep("No email or user_id found, skipping");
          break;
        }

        const isActive = subscription.status === "active" || subscription.status === "trialing";
        const subscriptionEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        // Build upsert data
        const upsertData: Record<string, unknown> = {
          stripe_customer_id: subscription.customer,
          subscribed: isActive,
          subscription_tier: isActive ? tier : null,
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        };

        // Add identifiers
        if (userId) {
          upsertData.user_id = userId;
        }
        if (email) {
          upsertData.email = email;
        }

        // Upsert by user_id if available, otherwise try by email
        const { error } = await supabaseClient
          .from("subscribers")
          .upsert(upsertData, {
            onConflict: userId ? 'user_id' : 'email'
          });

        if (error) {
          logStep("ERROR: Failed to update subscriber", { error: error.message });
          throw error;
        }

        logStep("Subscriber updated", {
          email,
          userId,
          subscribed: isActive,
          tier: isActive ? tier : null
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription deletion", { subscriptionId: subscription.id });

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) {
          logStep("Customer was deleted, skipping");
          break;
        }

        const email = customer.email;
        const userId = subscription.metadata?.user_id;

        // Update subscriber to unsubscribed status
        const updateData = {
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        };

        let error;
        if (userId) {
          const result = await supabaseClient
            .from("subscribers")
            .update(updateData)
            .eq("user_id", userId);
          error = result.error;
        } else if (email) {
          const result = await supabaseClient
            .from("subscribers")
            .update(updateData)
            .eq("email", email);
          error = result.error;
        }

        if (error) {
          logStep("ERROR: Failed to update subscriber on deletion", { error: error.message });
          throw error;
        }

        logStep("Subscription cancelled", { email, userId });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          attemptCount: invoice.attempt_count
        });

        // Get customer details
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        if (customer.deleted) break;

        // You could send an email notification here or update a status field
        // For now, just log it - the subscription.updated event will handle status changes
        logStep("Payment failure recorded", { email: customer.email });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid
        });
        // The subscription.updated event will handle status changes
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", {
          sessionId: session.id,
          customerId: session.customer,
          userId: session.metadata?.user_id
        });
        // The subscription.created event will handle the database update
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook handler", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
