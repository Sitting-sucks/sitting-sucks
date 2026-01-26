-- ============================================
-- ADD ANTI-SITTING EXERCISES
-- Migration: 20260117140000
-- ============================================

-- ============================================
-- 1. UPDATE EXISTING EXERCISES
-- ============================================

-- Update Side Plank to Advanced difficulty, 15-30 seconds
UPDATE public.exercises
SET difficulty = 'advanced', duration = '15-30 seconds'
WHERE name = 'Side Plank';

-- ============================================
-- 2. ADD NEW EXERCISES - FOOT/ANKLE
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, duration, equipment, muscle_groups, joint_movements, categories, instructions, tips, video_url, intensity)
VALUES
(
  'Heel Wedge Calf Stretch',
  'A deep calf and Achilles stretch using heel wedges to increase ankle dorsiflexion range of motion. Essential for counteracting shortened calves from sitting.',
  'beginner',
  '30-90 seconds',
  ARRAY['heel wedges'],
  ARRAY['Calves', 'Achilles'],
  ARRAY['ankle dorsiflexion'],
  ARRAY['mobility', 'stretch'],
  ARRAY[
    'Place heel wedges on the floor with the elevated side toward you',
    'Stand with both heels on the wedges, toes pointing forward on the ground',
    'Keep legs straight and slowly lean forward, reaching toward your toes',
    'You should feel a deep stretch in both calves and Achilles tendons',
    'Hold the position while breathing deeply',
    'For a deeper stretch, try to touch your toes while maintaining the position'
  ],
  ARRAY[
    'Keep your weight centered over both feet',
    'Do not bounce - hold the stretch steadily',
    'If too intense, use a lower wedge angle'
  ],
  NULL,
  'low'
),
(
  'Standing Plantar Flexions',
  'Calf raises performed standing to strengthen the plantar flexor muscles. Builds strength lost from prolonged sitting.',
  'intermediate',
  '10-20 reps',
  ARRAY['none'],
  ARRAY['Calves', 'Achilles'],
  ARRAY['ankle plantar flexion'],
  ARRAY['strength'],
  ARRAY[
    'Stand with feet hip-width apart, holding a wall or chair for balance if needed',
    'Rise up onto the balls of your feet as high as possible',
    'Squeeze your calf muscles at the top of the movement',
    'Slowly lower back down with control',
    'Repeat for the prescribed number of repetitions'
  ],
  ARRAY[
    'Focus on the full range of motion - go as high as possible',
    'Control the descent - do not drop down quickly',
    'For added challenge, perform single-leg or add weight'
  ],
  NULL,
  'moderate'
),
(
  'Dorsiflexions',
  'Active ankle dorsiflexion exercise to strengthen the tibialis anterior and improve ankle mobility.',
  'intermediate',
  '10-20 reps',
  ARRAY['none'],
  ARRAY['Tibialis Anterior', 'Ankle'],
  ARRAY['ankle dorsiflexion'],
  ARRAY['strength', 'mobility'],
  ARRAY[
    'Sit on a chair or bench with feet flat on the floor',
    'Keeping your heel on the ground, lift your toes and forefoot as high as possible',
    'You should feel the muscles on the front of your shin working',
    'Hold briefly at the top, then lower with control',
    'Can also be performed standing with heel elevated on a step'
  ],
  ARRAY[
    'Focus on lifting the toes as high as possible',
    'Keep the movement controlled throughout',
    'Can use a resistance band for added difficulty'
  ],
  NULL,
  'moderate'
),
(
  'Toe Extension Stretch',
  'A stretch targeting the toe flexor muscles and plantar fascia to improve foot mobility.',
  'intermediate',
  '30-90 seconds',
  ARRAY['none'],
  ARRAY['Foot', 'Plantar Fascia', 'Toe Flexors'],
  ARRAY['toe extension'],
  ARRAY['mobility', 'stretch'],
  ARRAY[
    'Kneel on the ground with toes tucked under (tops of toes on floor)',
    'Slowly sit back onto your heels',
    'You should feel a stretch along the bottom of your feet and toes',
    'Hold the position while breathing deeply',
    'To increase intensity, sit back further onto your heels'
  ],
  ARRAY[
    'Start gently - this can be intense if you have tight feet',
    'Use a cushion under your knees if needed',
    'Breathe through the discomfort'
  ],
  NULL,
  'low'
),
(
  'Toe Flexion Strength',
  'Strengthening exercise for the toe flexor muscles to improve foot grip and stability.',
  'beginner',
  '10 reps',
  ARRAY['towel'],
  ARRAY['Foot', 'Toe Flexors'],
  ARRAY['toe flexion'],
  ARRAY['strength'],
  ARRAY[
    'Place a towel flat on the floor in front of you while seated',
    'Place your bare foot on the edge of the towel',
    'Using only your toes, scrunch the towel toward you',
    'Release and repeat, pulling more towel each time',
    'Complete the full towel length, then switch feet'
  ],
  ARRAY[
    'Keep your heel stationary on the ground',
    'Focus on using all five toes to grip',
    'Can also use marbles to pick up for variety'
  ],
  NULL,
  'low'
),
(
  'Plankle',
  'An advanced plank variation performed on the toes in dorsiflexion, combining core stability with ankle mobility.',
  'advanced',
  '15-60 seconds',
  ARRAY['none'],
  ARRAY['Core', 'Ankle', 'Tibialis Anterior'],
  ARRAY['ankle dorsiflexion', 'core stability'],
  ARRAY['strength', 'mobility'],
  ARRAY[
    'Start in a forearm plank position',
    'Instead of being on the balls of your feet, tuck your toes under so you are on the tips of your toes',
    'Your ankles should be in maximum dorsiflexion',
    'Maintain a straight line from head to heels',
    'Hold while keeping core engaged and breathing steadily'
  ],
  ARRAY[
    'This is challenging - build up time gradually',
    'Keep hips level - do not let them sag or pike up',
    'If too difficult, start with a regular plank and work up to this'
  ],
  NULL,
  'high'
),
(
  'Banded Ankle Inversion',
  'Resistance band exercise to strengthen the ankle invertor muscles for improved ankle stability.',
  'beginner',
  '20 reps',
  ARRAY['resistance band'],
  ARRAY['Ankle', 'Tibialis Posterior'],
  ARRAY['ankle inversion'],
  ARRAY['strength'],
  ARRAY[
    'Sit with legs extended in front of you',
    'Loop a resistance band around the ball of one foot',
    'Anchor the other end to a stable object to your outside',
    'Keeping your leg still, turn your foot inward against the band resistance',
    'Slowly return to the starting position',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Keep the movement isolated to the ankle - do not rotate the whole leg',
    'Control the return phase - do not let the band snap back',
    'Use appropriate resistance - you should feel challenged by the last few reps'
  ],
  NULL,
  'low'
),
(
  'Banded Ankle Eversion',
  'Resistance band exercise to strengthen the ankle evertor muscles (peroneals) for improved ankle stability.',
  'beginner',
  '20 reps',
  ARRAY['resistance band'],
  ARRAY['Ankle', 'Peroneals'],
  ARRAY['ankle eversion'],
  ARRAY['strength'],
  ARRAY[
    'Sit with legs extended in front of you',
    'Loop a resistance band around the ball of one foot',
    'Anchor the other end to a stable object to your inside (or around your other foot)',
    'Keeping your leg still, turn your foot outward against the band resistance',
    'Slowly return to the starting position',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Keep the movement isolated to the ankle - do not rotate the whole leg',
    'Control the return phase',
    'This exercise is important for ankle sprain prevention'
  ],
  NULL,
  'low'
);

-- ============================================
-- 3. ADD NEW EXERCISES - KNEE/HIP
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, duration, equipment, muscle_groups, joint_movements, categories, instructions, tips, video_url, intensity)
VALUES
(
  'Lunge with Back Leg Extension',
  'A lunge variation with emphasis on extending the back leg hip, stretching the hip flexors while strengthening the front leg.',
  'intermediate',
  '6-12 reps each side',
  ARRAY['none'],
  ARRAY['Hip Flexors', 'Quadriceps', 'Glutes', 'Hamstrings'],
  ARRAY['hip flexion', 'hip extension', 'knee flexion'],
  ARRAY['strength', 'mobility'],
  ARRAY[
    'Stand tall with feet together',
    'Step forward with one leg into a lunge position',
    'Focus on driving the back hip forward and down, feeling a stretch in the back leg hip flexor',
    'Keep your torso upright and core engaged',
    'Push through the front heel to return to standing',
    'Alternate legs or complete all reps on one side'
  ],
  ARRAY[
    'The key is the back leg - really extend that hip',
    'Keep the front knee tracking over the toes',
    'Squeeze the glute of the back leg to increase the hip flexor stretch'
  ],
  NULL,
  'moderate'
),
(
  'Foam Roller Adductor Squeeze',
  'Isometric adductor strengthening with focus on full-body posture alignment. Builds inner thigh strength while reinforcing good posture.',
  'beginner',
  '30-75 seconds',
  ARRAY['foam roller'],
  ARRAY['Adductors', 'Glutes', 'Core', 'Upper Back'],
  ARRAY['hip adduction'],
  ARRAY['strength', 'posture'],
  ARRAY[
    'Lie on your back with knees bent, feet flat on floor',
    'Place a foam roller between your knees',
    'Tuck your pelvis (flatten lower back to floor) and engage glutes',
    'Draw ribs down toward hips',
    'Squeeze shoulder blades together, pressing them into the floor',
    'While maintaining this posture, squeeze the foam roller between your knees',
    'Hold the squeeze while maintaining all postural cues'
  ],
  ARRAY[
    'This is a full-body posture exercise disguised as an adductor exercise',
    'Do not let your lower back arch off the floor',
    'Breathe steadily while holding'
  ],
  NULL,
  'low'
),
(
  'Straight Leg Raises',
  'Hip flexion exercise with a straight leg to strengthen the hip flexors and lower abdominals.',
  'intermediate',
  '4-12 reps each side',
  ARRAY['none'],
  ARRAY['Hip Flexors', 'Quadriceps', 'Lower Abs'],
  ARRAY['hip flexion'],
  ARRAY['strength'],
  ARRAY[
    'Lie on your back with one leg bent (foot flat) and one leg straight',
    'Press your lower back into the floor',
    'Keeping the leg straight, lift it up toward the ceiling',
    'Raise until your thigh is perpendicular to the floor or as high as comfortable',
    'Lower slowly with control',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Keep your lower back pressed into the floor throughout',
    'Control the lowering phase - do not drop the leg',
    'If your back arches, reduce the range of motion'
  ],
  NULL,
  'moderate'
),
(
  'Standing Hip Abduction',
  'Standing exercise to strengthen the hip abductor muscles (glute medius) essential for hip stability and pelvic control.',
  'beginner',
  '5-15 reps each side',
  ARRAY['resistance band'],
  ARRAY['Glute Medius', 'Hip Abductors'],
  ARRAY['hip abduction'],
  ARRAY['strength'],
  ARRAY[
    'Stand tall holding a wall or chair for balance',
    'If using a band, place it around both ankles or just above knees',
    'Keeping both legs straight, lift one leg out to the side',
    'Keep your hips level - do not lean to the opposite side',
    'Lower with control and repeat',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Quality over quantity - do not swing the leg',
    'Keep the moving leg slightly behind your body line',
    'Focus on squeezing the outside of your hip'
  ],
  NULL,
  'low'
),
(
  'Fire Hydrants',
  'Hip abduction exercise performed on all fours, targeting the glute medius and hip external rotators.',
  'intermediate',
  '5-15 reps each side',
  ARRAY['none'],
  ARRAY['Glute Medius', 'Hip Abductors', 'Hip External Rotators'],
  ARRAY['hip abduction', 'hip external rotation'],
  ARRAY['strength'],
  ARRAY[
    'Start on all fours with hands under shoulders and knees under hips',
    'Keep your core engaged and back flat',
    'Keeping the knee bent at 90 degrees, lift one leg out to the side',
    'Lift until your thigh is parallel to the floor or as high as comfortable',
    'Lower with control and repeat',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Do not let your hips rotate - keep them square to the floor',
    'Keep your core engaged to prevent your back from sagging',
    'Add an ankle weight or band for increased difficulty'
  ],
  NULL,
  'moderate'
);

-- ============================================
-- 4. ADD NEW EXERCISES - THORACIC/SHOULDERS
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, duration, equipment, muscle_groups, joint_movements, categories, instructions, tips, video_url, intensity)
VALUES
(
  'Overhead Thumb Taps to Wall',
  'Shoulder flexion exercise against a wall to improve overhead mobility and strengthen the shoulder flexors. Excellent for counteracting forward shoulder posture.',
  'beginner',
  '5-15 reps',
  ARRAY['wall'],
  ARRAY['Shoulders', 'Upper Back', 'Serratus Anterior'],
  ARRAY['shoulder flexion'],
  ARRAY['mobility', 'strength'],
  ARRAY[
    'Stand facing a wall, about 6 inches away',
    'Keep your spine straight and core engaged',
    'With thumbs pointing up, raise both arms overhead',
    'Try to tap the wall with your thumbs while keeping your back straight',
    'Do not arch your lower back to reach the wall',
    'Lower arms and repeat'
  ],
  ARRAY[
    'If you cannot reach without arching, stand further from the wall',
    'Keep ribs down - do not let them flare',
    'Progress by moving closer to the wall over time'
  ],
  NULL,
  'low'
),
(
  'Shoulder Abduction with Band',
  'Resistance band exercise to strengthen the lateral deltoid and supraspinatus muscles.',
  'beginner',
  '8-15 reps',
  ARRAY['resistance band'],
  ARRAY['Shoulders', 'Lateral Deltoid', 'Supraspinatus'],
  ARRAY['shoulder abduction'],
  ARRAY['strength'],
  ARRAY[
    'Stand on the middle of a resistance band with feet hip-width apart',
    'Hold the ends of the band with arms at your sides',
    'Keeping arms straight, raise them out to the sides',
    'Lift until arms are parallel to the floor',
    'Lower with control and repeat'
  ],
  ARRAY[
    'Lead with your elbows, not your hands',
    'Keep a slight bend in the elbows to protect the joint',
    'Do not shrug your shoulders - keep them down and back'
  ],
  NULL,
  'low'
),
(
  'Banded Shoulder Extension',
  'Resistance band exercise to strengthen the shoulder extensors (lats, rear delts, triceps long head).',
  'intermediate',
  '5-15 reps',
  ARRAY['resistance band'],
  ARRAY['Lats', 'Rear Deltoid', 'Triceps'],
  ARRAY['shoulder extension'],
  ARRAY['strength'],
  ARRAY[
    'Anchor a resistance band at chest height or higher',
    'Face the anchor point holding the band with straight arms at shoulder height',
    'Keeping arms straight, pull the band down and back past your hips',
    'Squeeze your lats and rear delts at the bottom',
    'Return to start with control and repeat'
  ],
  ARRAY[
    'Keep your core engaged - do not lean back',
    'Focus on using your back muscles, not just your arms',
    'Control the return phase'
  ],
  NULL,
  'moderate'
),
(
  'Spinal Extensions',
  'Prone back extension exercise to strengthen the spinal erectors and improve thoracic extension mobility.',
  'advanced',
  '5-30 seconds hold or 5-15 reps',
  ARRAY['none'],
  ARRAY['Spinal Erectors', 'Upper Back', 'Glutes'],
  ARRAY['spinal extension'],
  ARRAY['strength', 'mobility'],
  ARRAY[
    'Lie face down with arms at your sides or hands behind your head',
    'Engage your glutes and core',
    'Lift your chest off the ground by extending your spine',
    'Keep your neck neutral - look at the floor just ahead of you',
    'Hold at the top or lower and repeat for reps',
    'Focus on extending through the thoracic spine, not just the lower back'
  ],
  ARRAY[
    'Do not hyperextend your neck',
    'Squeeze your glutes to protect your lower back',
    'The movement should come from your upper back, not just your lower back'
  ],
  NULL,
  'moderate'
),
(
  'Eccentric Cable Flies',
  'Cable fly variation with focus on the eccentric (lowering) phase to build chest strength and improve shoulder stability.',
  'intermediate',
  '5-15 reps',
  ARRAY['cable machine'],
  ARRAY['Chest', 'Anterior Deltoid', 'Biceps'],
  ARRAY['shoulder horizontal adduction'],
  ARRAY['strength'],
  ARRAY[
    'Set cable pulleys to shoulder height',
    'Stand in the center holding both handles with arms extended to the sides',
    'Step forward slightly for tension',
    'Bring hands together in front of your chest with a slight bend in elbows',
    'Slowly (3-5 seconds) let arms return to the starting position',
    'The slow eccentric is the focus of this exercise'
  ],
  ARRAY[
    'The slow lowering phase is where the work happens',
    'Keep a slight bend in your elbows throughout',
    'Do not let your shoulders roll forward'
  ],
  NULL,
  'moderate'
);

-- ============================================
-- 5. ADD NEW EXERCISES - ADDITIONAL
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, duration, equipment, muscle_groups, joint_movements, categories, instructions, tips, video_url, intensity, tags)
VALUES
(
  'Single Leg Hamstring Stretch',
  'A deep hamstring stretch with the heel elevated to target the full length of the hamstring and improve hip flexion mobility.',
  'beginner',
  '30-90 seconds each side',
  ARRAY['box', 'bench'],
  ARRAY['Hamstrings', 'Calves'],
  ARRAY['hip flexion', 'knee extension'],
  ARRAY['mobility', 'stretch'],
  ARRAY[
    'Place one heel on an elevated surface (bench, box, or chair)',
    'Keep the elevated leg straight with toes pointing up',
    'Stand tall on your supporting leg',
    'Hinge forward at the hips, keeping your back straight',
    'Reach toward your elevated foot',
    'For a deeper stretch, pull your toes toward you',
    'Hold and breathe, then switch sides'
  ],
  ARRAY[
    'Keep your back straight - do not round your spine',
    'The stretch should be felt in the back of the thigh',
    'Adjust the height of the surface to match your flexibility'
  ],
  NULL,
  'low',
  NULL
),
(
  'Roman Chair Hip Extension',
  'Hip extension exercise on a roman chair or GHD to strengthen the glutes, hamstrings, and spinal erectors. A powerful exercise for reversing the effects of sitting.',
  'intermediate',
  '5-15 reps',
  ARRAY['roman chair', 'GHD'],
  ARRAY['Glutes', 'Hamstrings', 'Spinal Erectors'],
  ARRAY['hip extension'],
  ARRAY['strength'],
  ARRAY[
    'Position yourself face down on the roman chair with hips at the edge of the pad',
    'Secure your ankles under the foot pads',
    'Cross arms over chest or behind head',
    'Lower your torso toward the ground with control',
    'Engage glutes and hamstrings to raise back up until your body is straight',
    'Do not hyperextend at the top'
  ],
  ARRAY[
    'This is one of the best exercises for counteracting sitting (Sitting Squasher!)',
    'Focus on using your glutes, not just your lower back',
    'Add weight held at chest for progression'
  ],
  NULL,
  'moderate',
  ARRAY['sitting squasher']
),
(
  'Deadlift',
  'Fundamental hip hinge movement that strengthens the entire posterior chain. Essential for building the strength lost from prolonged sitting.',
  'advanced',
  '5-15 reps',
  ARRAY['barbell', 'dumbbells'],
  ARRAY['Glutes', 'Hamstrings', 'Lower Back', 'Upper Back', 'Core', 'Grip'],
  ARRAY['hip extension', 'knee extension'],
  ARRAY['strength'],
  ARRAY[
    'Stand with feet hip-width apart, barbell over mid-foot',
    'Hinge at hips and bend knees to grip the bar just outside your legs',
    'Keep chest up, back flat, and shoulders slightly in front of the bar',
    'Take a deep breath and brace your core',
    'Drive through the floor, extending hips and knees simultaneously',
    'Stand tall at the top, squeezing glutes',
    'Reverse the movement to lower the bar with control'
  ],
  ARRAY[
    'Keep the bar close to your body throughout the lift',
    'Do not round your lower back',
    'Start with lighter weight to master the movement pattern'
  ],
  NULL,
  'high',
  NULL
),
(
  'Dead Hangs',
  'Passive hanging from a bar to decompress the spine, stretch the lats, and improve grip strength.',
  'intermediate',
  '10-60 seconds',
  ARRAY['pull-up bar'],
  ARRAY['Lats', 'Shoulders', 'Grip', 'Spine'],
  ARRAY['shoulder flexion', 'spinal decompression'],
  ARRAY['mobility', 'strength'],
  ARRAY[
    'Grip a pull-up bar with palms facing away, hands shoulder-width apart',
    'Let your body hang freely with arms fully extended',
    'Relax your shoulders and let them stretch upward',
    'Keep knuckles pointing toward the ceiling',
    'Breathe deeply and allow your spine to decompress',
    'Hold for the prescribed time'
  ],
  ARRAY[
    'If you cannot hang for 30 seconds, use a box to support some weight',
    'Focus on relaxing and letting gravity stretch you',
    'This is excellent for spinal health after sitting'
  ],
  NULL,
  'low',
  NULL
),
(
  'Rows',
  'Horizontal pulling exercise to strengthen the upper back, lats, and biceps. Essential for counteracting forward shoulder posture from sitting.',
  'beginner',
  '8-15 reps',
  ARRAY['cable machine', 'barbell', 'dumbbells'],
  ARRAY['Lats', 'Rhomboids', 'Rear Deltoid', 'Biceps', 'Core'],
  ARRAY['shoulder extension', 'elbow flexion'],
  ARRAY['strength'],
  ARRAY[
    'For cable rows: Sit at a cable station with feet on the platform, knees slightly bent',
    'Grip the handle with arms extended',
    'Pull the handle to your lower chest/upper abdomen',
    'Squeeze your shoulder blades together at the end of the movement',
    'Extend arms with control and repeat',
    'Can also be performed with barbell, dumbbells, or machines'
  ],
  ARRAY[
    'Lead with your elbows, not your hands',
    'Keep your chest up and do not round your back',
    'Focus on squeezing your shoulder blades together'
  ],
  NULL,
  'moderate',
  NULL
),
(
  'Triceps Extension with Shoulder Extension',
  'Triceps exercise performed with the arm behind the body to emphasize the long head of the triceps and shoulder extension.',
  'beginner',
  '10-20 reps each arm',
  ARRAY['dumbbell', 'cable machine'],
  ARRAY['Triceps', 'Rear Deltoid'],
  ARRAY['elbow extension', 'shoulder extension'],
  ARRAY['strength'],
  ARRAY[
    'Stand or sit with a dumbbell in one hand',
    'Extend your arm behind you with elbow bent',
    'Your upper arm should be parallel to the floor or slightly behind your body',
    'Keeping upper arm still, extend your elbow to straighten the arm',
    'Squeeze the triceps at full extension',
    'Lower with control and repeat'
  ],
  ARRAY[
    'Keep your upper arm stationary - only move at the elbow',
    'The shoulder-back position emphasizes the long head of triceps',
    'Can also be performed with a cable for constant tension'
  ],
  NULL,
  'low',
  NULL
),
(
  'Farmers Carry',
  'Loaded carry exercise to build grip strength, core stability, and full-body strength while walking.',
  'intermediate',
  '30-60 seconds or distance',
  ARRAY['dumbbells', 'kettlebells', 'farmers carry handles'],
  ARRAY['Grip', 'Core', 'Upper Traps', 'Full Body'],
  ARRAY['core stability', 'grip'],
  ARRAY['strength'],
  ARRAY[
    'Pick up heavy weights in each hand',
    'Stand tall with shoulders back and down',
    'Keep your core braced and maintain good posture',
    'Walk forward with controlled steps',
    'Keep the weights from swinging',
    'Walk for prescribed time or distance'
  ],
  ARRAY[
    'Choose a weight that challenges your grip',
    'Keep your shoulders packed down - do not let them shrug up',
    'Take shorter steps to maintain stability'
  ],
  NULL,
  'moderate',
  NULL
),
(
  'Bicep Curls',
  'Classic arm exercise to strengthen the biceps and forearm flexors.',
  'intermediate',
  '5-15 reps',
  ARRAY['dumbbells', 'barbell', 'cable machine'],
  ARRAY['Biceps', 'Forearms'],
  ARRAY['elbow flexion'],
  ARRAY['strength'],
  ARRAY[
    'Stand with weights in hands, arms at sides, palms facing forward',
    'Keep your elbows close to your body',
    'Curl the weights up by bending your elbows',
    'Squeeze your biceps at the top',
    'Lower with control and repeat'
  ],
  ARRAY[
    'Do not swing the weights - use controlled movement',
    'Keep your elbows stationary at your sides',
    'Can vary grip (supinated, neutral, pronated) to target different areas'
  ],
  NULL,
  'moderate',
  NULL
),
(
  'Captains Chair Leg Raise',
  'Advanced core exercise using a captain''s chair to strengthen the hip flexors and lower abdominals.',
  'advanced',
  '10-30 seconds hold or 5-15 reps',
  ARRAY['captains chair'],
  ARRAY['Lower Abs', 'Hip Flexors', 'Core'],
  ARRAY['hip flexion'],
  ARRAY['strength'],
  ARRAY[
    'Position yourself in the captain''s chair with back against the pad',
    'Grip the handles firmly with arms supporting your body',
    'Let your legs hang straight down',
    'Engage your core and lift your knees toward your chest',
    'For straight leg variation, keep legs straight and lift to parallel',
    'Lower with control and repeat, or hold at the top'
  ],
  ARRAY[
    'Do not swing - control the movement throughout',
    'Focus on using your abs, not momentum',
    'Keep your back pressed against the pad'
  ],
  NULL,
  'high',
  NULL
),
(
  'Banded Cable Rotation',
  'Rotational core exercise using a cable or band to strengthen the obliques and improve rotational stability.',
  'intermediate',
  '8-20 reps each side',
  ARRAY['cable machine', 'resistance band'],
  ARRAY['Obliques', 'Core', 'Shoulders'],
  ARRAY['spinal rotation'],
  ARRAY['strength'],
  ARRAY[
    'Set a cable at chest height or anchor a band',
    'Stand sideways to the anchor point, feet shoulder-width apart',
    'Hold the handle with both hands, arms extended at chest height',
    'Rotate your torso away from the anchor point',
    'Keep your hips facing forward - the rotation comes from your core',
    'Return with control and repeat',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'Keep your arms straight - the movement is in your torso',
    'Do not let your hips rotate',
    'Control the return phase - do not let the cable pull you back'
  ],
  NULL,
  'moderate',
  NULL
),
(
  'Pallof Press',
  'Anti-rotation core exercise that builds core stability and resistance to rotational forces.',
  'intermediate',
  '8-20 reps each side',
  ARRAY['cable machine', 'resistance band'],
  ARRAY['Core', 'Obliques', 'Shoulders'],
  ARRAY['core stability', 'anti-rotation'],
  ARRAY['strength'],
  ARRAY[
    'Set a cable at chest height or anchor a band',
    'Stand sideways to the anchor point, feet shoulder-width apart',
    'Hold the handle at your chest with both hands',
    'Brace your core and press the handle straight out in front of you',
    'Hold briefly with arms extended, resisting the pull to rotate',
    'Bring hands back to chest and repeat',
    'Complete all reps on one side before switching'
  ],
  ARRAY[
    'The goal is to NOT rotate - resist the cable pulling you',
    'Keep your hips and shoulders square',
    'Squeeze your glutes and brace your core throughout'
  ],
  NULL,
  'moderate',
  NULL
);

-- ============================================
-- 6. ADD VIDEO COMING SOON NOTE
-- Update all new exercises to indicate video is coming
-- ============================================

UPDATE public.exercises
SET tips = array_append(tips, '📹 Video demonstration coming soon!')
WHERE video_url IS NULL
AND created_at > NOW() - INTERVAL '1 minute';
