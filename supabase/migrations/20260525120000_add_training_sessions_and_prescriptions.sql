-- Migration: Trainer-logged sessions + per-date exercise prescriptions
-- Adds:
--   1. prescribed_exercises  — trainer assigns specific exercises to a client for a specific date
--   2. training_sessions      — a real session that happened (with or without the trainer)
--   3. workout_logs.session_id — link logged exercises to a training session
--   4. RLS so trainers can log workouts on behalf of their clients (for session recaps + n8n)
--
-- Design decision (confirmed): daily one-off prescriptions live ALONGSIDE the existing
-- programs system. A client's "Today" view merges today's prescribed_exercises with the
-- exercises from any assigned program day.

-- ============================================
-- 1. PRESCRIBED_EXERCISES (per-date prescriptions)
-- ============================================

CREATE TABLE IF NOT EXISTS public.prescribed_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  prescribed_for date NOT NULL DEFAULT current_date,
  sets integer,
  reps text,
  notes text,
  order_index integer DEFAULT 0,
  completed_at timestamptz,
  workout_log_id uuid REFERENCES public.workout_logs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. TRAINING_SESSIONS (a real session occurred)
-- ============================================

CREATE TABLE IF NOT EXISTS public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date date NOT NULL DEFAULT current_date,
  with_trainer boolean DEFAULT true,
  title text,
  notes text,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'calendar-n8n', 'client')),
  calendar_event_id text,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. LINK WORKOUT_LOGS TO A SESSION
-- ============================================

ALTER TABLE public.workout_logs
ADD COLUMN IF NOT EXISTS session_id uuid REFERENCES public.training_sessions(id) ON DELETE SET NULL;

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.prescribed_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS — PRESCRIBED_EXERCISES
-- ============================================

-- Client sees their own prescriptions; trainers see all
DROP POLICY IF EXISTS "View prescribed exercises" ON public.prescribed_exercises;
CREATE POLICY "View prescribed exercises"
ON public.prescribed_exercises FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can prescribe
DROP POLICY IF EXISTS "Trainers can prescribe exercises" ON public.prescribed_exercises;
CREATE POLICY "Trainers can prescribe exercises"
ON public.prescribed_exercises FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Trainers can edit any prescription; clients can update their own (e.g. mark completed)
DROP POLICY IF EXISTS "Update prescribed exercises" ON public.prescribed_exercises;
CREATE POLICY "Update prescribed exercises"
ON public.prescribed_exercises FOR UPDATE
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can delete prescriptions
DROP POLICY IF EXISTS "Trainers can delete prescriptions" ON public.prescribed_exercises;
CREATE POLICY "Trainers can delete prescriptions"
ON public.prescribed_exercises FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- ============================================
-- 6. RLS — TRAINING_SESSIONS
-- ============================================

-- Client sees their own sessions; trainers see all
DROP POLICY IF EXISTS "View training sessions" ON public.training_sessions;
CREATE POLICY "View training sessions"
ON public.training_sessions FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can create/update/delete sessions (n8n uses the service role, which bypasses RLS)
DROP POLICY IF EXISTS "Trainers can create sessions" ON public.training_sessions;
CREATE POLICY "Trainers can create sessions"
ON public.training_sessions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

DROP POLICY IF EXISTS "Trainers can update sessions" ON public.training_sessions;
CREATE POLICY "Trainers can update sessions"
ON public.training_sessions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

DROP POLICY IF EXISTS "Trainers can delete sessions" ON public.training_sessions;
CREATE POLICY "Trainers can delete sessions"
ON public.training_sessions FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- ============================================
-- 7. RLS — ALLOW TRAINERS TO LOG WORKOUTS FOR CLIENTS
-- ============================================
-- The existing "Users can log workouts" policy only allows user_id = auth.uid().
-- Add trainer-scoped INSERT/UPDATE so a trainer can record what a client did during a session.
-- (These are ADDITIVE permissive policies — they do not remove the existing self-log policy.)

DROP POLICY IF EXISTS "Trainers can log workouts for clients" ON public.workout_logs;
CREATE POLICY "Trainers can log workouts for clients"
ON public.workout_logs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

DROP POLICY IF EXISTS "Trainers can update client logs" ON public.workout_logs;
CREATE POLICY "Trainers can update client logs"
ON public.workout_logs FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- ============================================
-- 7b. CLAIM CLIENT (trainer adds a client to their roster)
-- ============================================
-- The profiles UPDATE policy only allows editing your own row, so a trainer cannot set
-- another user's trainer_id directly. This SECURITY DEFINER function lets a trainer claim a
-- client onto their roster — it ONLY sets trainer_id = the calling trainer, nothing else.
CREATE OR REPLACE FUNCTION public.claim_client(p_client_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer') THEN
    RAISE EXCEPTION 'Only trainers can claim clients';
  END IF;
  UPDATE public.profiles
  SET trainer_id = auth.uid()
  WHERE id = p_client_id AND role = 'client';
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_client(uuid) TO authenticated;

-- Release a client from your roster (sets trainer_id back to NULL if you are their trainer)
CREATE OR REPLACE FUNCTION public.release_client(p_client_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET trainer_id = NULL
  WHERE id = p_client_id AND trainer_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.release_client(uuid) TO authenticated;

-- ============================================
-- 8. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_prescribed_client_date ON public.prescribed_exercises(client_id, prescribed_for);
CREATE INDEX IF NOT EXISTS idx_prescribed_exercise ON public.prescribed_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_client ON public.training_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer ON public.training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON public.training_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_session ON public.workout_logs(session_id);

-- ============================================
-- 9. COMMENTS
-- ============================================

COMMENT ON TABLE public.prescribed_exercises IS 'One-off exercises a trainer prescribes to a client for a specific calendar date (complements the programs system). Powers the client Today view.';
COMMENT ON TABLE public.training_sessions IS 'A real training session that occurred (with or without the trainer). Groups workout_logs via workout_logs.session_id. Created in-app by a trainer or by the n8n calendar automation (service role).';
COMMENT ON COLUMN public.workout_logs.session_id IS 'Optional link to the training_sessions row this log belongs to.';
