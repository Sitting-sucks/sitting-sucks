-- Fix security vulnerability: Remove email-based access from subscribers table RLS policies
-- Only allow access based on auth.uid() = user_id for secure user identification

-- Drop existing policies
DROP POLICY IF EXISTS "authenticated_users_can_insert_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "authenticated_users_can_update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create secure policies using only user_id matching
CREATE POLICY "Users can insert their own subscription data"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription data"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription data"
ON public.subscribers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add a comment explaining the security fix
COMMENT ON TABLE public.subscribers IS 'Subscription data table with secure RLS policies that only allow access based on user_id matching auth.uid() to prevent email-based access vulnerabilities';