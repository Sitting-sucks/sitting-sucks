-- Add performance indexes for frequently queried columns
-- These indexes optimize RLS policy checks and common query patterns

-- Index for client_programs to speed up RLS subqueries
-- Used when checking if a client has access to a program's exercises
CREATE INDEX IF NOT EXISTS idx_client_programs_client_program
  ON public.client_programs(client_id, program_id);

-- Index for trainer-client relationship lookups
-- Used in RLS policies to check if a trainer has access to client data
CREATE INDEX IF NOT EXISTS idx_profiles_trainer_id
  ON public.profiles(trainer_id)
  WHERE trainer_id IS NOT NULL;

-- Index for login history date filtering
-- Speeds up queries that filter by login date (analytics, streak calculations)
CREATE INDEX IF NOT EXISTS idx_login_history_logged_in_at
  ON public.login_history(logged_in_at DESC);

-- Composite index for workout_logs user and date queries
-- Commonly used for fetching user's recent workouts
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_logged_at
  ON public.workout_logs(user_id, logged_at DESC);

-- Index for gamification streak queries
CREATE INDEX IF NOT EXISTS idx_user_gamification_streak
  ON public.user_gamification(current_streak DESC);

-- Index for stats weekly/monthly reset logic
CREATE INDEX IF NOT EXISTS idx_user_stats_week_start
  ON public.user_stats(week_start_date);

CREATE INDEX IF NOT EXISTS idx_user_stats_month_start
  ON public.user_stats(month_start_date);

-- Index for recommendations expiry and status filtering
CREATE INDEX IF NOT EXISTS idx_workout_recommendations_status_expires
  ON public.workout_recommendations(user_id, status, expires_at)
  WHERE status = 'pending';

-- Index for point history to speed up recent point lookups
CREATE INDEX IF NOT EXISTS idx_point_history_user_created
  ON public.point_history(user_id, created_at DESC);
