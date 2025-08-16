-- Add privacy control column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Drop the existing overly permissive policy
DROP POLICY "Public profiles are viewable by everyone" ON public.profiles;

-- Create new secure policy that respects user privacy
CREATE POLICY "Users can view their own profile and public profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile
  auth.uid() = id 
  OR 
  -- Anyone can see profiles marked as public
  is_public = true
);