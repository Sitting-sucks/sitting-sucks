-- Fix critical security vulnerability in subscribers table RLS policies
-- Replace overly permissive policies with secure ones

-- Drop the existing insecure policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure INSERT policy - only authenticated users can insert their own records
CREATE POLICY "authenticated_users_can_insert_own_subscription" 
ON public.subscribers
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR 
  auth.email() = email
);

-- Create secure UPDATE policy - only authenticated users can update their own records
CREATE POLICY "authenticated_users_can_update_own_subscription" 
ON public.subscribers
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.email() = email
);

-- Also ensure the user_id column should not be nullable for better security
-- (This is a best practice to prevent orphaned records)
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;