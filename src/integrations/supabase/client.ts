// Supabase client configuration
// Credentials are loaded from environment variables for security
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Load from environment variables with fallback for development
// In production, these should ALWAYS be set via environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rfraninxxwqhjdkikfeg.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcmFuaW54eHdxaGpka2lrZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDAxNDEsImV4cCI6MjA2OTQxNjE0MX0.YWe2rBeyafqXwWXBaRplis_uWmo_oKSSI0hYJr02XAE";

// Warn in development if environment variables are not set
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn(
    '[Supabase] Environment variables not set. Using fallback values.\n' +
    'For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});