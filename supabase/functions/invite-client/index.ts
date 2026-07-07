import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Restrict CORS to known origins (mirrors the other functions)
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

const log = (step: string, details?: unknown) => {
  console.log(`[INVITE-CLIENT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Caller must be authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const token = authHeader.replace("Bearer ", "");

    // 2. Parse input
    const body = await req.json().catch(() => ({}));
    const email: string | undefined = body.email?.trim?.();
    const fullName: string | null = body.full_name?.trim?.() || null;
    if (!email) throw new Error("An email address is required");

    // 3. Identify the caller using their JWT (anon client)
    const anon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const { data: userData, error: authError } = await anon.auth.getUser(token);
    if (authError || !userData?.user) throw new Error("Not authenticated");
    const callerId = userData.user.id;
    log("Caller authenticated", { callerId });

    // 4. Service-role client for admin actions (bypasses RLS)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 5. Verify the caller is a trainer
    const { data: callerProfile, error: profErr } = await admin
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .single();
    if (profErr) throw new Error("Could not verify your account");
    if (callerProfile?.role !== "trainer") throw new Error("Only trainers can create client accounts");

    // 6. Invite the user — creates the auth account (no password) and emails them
    //    an invite link to finish signing up.
    const redirectTo = origin && ALLOWED_ORIGINS.includes(origin) ? origin : "https://sittingsucks.com";
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
      redirectTo,
    });
    if (inviteError) {
      // Most common: user already exists
      throw new Error(inviteError.message || "Could not invite this email");
    }
    const newUserId = invited?.user?.id;
    if (!newUserId) throw new Error("Invite did not return a user");
    log("User invited", { newUserId });

    // 7. Make sure their profile is set as THIS trainer's client.
    //    Upsert covers both cases (a handle_new_user trigger may have already created the row).
    const profileRow: Record<string, unknown> = {
      id: newUserId,
      role: "client",
      trainer_id: callerId,
    };
    if (fullName) profileRow.full_name = fullName;

    const { error: upsertErr } = await admin
      .from("profiles")
      .upsert(profileRow, { onConflict: "id" });
    if (upsertErr) throw new Error(upsertErr.message);
    log("Profile linked to trainer", { newUserId, callerId });

    return new Response(JSON.stringify({ success: true, user_id: newUserId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
