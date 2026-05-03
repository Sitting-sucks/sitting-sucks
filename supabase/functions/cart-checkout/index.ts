import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "https://sittingsucks.com",
  "https://www.sittingsucks.com",
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

// Valid products and their prices in cents — prevents price manipulation
const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  "starter-kit": { name: "Complete Starter Kit + 1 Month Free", price: 15000 },
  "Yellow Perform Better Band": { name: "Yellow Perform Better Band", price: 999 },
  "Purple Plastic Handle": { name: "Purple Plastic Handle", price: 1499 },
  "Heel Wedges (Pair)": { name: "Heel Wedges (Pair)", price: 1999 },
  "Two 2.5 lbs Plates": { name: "Two 2.5 lbs Plates", price: 1999 },
  "Forearm Spinner": { name: "Forearm Spinner", price: 1500 },
  "Foam Roller": { name: "Foam Roller", price: 3999 },
  "Lacrosse Ball": { name: "Lacrosse Ball", price: 899 },
  "Yoga Blocks (Set of 2)": { name: "Yoga Blocks (Set of 2)", price: 2499 },
  "5' PVC Pipe": { name: "5' PVC Pipe", price: 999 },
  "Gray Cook Band": { name: "Gray Cook Band", price: 6500 },
};

interface CartItem {
  id: string;
  quantity: number;
}

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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const body = await req.json();
    const cartItems: CartItem[] = body.items;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Validate and build line items from server-side catalog (prevents price tampering)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartItems) {
      const product = PRODUCT_CATALOG[item.id];
      if (!product) {
        throw new Error(`Unknown product: ${item.id}`);
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
        throw new Error(`Invalid quantity for ${item.id}`);
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find or reference existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/store?checkout=success`,
      cancel_url: `${origin}/store?checkout=cancelled`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        user_id: user.id,
        items: JSON.stringify(cartItems.map(i => ({ id: i.id, qty: i.quantity }))),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CART-CHECKOUT] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
