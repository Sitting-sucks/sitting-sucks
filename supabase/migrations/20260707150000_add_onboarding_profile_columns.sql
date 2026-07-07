-- Onboarding data + program personalization storage (Session 2, Task 4C)
-- Additive only: new nullable columns on profiles.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_data jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS program_personalization jsonb;
