-- Comprehensive Stats and Tracking System for Sitting Sucks
-- This migration adds login tracking, detailed stats, achievements, and PRs

-- ============================================
-- 1. LOGIN TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  logged_in_at timestamp with time zone DEFAULT now(),
  device_info text,
  ip_address inet
);

-- Enable RLS
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own login history"
  ON public.login_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own login records"
  ON public.login_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_logged_in_at ON public.login_history(logged_in_at DESC);

-- ============================================
-- 2. ENHANCED USER STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Workout totals
  total_workouts integer DEFAULT 0,
  total_sets integer DEFAULT 0,
  total_reps integer DEFAULT 0,
  total_weight_lifted numeric(12, 2) DEFAULT 0, -- in pounds
  total_duration_minutes integer DEFAULT 0,

  -- Weekly stats (reset weekly via cron or on fetch)
  weekly_workouts integer DEFAULT 0,
  weekly_sets integer DEFAULT 0,
  weekly_reps integer DEFAULT 0,
  weekly_weight numeric(12, 2) DEFAULT 0,
  weekly_duration_minutes integer DEFAULT 0,
  week_start_date date,

  -- Monthly stats
  monthly_workouts integer DEFAULT 0,
  monthly_sets integer DEFAULT 0,
  monthly_reps integer DEFAULT 0,
  monthly_weight numeric(12, 2) DEFAULT 0,
  monthly_duration_minutes integer DEFAULT 0,
  month_start_date date,

  -- Average stats
  avg_workout_duration_minutes numeric(6, 2) DEFAULT 0,
  avg_sets_per_workout numeric(6, 2) DEFAULT 0,
  avg_reps_per_set numeric(6, 2) DEFAULT 0,

  -- Most trained muscle groups (JSON array with counts)
  muscle_group_counts jsonb DEFAULT '{}',

  -- Most frequent exercises (JSON array with counts)
  exercise_counts jsonb DEFAULT '{}',

  -- Time-based patterns
  favorite_workout_time text, -- 'morning', 'afternoon', 'evening', 'night'
  most_active_day text, -- 'monday', 'tuesday', etc.

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- ============================================
-- 3. PERSONAL RECORDS (PRs) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.personal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,

  -- PR types
  max_weight numeric(8, 2), -- heaviest weight lifted
  max_reps integer, -- most reps in a single set
  max_volume numeric(12, 2), -- weight x reps for single set
  max_total_volume numeric(12, 2), -- total volume in a workout for this exercise

  -- When the PR was set
  max_weight_date date,
  max_reps_date date,
  max_volume_date date,
  max_total_volume_date date,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, exercise_id)
);

-- Enable RLS
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own PRs"
  ON public.personal_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PRs"
  ON public.personal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PRs"
  ON public.personal_records FOR UPDATE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON public.personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON public.personal_records(exercise_id);

-- ============================================
-- 4. USER ACHIEVEMENTS/BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL, -- e.g., 'first_workout', 'streak_7', 'workout_50', etc.
  achievement_name text NOT NULL,
  achievement_description text,
  achievement_icon text, -- emoji or icon name

  -- Achievement metadata
  tier text DEFAULT 'bronze', -- bronze, silver, gold, platinum
  points_awarded integer DEFAULT 0,

  earned_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON public.user_achievements(achievement_type);

-- ============================================
-- 5. WORKOUT RECOMMENDATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Recommendation details
  recommended_program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  recommended_exercise_ids uuid[] DEFAULT '{}',
  recommendation_reason text,

  -- Based on what data
  last_workout_id uuid,
  days_since_last_workout integer,
  muscle_groups_needing_work text[],

  -- Status
  status text DEFAULT 'pending', -- pending, accepted, dismissed, completed

  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours'),
  responded_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.workout_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own recommendations"
  ON public.workout_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON public.workout_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON public.workout_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_workout_recommendations_user_id ON public.workout_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_recommendations_status ON public.workout_recommendations(status);

-- ============================================
-- 6. ENHANCE WORKOUT_LOGS TABLE
-- ============================================
-- Add columns if they don't exist
ALTER TABLE public.workout_logs
  ADD COLUMN IF NOT EXISTS workout_name text,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS calories_burned integer,
  ADD COLUMN IF NOT EXISTS heart_rate_avg integer,
  ADD COLUMN IF NOT EXISTS heart_rate_max integer,
  ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS perceived_effort integer CHECK (perceived_effort >= 1 AND perceived_effort <= 10),
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual', -- manual, apple_health, google_fit, fitbit
  ADD COLUMN IF NOT EXISTS external_id text, -- ID from external source for deduplication
  ADD COLUMN IF NOT EXISTS muscle_groups_worked text[];

-- Index for external sources
CREATE INDEX IF NOT EXISTS idx_workout_logs_source ON public.workout_logs(source);
CREATE INDEX IF NOT EXISTS idx_workout_logs_external_id ON public.workout_logs(external_id);

-- ============================================
-- 7. ENHANCE USER_GAMIFICATION TABLE
-- ============================================
-- Add milestone tracking
ALTER TABLE public.user_gamification
  ADD COLUMN IF NOT EXISTS achievements_unlocked integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_weight_lifted numeric(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_duration_minutes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_workout_date date,
  ADD COLUMN IF NOT EXISTS consecutive_weeks_active integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_week_workouts integer DEFAULT 0;

-- ============================================
-- 8. TRAINERS CAN VIEW CLIENT STATS
-- ============================================
-- Create policy for trainers to view their clients' data
CREATE POLICY "Trainers can view their clients stats"
  ON public.user_stats FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_stats.user_id
      AND profiles.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can view their clients achievements"
  ON public.user_achievements FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_achievements.user_id
      AND profiles.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can view their clients PRs"
  ON public.personal_records FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = personal_records.user_id
      AND profiles.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can view their clients gamification"
  ON public.user_gamification FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_gamification.user_id
      AND profiles.trainer_id = auth.uid()
    )
  );

-- ============================================
-- 9. FUNCTION TO UPDATE USER STATS
-- ============================================
CREATE OR REPLACE FUNCTION update_user_stats_on_workout()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user_stats when a workout is logged
  INSERT INTO public.user_stats (user_id, total_workouts, total_sets, total_reps, total_weight_lifted, total_duration_minutes)
  VALUES (
    NEW.user_id,
    1,
    COALESCE(NEW.sets_completed, 0),
    COALESCE(NEW.reps_completed, 0),
    COALESCE(NEW.weight_used * NEW.reps_completed * NEW.sets_completed, 0),
    COALESCE(NEW.duration_minutes, 0)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_workouts = user_stats.total_workouts + 1,
    total_sets = user_stats.total_sets + COALESCE(NEW.sets_completed, 0),
    total_reps = user_stats.total_reps + COALESCE(NEW.reps_completed, 0),
    total_weight_lifted = user_stats.total_weight_lifted + COALESCE(NEW.weight_used * NEW.reps_completed * NEW.sets_completed, 0),
    total_duration_minutes = user_stats.total_duration_minutes + COALESCE(NEW.duration_minutes, 0),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.workout_logs;
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON public.workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_workout();

-- ============================================
-- 10. FUNCTION TO CHECK AND AWARD ACHIEVEMENTS
-- ============================================
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  workout_count integer;
  current_streak integer;
BEGIN
  -- Get current counts
  SELECT workouts_completed, current_streak
  INTO workout_count, current_streak
  FROM public.user_gamification
  WHERE user_id = NEW.user_id;

  -- First workout achievement
  IF workout_count = 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, achievement_icon, tier, points_awarded)
    VALUES (NEW.user_id, 'first_workout', 'First Step', 'Complete your first workout', '1', 'bronze', 25)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- Workout milestones
  IF workout_count = 10 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, achievement_icon, tier, points_awarded)
    VALUES (NEW.user_id, 'workout_10', 'Getting Started', 'Complete 10 workouts', '1', 'bronze', 50)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  ELSIF workout_count = 25 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, achievement_icon, tier, points_awarded)
    VALUES (NEW.user_id, 'workout_25', 'Building Momentum', 'Complete 25 workouts', '2', 'silver', 100)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  ELSIF workout_count = 50 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, achievement_icon, tier, points_awarded)
    VALUES (NEW.user_id, 'workout_50', 'Dedicated', 'Complete 50 workouts', '3', 'gold', 200)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  ELSIF workout_count = 100 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, achievement_description, achievement_icon, tier, points_awarded)
    VALUES (NEW.user_id, 'workout_100', 'Century Club', 'Complete 100 workouts', '4', 'platinum', 500)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for achievements
DROP TRIGGER IF EXISTS trigger_check_achievements ON public.user_gamification;
CREATE TRIGGER trigger_check_achievements
  AFTER UPDATE ON public.user_gamification
  FOR EACH ROW
  WHEN (NEW.workouts_completed IS DISTINCT FROM OLD.workouts_completed)
  EXECUTE FUNCTION check_achievements();
