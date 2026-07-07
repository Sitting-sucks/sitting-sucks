-- Fix cross-trainer IDOR: trainer policies previously checked only role='trainer',
-- letting any trainer read/write ANY client's prescriptions, sessions, and logs.
-- Scope every trainer policy to the trainer's own roster (profiles.trainer_id = auth.uid()).

-- Helper predicate used throughout:
--   client on my roster = EXISTS (profiles p WHERE p.id = <client_id> AND p.trainer_id = auth.uid())

-- ============================================
-- PRESCRIBED_EXERCISES
-- ============================================

DROP POLICY IF EXISTS "View prescribed exercises" ON public.prescribed_exercises;
CREATE POLICY "View prescribed exercises"
ON public.prescribed_exercises FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = prescribed_exercises.client_id AND p.trainer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Trainers can prescribe exercises" ON public.prescribed_exercises;
CREATE POLICY "Trainers can prescribe exercises"
ON public.prescribed_exercises FOR INSERT
TO authenticated
WITH CHECK (
  trainer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = prescribed_exercises.client_id AND p.trainer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Update prescribed exercises" ON public.prescribed_exercises;
CREATE POLICY "Update prescribed exercises"
ON public.prescribed_exercises FOR UPDATE
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = prescribed_exercises.client_id AND p.trainer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Trainers can delete prescriptions" ON public.prescribed_exercises;
CREATE POLICY "Trainers can delete prescriptions"
ON public.prescribed_exercises FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = prescribed_exercises.client_id AND p.trainer_id = auth.uid()
  )
);

-- ============================================
-- TRAINING_SESSIONS
-- ============================================

DROP POLICY IF EXISTS "View training sessions" ON public.training_sessions;
CREATE POLICY "View training sessions"
ON public.training_sessions FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
  OR trainer_id = auth.uid()
);

DROP POLICY IF EXISTS "Trainers can create sessions" ON public.training_sessions;
CREATE POLICY "Trainers can create sessions"
ON public.training_sessions FOR INSERT
TO authenticated
WITH CHECK (
  trainer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = training_sessions.client_id AND p.trainer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Trainers can update sessions" ON public.training_sessions;
CREATE POLICY "Trainers can update sessions"
ON public.training_sessions FOR UPDATE
TO authenticated
USING (trainer_id = auth.uid());

DROP POLICY IF EXISTS "Trainers can delete sessions" ON public.training_sessions;
CREATE POLICY "Trainers can delete sessions"
ON public.training_sessions FOR DELETE
TO authenticated
USING (trainer_id = auth.uid());

-- ============================================
-- WORKOUT_LOGS (trainer access)
-- ============================================

DROP POLICY IF EXISTS "Trainers can log workouts for clients" ON public.workout_logs;
CREATE POLICY "Trainers can log workouts for clients"
ON public.workout_logs FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = workout_logs.user_id AND p.trainer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Trainers can update client logs" ON public.workout_logs;
CREATE POLICY "Trainers can update client logs"
ON public.workout_logs FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = workout_logs.user_id AND p.trainer_id = auth.uid()
  )
);
