-- Add macro_groups column to exercises table
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS macro_groups text[] DEFAULT '{}';

-- Create user_gamification table for tracking points, levels, and streaks
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points integer DEFAULT 0,
  current_level integer DEFAULT 1,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_sign_in_date date,
  workouts_completed integer DEFAULT 0,
  exercises_logged integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create point_history table to track individual point awards
CREATE TABLE IF NOT EXISTS public.point_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points integer NOT NULL,
  reason text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on gamification tables
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_gamification
CREATE POLICY "Users can view their own gamification data"
  ON public.user_gamification
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data"
  ON public.user_gamification
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gamification data"
  ON public.user_gamification
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for point_history
CREATE POLICY "Users can view their own point history"
  ON public.point_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own point history"
  ON public.point_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_point_history_user_id ON public.point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_point_history_created_at ON public.point_history(created_at DESC);
