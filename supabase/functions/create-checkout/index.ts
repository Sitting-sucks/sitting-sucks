import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// SECURITY: Restrict CORS to your specific domain(s)
// Add your production domain to the allowed origins list
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  // Add your production domain here, e.g.:
  // "https://sittingsucks.com",
  // "https://www.sittingsucks.com",
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Tier pricing configuration
const TIERS = {
  basic: {
    name: "Sitting Sucks - Full Access",
    description: "Complete exercise library, Anti-Sitting Protocol, and progress tracking",
    amount: 2900, // $29.00 in cents
    tier: "basic",
  },
  coaching: {
    name: "Sitting Sucks - 1-on-1 Coaching",
    description: "Everything in Full Access plus personalized coaching and custom programs",
    amount: 24900, // $249.00 in cents
    tier: "coaching",
  },
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // SECURITY: Validate Stripe key is set
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // SECURITY: Validate authorization header exists
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    // Parse request body to get tier
    let tier = "basic";
    try {
      const body = await req.json();
      if (body.tier && (body.tier === "basic" || body.tier === "coaching")) {
        tier = body.tier;
      }
    } catch {
      // Default to basic if no body or invalid JSON
    }
    logStep("Tier selected", { tier });

    const tierConfig = TIERS[tier as keyof typeof TIERS];
    if (!tierConfig) {
      throw new Error("Invalid tier selected");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tierConfig.name,
              description: tierConfig.description,
              metadata: {
                tier: tierConfig.tier,
              },
            },
            unit_amount: tierConfig.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/pricing?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        tier: tierConfig.tier,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier: tierConfig.tier,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url, tier: tierConfig.tier });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
