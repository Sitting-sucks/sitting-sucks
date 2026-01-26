-- Migration: Add exercises, programs, and role-based access
-- This migration creates the database structure for:
-- 1. Database-driven exercise library
-- 2. Program/workout builder
-- 3. Client-trainer relationships
-- 4. Progress tracking

-- ============================================
-- 1. ADD ROLE AND TRAINER COLUMNS TO PROFILES
-- ============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client' CHECK (role IN ('trainer', 'client')),
ADD COLUMN IF NOT EXISTS trainer_id uuid REFERENCES public.profiles(id);

-- ============================================
-- 2. CREATE EXERCISES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  instructions text,
  equipment text[] DEFAULT '{}',
  joint_movements text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  movement_patterns text[] DEFAULT '{}',
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  intensity text DEFAULT 'moderate' CHECK (intensity IN ('low', 'moderate', 'high')),
  duration text,
  video_url text,
  baseline text,
  progression text,
  regression text,
  categories text[] DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. CREATE PROGRAMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_template boolean DEFAULT false,
  is_premade boolean DEFAULT false,
  trainer_id uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. CREATE PROGRAM_EXERCISES TABLE (junction)
-- ============================================

CREATE TABLE IF NOT EXISTS public.program_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  day_number integer DEFAULT 1,
  order_index integer DEFAULT 0,
  sets integer,
  reps text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. CREATE CLIENT_PROGRAMS TABLE (assignments)
-- ============================================

CREATE TABLE IF NOT EXISTS public.client_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  UNIQUE(client_id, program_id)
);

-- ============================================
-- 6. CREATE WORKOUT_LOGS TABLE (progress tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS public.workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  exercise_id uuid REFERENCES public.exercises(id) ON DELETE SET NULL,
  logged_at timestamptz DEFAULT now(),
  sets_completed integer,
  reps_completed text,
  weight_used text,
  notes text
);

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS POLICIES FOR EXERCISES
-- ============================================

-- Everyone can view exercises (authenticated users)
CREATE POLICY "Anyone can view exercises"
ON public.exercises FOR SELECT
TO authenticated
USING (true);

-- Only trainers can insert exercises
CREATE POLICY "Trainers can create exercises"
ON public.exercises FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can update exercises
CREATE POLICY "Trainers can update exercises"
ON public.exercises FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can delete exercises
CREATE POLICY "Trainers can delete exercises"
ON public.exercises FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- ============================================
-- 9. RLS POLICIES FOR PROGRAMS
-- ============================================

-- Users can view premade programs or programs assigned to them
CREATE POLICY "Users can view accessible programs"
ON public.programs FOR SELECT
TO authenticated
USING (
  is_premade = true
  OR trainer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.client_programs WHERE program_id = programs.id AND client_id = auth.uid())
);

-- Only trainers can create programs
CREATE POLICY "Trainers can create programs"
ON public.programs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can update their programs
CREATE POLICY "Trainers can update own programs"
ON public.programs FOR UPDATE
TO authenticated
USING (trainer_id = auth.uid());

-- Only trainers can delete their programs
CREATE POLICY "Trainers can delete own programs"
ON public.programs FOR DELETE
TO authenticated
USING (trainer_id = auth.uid());

-- ============================================
-- 10. RLS POLICIES FOR PROGRAM_EXERCISES
-- ============================================

-- Users can view exercises in programs they can access
CREATE POLICY "Users can view program exercises"
ON public.program_exercises FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.programs p
    WHERE p.id = program_exercises.program_id
    AND (
      p.is_premade = true
      OR p.trainer_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.client_programs cp WHERE cp.program_id = p.id AND cp.client_id = auth.uid())
    )
  )
);

-- Only trainers can manage program exercises
CREATE POLICY "Trainers can manage program exercises"
ON public.program_exercises FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.programs p
    WHERE p.id = program_exercises.program_id AND p.trainer_id = auth.uid()
  )
);

-- ============================================
-- 11. RLS POLICIES FOR CLIENT_PROGRAMS
-- ============================================

-- Trainers can view all assignments, clients can view their own
CREATE POLICY "View client program assignments"
ON public.client_programs FOR SELECT
TO authenticated
USING (
  client_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Only trainers can assign programs
CREATE POLICY "Trainers can assign programs"
ON public.client_programs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Trainers can update assignments
CREATE POLICY "Trainers can update assignments"
ON public.client_programs FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Trainers can remove assignments
CREATE POLICY "Trainers can remove assignments"
ON public.client_programs FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- ============================================
-- 12. RLS POLICIES FOR WORKOUT_LOGS
-- ============================================

-- Users can view their own logs, trainers can view all
CREATE POLICY "View workout logs"
ON public.workout_logs FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
);

-- Users can log their own workouts
CREATE POLICY "Users can log workouts"
ON public.workout_logs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own logs
CREATE POLICY "Users can update own logs"
ON public.workout_logs FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own logs
CREATE POLICY "Users can delete own logs"
ON public.workout_logs FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- 13. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_exercises_name ON public.exercises(name);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_categories ON public.exercises USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_programs_trainer ON public.programs(trainer_id);
CREATE INDEX IF NOT EXISTS idx_programs_premade ON public.programs(is_premade);
CREATE INDEX IF NOT EXISTS idx_program_exercises_program ON public.program_exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_client_programs_client ON public.client_programs(client_id);
CREATE INDEX IF NOT EXISTS idx_client_programs_program ON public.client_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON public.workout_logs(logged_at);

-- ============================================
-- 14. SEED EXISTING EXERCISES FROM STATIC DATA
-- ============================================

INSERT INTO public.exercises (name, description, instructions, equipment, joint_movements, muscle_groups, movement_patterns, difficulty, intensity, duration, video_url, baseline, progression, regression, categories) VALUES
(
  'Push-ups',
  'Fundamental upper body strengthening exercise',
  'Start in a plank position with your hands right under your chest or shoulders. Wrist and elbow position can change this exercise drastically. Elbows should not exceed 45 degrees away from ribs. Elbows being closer to ribs will increase difficulty of exercise on wrists and shoulders. After finding correct position lower body as one unit from head to toes towards the floor. Taking at least 5 seconds to get to the bottom pull shoulder blades back and together, while keeping core active and hips at the same height as the shoulders from the ground.',
  ARRAY['None', 'Foam Roller'],
  ARRAY['Shoulder Flexion', 'Elbow Extension', 'Wrist Extension', 'Shoulder Retraction'],
  ARRAY['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii', 'Transverse Abdominis', 'Pectoralis Minor', 'Rhomboid', 'Teres Major'],
  ARRAY['push'],
  'intermediate',
  'moderate',
  '4-10 reps',
  'https://www.youtube.com/embed/IODxDxX7oi4',
  'Standard push-up from toes',
  'Decline push-ups with feet elevated on chair',
  'Incline push-ups with hands on chair',
  ARRAY['strength']
),
(
  'Squats',
  'The ultimate sit crushing exercise. Full body engagement.',
  'Put the 2.5 lbs plates under your heels about shoulder width apart. Grab a light weight (At least 5-10 pounds) and hold it out in front of your face or eyes. You can add a chair behind you to assist where to aim. While keeping upright posture, very slowly start lowering yourself towards the seat loading our weight backward into our hips and glutes. Touch the seat and gentle return back to start by pushing through your glutes.',
  ARRAY['2.5 lbs plates', '5'' PVC Pipe'],
  ARRAY['Ankle Dorsiflexion', 'Shoulder retraction', 'core stability', 'Knee flexion', 'knee extension', 'hip flexion', 'hip extension'],
  ARRAY['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Erector Spinae'],
  ARRAY['squat'],
  'advanced',
  'high',
  '3-15 Reps',
  NULL,
  'Bodyweight squat to 90 degrees',
  'Squat with weight plates or single-leg pistol squat',
  'Squat to chair or with heel wedges for ankle mobility assistance',
  ARRAY['mobility', 'strength']
),
(
  'Forearm Plank',
  'A foundational core stability exercise that trains the body to resist extension and maintain full-body tension. Builds strength in the deep core, shoulders, and glutes for posture and performance.',
  'Start on the floor with elbows directly under shoulders and forearms flat. Extend legs straight back, toes on the ground. Brace your core, squeeze glutes, and keep ribs down. Maintain a straight line from head to heels — don''t let hips sag or pike. Hold position for time, breathing steadily.',
  ARRAY['None'],
  ARRAY['Shoulder Flexion', 'Lumbar Neutral', 'Hip Neutral'],
  ARRAY['Rectus Abdominis', 'Transverse Abdominis', 'External Obliques', 'Internal Obliques', 'Gluteus Maximus', 'Anterior Deltoids', 'Serratus Anterior', 'Erector Spinae', 'Quadriceps'],
  ARRAY['anti-rotation'],
  'beginner',
  'moderate',
  '2–3 sets of 20–60 seconds (progress to 90 seconds)',
  'https://www.youtube.com/embed/Z9cO9_TsAV8',
  'Forearm plank with elbows under shoulders',
  'Single-arm plank or plank with leg lifts',
  'Incline plank with hands on chair/box or knee plank',
  ARRAY['strength']
),
(
  'Lunges',
  'Unilateral lower body exercise for strength, balance, and coordination',
  'Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Keep front knee tracking over ankle, back knee pointing down, and torso upright. Push through front heel to return.',
  ARRAY['None'],
  ARRAY['Ankle Dorsiflexion', 'Knee Flexion', 'Hip Flexion', 'Lumbar Neutral', 'Cervical Neutral'],
  ARRAY['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Gastrocnemius', 'Soleus'],
  ARRAY['squat'],
  'beginner',
  'moderate',
  '45 seconds each leg',
  'https://www.youtube.com/embed/QE1GDSVObyE',
  'Forward lunge with bodyweight',
  'Walking lunges or lunges with weight plates',
  'Stationary lunge with chair support or reverse lunge',
  ARRAY['mobility', 'strength']
),
(
  'Calf Raises',
  'Lower leg exercise for calf strength and ankle stability',
  'Stand with feet hip-width apart. Rise up onto toes by pushing through balls of feet. Hold briefly at top then lower slowly with control.',
  ARRAY['None'],
  ARRAY['Ankle Plantarflexion'],
  ARRAY['Gastrocnemius', 'Soleus'],
  ARRAY['push'],
  'beginner',
  'low',
  '45 seconds',
  'https://www.youtube.com/embed/QE1GDSVObyE',
  'Double-leg calf raises on flat ground',
  'Single-leg calf raises or calf raises on heel wedges',
  'Calf raises with chair support',
  ARRAY['strength']
),
(
  'Calf & Hamstring Stretch on Heel Wedges',
  'A mobility drill that combines deep ankle dorsiflexion with a hip hinge to lengthen the hamstrings while improving calf mobility. Builds control and flexibility for squats, deadlifts, and overall lower-body function.',
  'Place your heels on the heel wedges to put ankles into deep dorsiflexion. Stand tall with feet about hip-width apart, spine long and flat. Begin a hip hinge by pushing hips and butt backward as far as possible, stopping right before you lose balance — this is your true end range. Keep knees extended and chest lifted as hamstrings lengthen. Use yoga blocks under your hands for support at end range if needed. To progress: Hold a light weight (e.g., 5'' PVC Pipe or small dumbbell) in front of you, letting it gently pull you deeper into the stretch while maintaining knee extension and a neutral spine. Return to standing tall under control.',
  ARRAY['Heel Wedges', 'Yoga Blocks (optional)', '5'' PVC Pipe or light weight (optional)'],
  ARRAY['Ankle Dorsiflexion', 'Knee Extension', 'Hip Flexion', 'Lumbar Neutral'],
  ARRAY['Hamstrings', 'Gastrocnemius', 'Soleus', 'Core', 'Glutes'],
  ARRAY['hinge'],
  'beginner',
  'high',
  'Dynamic: 8-12 slow, controlled reps | Long-Hold: 2-3 sets of 30-90 seconds',
  'https://www.youtube.com/embed/9g6_GyvFqFo',
  'Calf & hamstring stretch on heel wedges with yoga block support',
  'Add light weight (5'' PVC Pipe or dumbbell) for deeper stretch',
  'Hip hinge stretch without heel wedges or with chair support',
  ARRAY['mobility']
),
(
  'Ankle Inversion',
  'Strengthening exercise for the medial ankle muscles using resistance band',
  'Sit with legs extended. Loop the yellow band around your foot and hold the other end. Turn your foot inward against the resistance, moving slowly and controlled. Return to neutral position.',
  ARRAY['Yellow Perform Better Band'],
  ARRAY['Ankle Inversion'],
  ARRAY['Tibialis Posterior', 'Flexor Digitorum Longus', 'Flexor Hallucis Longus'],
  ARRAY[],
  'beginner',
  'low',
  '10-25 reps',
  NULL,
  'Ankle inversion with yellow band resistance',
  'Ankle inversion with stronger resistance band',
  'Ankle inversion without resistance',
  ARRAY['strength']
),
(
  'Ankle Eversion',
  'Strengthening exercise for the lateral ankle muscles using resistance band',
  'Sit with legs extended. Loop the yellow band around your foot and hold the other end. Turn your foot outward against the resistance, moving slowly and controlled. Return to neutral position.',
  ARRAY['Yellow Perform Better Band'],
  ARRAY['Ankle Eversion'],
  ARRAY['Peroneus Longus', 'Peroneus Brevis', 'Peroneus Tertius'],
  ARRAY[],
  'beginner',
  'low',
  '10-25 reps',
  NULL,
  'Ankle eversion with yellow band resistance',
  'Ankle eversion with stronger resistance band',
  'Ankle eversion without resistance',
  ARRAY['strength']
),
(
  'Toe Extension Plank',
  'Deep toe extension stretch that targets the plantar fascia and improves foot mobility',
  'Stand or kneel in front of chair ready to use it for assistance. Put all 5 toes on each foot into a deep extension stretch put your elbows or hands on the chair and hold yourself up forcing a big stretch in your toes, bottom of foot/ankle, and perhaps even the quads. Keep your spine neutral.',
  ARRAY['Chair'],
  ARRAY['Toe Extension', 'Ankle Dorsiflexion', 'Lumbar Neutral'],
  ARRAY['Toe Extensors', 'Plantar Fascia', 'Quadriceps', 'Core Stabilizers'],
  ARRAY[],
  'beginner',
  'moderate',
  '20-60 seconds',
  NULL,
  'Toe extension plank with chair support',
  'Toe extension plank without chair support',
  'Toe extension stretch while seated',
  ARRAY['mobility']
),
(
  'Wrist Flexion/Extension with Forearm Spinner',
  'Intense forearm strengthening exercise using weighted resistance',
  'Tie 2.5 lb plate to string attached to the spinner. Let the string be fully unwound and weight lying on the floor. Keeping elbows and spine straight, spin the spinner to raise the weight all the way to the top and control it back to the floor. Make sure to keep your posture and elbows straight, this one burns!',
  ARRAY['Forearm Spinner', 'Two 2.5 lbs Plates'],
  ARRAY['Wrist Flexion', 'Wrist Extension'],
  ARRAY['Flexor Carpi Radialis', 'Flexor Carpi Ulnaris', 'Extensor Carpi Radialis', 'Extensor Carpi Ulnaris'],
  ARRAY[],
  'beginner',
  'high',
  '1-3 full reps up and down',
  NULL,
  'Wrist flexion/extension with forearm spinner and 2.5 lb plate',
  'Wrist flexion/extension with heavier weight',
  'Wrist flexion/extension without weight',
  ARRAY['strength']
),
(
  'Reverse Fly',
  'Posterior deltoid and rhomboid strengthening exercise using resistance band',
  'Anchor the purple band to something sturdy with an equal amount of band left on each side. Stand facing the sturdy structure and grab the handles. Place your thumbs on the back side of the handles with the rest of your fingers. Start with light tension thinking you are trying to pull the sturdy object towards you with the band while pinching your shoulder blades together.',
  ARRAY['Purple Plastic Handle'],
  ARRAY['Shoulder Horizontal Abduction', 'Shoulder External Rotation'],
  ARRAY['Posterior Deltoids', 'Rhomboids', 'Middle Trapezius'],
  ARRAY['pull'],
  'intermediate',
  'low',
  '6-15 reps',
  NULL,
  'Reverse fly with purple band',
  'Walk further away from sturdy structure',
  'Reverse fly without band',
  ARRAY['strength']
),
(
  'Standing Hip Abduction',
  'Single-leg balance exercise targeting hip abductor muscles',
  'Holding onto something sturdy align your shoulder hip and ankle on one side allowing the other foot to hover off the ground. While keeping both legs as straight as possible bring the hovering leg as far away from the standing leg.',
  ARRAY['None'],
  ARRAY['Hip Abduction'],
  ARRAY['Gluteus Medius', 'Gluteus Minimus', 'Tensor Fasciae Latae'],
  ARRAY[],
  'intermediate',
  'high',
  '8-20 reps',
  NULL,
  'Standing hip abduction with sturdy support',
  'Standing hip abduction with yellow perform better band',
  'Side-lying hip abduction',
  ARRAY['strength']
),
(
  'Side Plank',
  'Lateral core stabilization exercise targeting obliques and deep stabilizers',
  'Lie on your side with legs extended and stacked. Support your upper body on your forearm, keeping elbow directly under shoulder. Lift hips off ground, creating a straight line from head to feet. Keep shoulders, hips, and ankles aligned. Hold position while breathing normally.',
  ARRAY['None'],
  ARRAY['Cervical Neutral', 'Thoracic Lateral Flexion', 'Lumbar Lateral Flexion', 'Hip Neutral', 'Shoulder Stabilization'],
  ARRAY['External Obliques', 'Internal Obliques', 'Quadratus Lumborum', 'Transverse Abdominis', 'Gluteus Medius'],
  ARRAY['anti-rotation'],
  'beginner',
  'moderate',
  '15-45 seconds each side',
  NULL,
  'Forearm side plank with straight body alignment',
  'Side plank with leg lifts or arm reaches',
  'Modified side plank with knees on ground or against wall',
  ARRAY['strength']
),
(
  'Overhead Shoulder Flexion on Foam Roller (PVC Pipe)',
  'A mobility drill to restore full shoulder flexion while reinforcing thoracic spine extension. This exercise teaches your shoulders to move overhead without compensation from the lower back.',
  'Lie lengthwise on a foam roller so that your head and lumbar spine are supported. (Finding balance may be tricky at first — use your core to stabilize.) Grab the 5'' PVC Pipe with both hands, thumbs wrapped in the same direction as your fingers to promote slight external rotation at the shoulders. Keep ribs down and lower back flat on the roller. Slowly raise the 5'' PVC Pipe overhead as far as possible, focusing on motion coming from the shoulders and thoracic spine only. Avoid arching your low back — spine stays long and flat on the roller. Lower the bar back down under control.',
  ARRAY['Foam Roller', '5'' PVC Pipe'],
  ARRAY['Shoulder Flexion', 'Thoracic Extension', 'Lumbar Neutral', 'Shoulder External Rotation'],
  ARRAY['Anterior Deltoids', 'Middle Deltoids', 'Serratus Anterior', 'Lower Trapezius', 'Rectus Abdominis', 'Obliques'],
  ARRAY['push'],
  'beginner',
  'low',
  '8-12 controlled reps or 30-60 seconds continuous motion',
  NULL,
  'Overhead shoulder flexion with foam roller and 5'' PVC Pipe',
  'Overhead shoulder flexion with longer hold times or single-arm variations',
  'Overhead shoulder flexion without foam roller or with shorter range of motion',
  ARRAY['mobility']
),
(
  'Supine Core Stability with Band Hold',
  'A core stability drill that integrates shoulder stability with trunk control. By holding the band under tension across the chest, you train the deep core to resist extension and reinforce spinal alignment.',
  'Anchor the purple plastic-handle band securely to a stable point just above head level when lying on your back. Lie on the floor with head near the anchor and feet pointed away. Grab the band with both hands, arms extended straight above the chest or slightly lower. Pull to create tension on the band, then hold the arms steady, keeping elbows locked. Keep ribs down and low back flat to the floor. For progression: Add alternating hip flexion/leg raises while maintaining the band hold.',
  ARRAY['Purple Plastic Handle'],
  ARRAY['Shoulder Flexion', 'Lumbar Neutral', 'Hip Flexion'],
  ARRAY['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors', 'Anterior Deltoids', 'Pectoralis Major', 'Serratus Anterior', 'Lower Trapezius', 'Gluteus Maximus', 'External Obliques', 'Internal Obliques'],
  ARRAY['anti-rotation'],
  'beginner',
  'moderate',
  '2–3 sets of 20–40 seconds hold (progress to 60 seconds)',
  'https://www.youtube.com/embed/8pJqShYuhHU',
  'Supine band hold with arms extended, maintaining spinal contact',
  'Add alternating hip flexion/leg raises while maintaining band hold',
  'Reduce band tension or perform without band resistance',
  ARRAY['strength']
);

-- ============================================
-- 15. CREATE ANTI-SITTING PROTOCOL PROGRAM (EMPTY)
-- ============================================

INSERT INTO public.programs (name, description, is_template, is_premade, trainer_id)
VALUES (
  'Anti-Sitting Protocol',
  'A comprehensive daily protocol designed to counteract the effects of prolonged sitting. Perfect for office workers, gamers, and anyone who spends extended time seated.',
  true,
  true,
  NULL
);

-- Add comment explaining tables
COMMENT ON TABLE public.exercises IS 'Database-driven exercise library with full metadata for filtering and categorization';
COMMENT ON TABLE public.programs IS 'Workout programs that can be templates, premade for all users, or custom for specific clients';
COMMENT ON TABLE public.program_exercises IS 'Junction table linking exercises to programs with sets/reps and ordering';
COMMENT ON TABLE public.client_programs IS 'Assignments linking clients to their workout programs';
COMMENT ON TABLE public.workout_logs IS 'Progress tracking for client workouts with sets, reps, and weights logged';
