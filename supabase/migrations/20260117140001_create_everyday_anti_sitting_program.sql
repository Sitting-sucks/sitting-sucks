-- ============================================
-- CREATE EVERYDAY ANTI-SITTING PROGRAM
-- Migration: 20260117140001
-- ============================================

-- This program is a comprehensive daily routine designed to counteract
-- the negative effects of prolonged sitting. It covers all major body
-- regions and movement patterns.

-- First, ensure we have a programs table (if not already created)
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all levels')),
  duration_weeks integer,
  frequency text,
  goals text[],
  equipment_needed text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  image_url text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create program_exercises junction table if not exists
CREATE TABLE IF NOT EXISTS public.program_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE,
  day_number integer,
  week_number integer,
  order_index integer NOT NULL,
  sets integer,
  reps text,
  duration text,
  rest_seconds integer,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for programs
DROP POLICY IF EXISTS "Anyone can view active programs" ON public.programs;
CREATE POLICY "Anyone can view active programs" ON public.programs
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Trainers can manage programs" ON public.programs;
CREATE POLICY "Trainers can manage programs" ON public.programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('trainer', 'admin')
    )
  );

-- RLS Policies for program_exercises
DROP POLICY IF EXISTS "Anyone can view program exercises" ON public.program_exercises;
CREATE POLICY "Anyone can view program exercises" ON public.program_exercises
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Trainers can manage program exercises" ON public.program_exercises;
CREATE POLICY "Trainers can manage program exercises" ON public.program_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('trainer', 'admin')
    )
  );

-- ============================================
-- INSERT THE EVERYDAY ANTI-SITTING PROGRAM
-- ============================================

INSERT INTO public.programs (name, description, difficulty, duration_weeks, frequency, goals, equipment_needed, is_active, is_featured)
VALUES (
  'Everyday Anti-Sitting Protocol',
  'A comprehensive daily routine designed to counteract the negative effects of prolonged sitting. This program systematically addresses every major area affected by sitting: ankles, hips, spine, shoulders, and core. Perform this routine daily for best results.',
  'all levels',
  NULL, -- Ongoing program
  'Daily',
  ARRAY[
    'Reverse the damage from prolonged sitting',
    'Restore mobility in ankles, hips, and shoulders',
    'Strengthen posterior chain muscles weakened by sitting',
    'Improve posture and reduce pain',
    'Build core stability'
  ],
  ARRAY[
    'Heel wedges (or rolled towel)',
    'Resistance bands',
    'Foam roller',
    'Pull-up bar (for dead hangs)',
    'Dumbbells or kettlebells',
    'Cable machine (optional)'
  ],
  true,
  true
);

-- ============================================
-- ADD EXERCISES TO THE PROGRAM
-- Organized by body region, building from ground up
-- ============================================

-- Get the program ID
DO $$
DECLARE
  program_uuid uuid;
  exercise_uuid uuid;
  order_num integer := 1;
BEGIN
  -- Get the program we just created
  SELECT id INTO program_uuid FROM public.programs WHERE name = 'Everyday Anti-Sitting Protocol' LIMIT 1;

  -- SECTION 1: FOOT/ANKLE (Exercises 1-2)

  -- Heel Wedge Calf Stretch
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Heel Wedge Calf Stretch' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30-90 seconds', 'Start here to wake up the ankles');
    order_num := order_num + 1;
  END IF;

  -- Standing Plantar Flexions
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Standing Plantar Flexions' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '10-20', 'Calf raises - full range of motion');
    order_num := order_num + 1;
  END IF;

  -- SECTION 2: CORE/PLANK (Exercise 3)

  -- Plankle or Forearm Plank
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Plankle' LIMIT 1;
  IF exercise_uuid IS NULL THEN
    SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Forearm Plank' LIMIT 1;
  END IF;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '15-60 seconds', 'Focus on pushing lumbar spine toward ceiling');
    order_num := order_num + 1;
  END IF;

  -- SECTION 3: HIP ABDUCTION (Exercises 4-5)

  -- Standing Hip Abduction
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Standing Hip Abduction' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15 each side', 'Use band for added resistance');
    order_num := order_num + 1;
  END IF;

  -- Fire Hydrants (alternative)
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Fire Hydrants' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15 each side', 'Alternative to standing abduction');
    order_num := order_num + 1;
  END IF;

  -- SECTION 4: ADDUCTORS/POSTURE (Exercise 6)

  -- Foam Roller Adductor Squeeze
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Foam Roller Adductor Squeeze' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30-75 seconds', 'Full body posture focus: glutes tucked, ribs down, shoulder blades squeezed');
    order_num := order_num + 1;
  END IF;

  -- SECTION 5: LUNGES (Exercise 7)

  -- Lunge with Back Leg Extension
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Lunge with Back Leg Extension' LIMIT 1;
  IF exercise_uuid IS NULL THEN
    SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%lunge%' LIMIT 1;
  END IF;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '6-12 each side', 'Focus on back leg hip extension');
    order_num := order_num + 1;
  END IF;

  -- SECTION 6: SQUAT (Exercise 8)

  -- Squat
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%squat%' AND name NOT ILIKE '%jump%' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '10-15', 'Hold weight at face level, elevate heels, chest up');
    order_num := order_num + 1;
  END IF;

  -- SECTION 7: HAMSTRING STRETCH (Exercise 9)

  -- Single Leg Hamstring Stretch
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Single Leg Hamstring Stretch' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30-90 seconds each side', 'Pull toe toward you for deeper stretch');
    order_num := order_num + 1;
  END IF;

  -- SECTION 8: HIP EXTENSION (Exercise 10)

  -- Roman Chair Hip Extension
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Roman Chair Hip Extension' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15', 'SITTING SQUASHER - One of the best exercises for reversing sitting damage');
    order_num := order_num + 1;
  END IF;

  -- SECTION 9: DEADLIFT (Exercise 11)

  -- Deadlift
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Deadlift' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15', 'Full posterior chain activation');
    order_num := order_num + 1;
  END IF;

  -- SECTION 10: OVERHEAD/SHOULDERS (Exercises 12-13)

  -- Overhead Thumb Taps to Wall
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Overhead Thumb Taps to Wall' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15', 'Keep spine straight, do not arch lower back');
    order_num := order_num + 1;
  END IF;

  -- Dead Hangs
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Dead Hangs' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30 seconds', 'Knuckles to ceiling, let spine decompress');
    order_num := order_num + 1;
  END IF;

  -- Shoulder Abduction with Band
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Shoulder Abduction with Band' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '8-15', 'Lateral raises with band');
    order_num := order_num + 1;
  END IF;

  -- SECTION 11: PULLING (Exercises 14-15)

  -- Rows
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Rows' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '8-15', 'Cable, bar, or machine - squeeze shoulder blades');
    order_num := order_num + 1;
  END IF;

  -- Reverse Fly
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%reverse fly%' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15', 'Target rear delts and rhomboids');
    order_num := order_num + 1;
  END IF;

  -- SECTION 12: TRICEPS (Exercise 16)

  -- Triceps Extension
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Triceps Extension with Shoulder Extension' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '10-20', 'Arm behind body for shoulder extension emphasis');
    order_num := order_num + 1;
  END IF;

  -- SECTION 13: CARRIES & GRIP (Exercises 17-19)

  -- Farmers Carry
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Farmers Carry' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30-60 seconds', 'Heavy weight, maintain posture');
    order_num := order_num + 1;
  END IF;

  -- Bicep Curls
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Bicep Curls' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '5-15', 'Controlled movement, no swinging');
    order_num := order_num + 1;
  END IF;

  -- Wrist Flexion/Extension
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%wrist%' OR name ILIKE '%forearm spinner%' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '10-15 each direction', 'PVC with string or forearm spinner');
    order_num := order_num + 1;
  END IF;

  -- SECTION 14: CORE STABILITY (Exercises 20-21)

  -- Supine Core Stability
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%supine%core%' OR name ILIKE '%band hold%' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '30-60 seconds', 'Low back pressed into floor, band in hands');
    order_num := order_num + 1;
  END IF;

  -- Side Plank
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Side Plank' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '15-30 seconds each side', 'Keep body in straight line');
    order_num := order_num + 1;
  END IF;

  -- Captain's Chair
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name ILIKE '%captain%' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, duration, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '10-30 seconds or 5-15 reps', 'If available - great for hip flexors and abs');
    order_num := order_num + 1;
  END IF;

  -- SECTION 15: ROTATION (Exercises 22-23)

  -- Banded Cable Rotation
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Banded Cable Rotation' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '8-20 each side', 'Rotation from core, not arms');
    order_num := order_num + 1;
  END IF;

  -- Pallof Press
  SELECT id INTO exercise_uuid FROM public.exercises WHERE name = 'Pallof Press' LIMIT 1;
  IF exercise_uuid IS NOT NULL THEN
    INSERT INTO public.program_exercises (program_id, exercise_id, order_index, reps, notes)
    VALUES (program_uuid, exercise_uuid, order_num, '8-20 each side', 'Anti-rotation - resist the pull');
    order_num := order_num + 1;
  END IF;

END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_exercises_program_id ON public.program_exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_program_exercises_exercise_id ON public.program_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON public.programs(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_is_featured ON public.programs(is_featured);
