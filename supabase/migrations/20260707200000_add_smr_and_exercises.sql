-- ============================================
-- ADD SMR TECHNIQUES & NEW EXERCISES
-- Migration: 20260707200000
-- ============================================
-- Adds ~35 new exercises covering SMR, lower body,
-- upper body, and cervical mobility for the Sitting
-- Sucks program protocol system.
-- ============================================

-- ============================================
-- 1. SMR (Self-Myofascial Release) — MOBILITY
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, intensity, duration, equipment, muscle_groups, joint_movements, categories, instructions, baseline, progression, regression, video_url)
VALUES

(
  'SMR Glute Med/Min on Foam Roller',
  'Deep gluteal release using a foam roller with the foot crossed to the opposite knee for external rotation. Essential for releasing tight glutes caused by prolonged sitting.',
  'beginner', 'low', '30-90 seconds each side',
  ARRAY['Foam Roller'],
  ARRAY['Gluteus Medius', 'Gluteus Minimus', 'Piriformis'],
  ARRAY['Hip External Rotation', 'Hip Neutral'],
  ARRAY['mobility', 'smr'],
  ARRAY['Sit on foam roller with one foot placed on the opposite knee', 'Lean slightly toward the side being worked', 'Roll slowly over the glute area', 'Pause on tender spots for 30+ seconds until they release', 'Switch sides and repeat'],
  ARRAY['SMR glute on foam roller with foot on opposite knee'],
  ARRAY['Single-leg glute SMR with weight shift for deeper pressure'],
  ARRAY['SMR glute on a softer surface or with both feet on the ground'],
  NULL
),
(
  'SMR TFL Release',
  'Targeted release of the Tensor Fasciae Latae using a lacrosse ball or foam roller. The TFL gets chronically tight from sitting and contributes to hip and knee pain.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Lacrosse Ball', 'Foam Roller'],
  ARRAY['Tensor Fasciae Latae', 'IT Band'],
  ARRAY['Hip Neutral'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie on your side with the TFL area (front-lateral hip) on a lacrosse ball or foam roller', 'Support yourself with your forearm', 'Roll slowly over the TFL area just below the hip bone', 'Pause on tender spots for 30+ seconds', 'Breath deeply and allow the muscle to release', 'Switch sides'],
  ARRAY['TFL SMR with lacrosse ball lying on side'],
  ARRAY['TFL SMR with lacrosse ball against wall for deeper pressure'],
  ARRAY['TFL SMR with foam roller (less pressure)'],
  NULL
),
(
  'SMR Vastus Medialis',
  'Release of the inner quad (VMO) using a foam roller or lacrosse ball. The VMO is often weak and inhibited in desk workers, contributing to knee tracking issues.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Foam Roller', 'Lacrosse Ball'],
  ARRAY['Vastus Medialis', 'Quadriceps'],
  ARRAY['Knee Extension'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie face down with the inner thigh on a foam roller or lacrosse ball', 'Roll slowly along the VMO area (inner quad just above the knee)', 'Pause on tender spots for 30+ seconds', 'Switch legs and repeat'],
  ARRAY['VMO SMR on foam roller lying face down'],
  ARRAY['VMO SMR with lacrosse ball for targeted pressure'],
  ARRAY['VMO SMR with softer roller or lighter pressure'],
  NULL
),
(
  'SMR Rectus Femoris',
  'Release of the rectus femoris (front hip flexor portion of the quad) using a foam roller. Tight from prolonged sitting — contributes to anterior pelvic tilt.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Foam Roller'],
  ARRAY['Rectus Femoris', 'Quadriceps', 'Hip Flexors'],
  ARRAY['Hip Flexion', 'Knee Extension'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie face down with foam roller under the front of the thigh', 'Roll from hip to just above the knee', 'Pause on tender spots, especially near the hip attachment', 'Breathe and allow release', 'Switch legs'],
  ARRAY['Rectus femoris SMR on foam roller lying face down'],
  ARRAY['Rectus femoris SMR with one leg crossed for more pressure'],
  ARRAY['Rectus femoris SMR on softer roller'],
  NULL
),
(
  'SMR Rhomboid',
  'Upper back SMR targeting the rhomboids using a foam roller or lacrosse ball against a wall. Releases tightness from slouched desk posture.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Foam Roller', 'Lacrosse Ball'],
  ARRAY['Rhomboid', 'Upper Back'],
  ARRAY['Scapular Retraction', 'Thoracic Extension'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie on your back with a foam roller under the upper back at the rhomboid level', 'Cross arms over chest', 'Roll slowly over the area between shoulder blades', 'For targeted work, use a lacrosse ball against a wall', 'Pause on tender spots for 30+ seconds'],
  ARRAY['Rhomboid SMR on foam roller lying on back'],
  ARRAY['Rhomboid SMR with lacrosse ball against wall'],
  ARRAY['Rhomboid SMR on softer foam roller'],
  NULL
),
(
  'SMR Teres Major/Minor',
  'SMR for the teres major and minor using a lacrosse ball against a wall. These muscles get tight from poor overhead mechanics and rounded shoulders.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Lacrosse Ball'],
  ARRAY['Teres Major', 'Teres Minor', 'Rotator Cuff'],
  ARRAY['Shoulder Internal Rotation', 'Shoulder Adduction'],
  ARRAY['mobility', 'smr'],
  ARRAY['Place a lacrosse ball between the back of your armpit area and a wall', 'Lean into the ball and roll slowly over the teres area', 'Pause on tender spots for 30+ seconds', 'Switch sides'],
  ARRAY['Teres SMR with lacrosse ball against wall'],
  ARRAY['Teres SMR with ball against wall and arm overhead for deeper stretch'],
  ARRAY['Teres SMR with foam roller (less targeted)'],
  NULL
),
(
  'SMR Latissimus Dorsi',
  'SMR for the lats using a foam roller. Tight lats pull the shoulders down and internally rotate the arms — common in desk workers.',
  'beginner', 'low', '30-90 seconds each side',
  ARRAY['Foam Roller', 'Lacrosse Ball'],
  ARRAY['Latissimus Dorsi', 'Upper Back'],
  ARRAY['Shoulder Extension', 'Shoulder Adduction', 'Shoulder Internal Rotation'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie on your side with a foam roller under the lat area (just below armpit)', 'Roll from armpit down to the rib cage', 'Pause on tender spots for 30+ seconds', 'Switch sides', 'For targeted work, use a lacrosse ball against a wall'],
  ARRAY['Lat SMR on foam roller lying on side'],
  ARRAY['Lat SMR with arm overhead for increased stretch during release'],
  ARRAY['Lat SMR on softer roller'],
  NULL
),
(
  'SMR Infraspinatus',
  'SMR for the infraspinatus (rotator cuff) using a lacrosse ball against a wall. Essential for shoulder health — desk posture weakens and tightens this muscle.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Lacrosse Ball'],
  ARRAY['Infraspinatus', 'Rotator Cuff'],
  ARRAY['Shoulder External Rotation'],
  ARRAY['mobility', 'smr'],
  ARRAY['Place a lacrosse ball between the back of the shoulder blade and a wall', 'Lean into the ball', 'Roll slowly around the shoulder blade area', 'Pause on tender spots for 30+ seconds', 'Switch sides'],
  ARRAY['Infraspinatus SMR with lacrosse ball against wall'],
  ARRAY['Infraspinatus SMR with ball against wall and arm at different angles'],
  ARRAY['Infraspinatus SMR on foam roller (broader area)'],
  NULL
),
(
  'SMR Levator Scapulae',
  'SMR for the levator scapulae using a lacrosse ball. This muscle gets chronically tight from desk posture and is a major contributor to neck tension and headaches.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Lacrosse Ball'],
  ARRAY['Levator Scapulae', 'Neck', 'Upper Trapezius'],
  ARRAY['Cervical Lateral Flexion', 'Scapular Elevation'],
  ARRAY['mobility', 'smr'],
  ARRAY['Place a lacrosse ball between the top corner of your shoulder blade and a wall', 'Lean in and roll slowly at the angle where the neck meets the shoulder', 'Pause on tender spots for 30+ seconds', 'Breathe deeply and allow release', 'Switch sides'],
  ARRAY['Levator scapulae SMR with lacrosse ball against wall'],
  ARRAY['Levator SMR with gentle neck side-bend during release'],
  ARRAY['Levator SMR on foam roller (broader, less pressure)'],
  NULL
),
(
  'SMR Scalene',
  'Gentle SMR for the scalene muscles of the neck using a lacrosse ball. Tight scalenes from desk posture contribute to neck pain, headaches, and breathing dysfunction.',
  'beginner', 'low', '20-40 seconds each side',
  ARRAY['Lacrosse Ball'],
  ARRAY['Scalenes', 'Neck'],
  ARRAY['Cervical Lateral Flexion', 'Cervical Flexion'],
  ARRAY['mobility', 'smr'],
  ARRAY['Use a lacrosse ball against a wall at the side of the neck (just off the spine)', 'Apply very light pressure', 'Hold on tender spots for 20-40 seconds', 'Breathe deeply', 'Switch sides', 'CAUTION: Neck is delicate — use minimal pressure'],
  ARRAY['Scalene SMR with lacrosse ball — light pressure against wall'],
  ARRAY['Scalene SMR with ball behind a towel roll for more control'],
  ARRAY['Scalene SMR with finger pressure only (no ball)'],
  NULL
),
(
  'SMR Serratus Anterior',
  'SMR for the serratus anterior using a lacrosse ball against a wall. The serratus wraps around the ribs and holds the scapula flat — weak serratus = scapular winging.',
  'beginner', 'low', '30-60 seconds each side',
  ARRAY['Lacrosse Ball'],
  ARRAY['Serratus Anterior', 'Rib Cage'],
  ARRAY['Scapular Protraction', 'Shoulder Flexion'],
  ARRAY['mobility', 'smr'],
  ARRAY['Place a lacrosse ball between the side rib cage and a wall', 'Lean into the ball', 'Roll along the ribs from armpit level to the bottom of the rib cage', 'Pause on tender spots for 30+ seconds', 'Switch sides'],
  ARRAY['Serratus SMR with lacrosse ball against wall'],
  ARRAY['Serratus SMR with arm overhead during release'],
  ARRAY['Serratus SMR on foam roller (less targeted)'],
  NULL
),
(
  'SMR Longissimus Thoracis',
  'SMR for the longissimus thoracis (erector spinae) using a foam roller. Releases chronic tightness in the spinal erectors from prolonged sitting.',
  'beginner', 'low', '30-90 seconds',
  ARRAY['Foam Roller'],
  ARRAY['Longissimus Thoracis', 'Erector Spinae', 'Lower Back', 'Upper Back'],
  ARRAY['Lumbar Extension', 'Thoracic Extension'],
  ARRAY['mobility', 'smr'],
  ARRAY['Lie on your back with a foam roller under the spine', 'Arms crossed over chest', 'Slowly roll from the upper to lower back', 'Pause on tight spots for 30+ seconds', 'Breathe deeply into the tight areas'],
  ARRAY['Erector spinae SMR on foam roller lying on back'],
  ARRAY['Erector spinae SMR on foam roller with one leg extended for more pressure'],
  ARRAY['Erector spinae SMR on softer roller or towel roll'],
  NULL
);

-- ============================================
-- 2. STRENGTH & MOBILITY — LOWER BODY
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, intensity, duration, equipment, muscle_groups, joint_movements, categories, instructions, baseline, progression, regression, video_url)
VALUES

(
  'Hip Hinge',
  'The fundamental hip hinge pattern. Teaches loading the posterior chain (glutes and hamstrings) instead of the lower back. Essential for desk workers whose glutes are shut off.',
  'beginner', 'low', '8-12 reps',
  ARRAY['None', '5'' PVC Pipe'],
  ARRAY['Gluteus Maximus', 'Hamstrings', 'Erector Spinae'],
  ARRAY['Hip Flexion', 'Hip Extension', 'Lumbar Neutral'],
  ARRAY['mobility', 'strength'],
  ARRAY['Stand with feet hip-width apart', 'Place a PVC pipe along your spine (touching head, upper back, and tailbone)', 'Push hips back as if closing a car door with your butt', 'Keep the spine contact with the pipe throughout', 'Lower torso until you feel a stretch in the hamstrings', 'Squeeze glutes to return to standing', 'The pipe should not lose contact with your spine at any point'],
  ARRAY['Hip hinge with PVC pipe maintaining 3-point contact'],
  ARRAY['Single-leg hip hinge or hinge with light weight'],
  ARRAY['Hinge to a chair or box for depth control'],
  NULL
),
(
  'Nordic Hamstring Curl',
  'An eccentric hamstring exercise that builds strength and resilience in the posterior chain. Counteracts the weak, lengthened hamstrings from prolonged sitting.',
  'intermediate', 'high', '3-6 reps each side',
  ARRAY['None', 'Nordic Hamstring Curl Board'],
  ARRAY['Hamstrings', 'Gluteus Maximus', 'Calves'],
  ARRAY['Knee Flexion'],
  ARRAY['strength'],
  ARRAY['Kneel on a pad with ankles secured under a support or held by a partner', 'Keep body in a straight line from knees to head', 'Slowly lower your torso toward the floor while resisting with your hamstrings', 'Lower as far as you can control', 'Catch yourself with hands and push back up', 'Progress toward catching yourself later'],
  ARRAY['Eccentric nordic hamstring curl — controlled descent'],
  ARRAY['Full nordic hamstring curl (no hands)'],
  ARRAY['Band-assisted nordic curl or reduced range of motion'],
  NULL
),
(
  'Single Leg Standing Hip Flexion',
  'Standing hip flexion exercise to strengthen the psoas and hip flexors in a weight-bearing position. Restores hip function lost from sitting.',
  'beginner', 'moderate', '8-15 reps each side',
  ARRAY['None', 'Resistance Band'],
  ARRAY['Hip Flexors', 'Psoas', 'Rectus Femoris', 'Core Stabilizers'],
  ARRAY['Hip Flexion', 'Lumbar Neutral'],
  ARRAY['strength'],
  ARRAY['Stand tall holding a wall or chair for balance', 'Lift one knee toward your chest as high as comfortable', 'Keep the standing leg straight and core engaged', 'Lower with control', 'Repeat for reps', 'Switch legs', 'For added resistance, use a band anchored at foot level'],
  ARRAY['Standing hip flexion — bodyweight only'],
  ARRAY['Standing hip flexion with resistance band'],
  ARRAY['Seated knee raises or supine hip flexion'],
  NULL
),
(
  'Couch Stretch',
  'Deep hip flexor stretch using a couch or bench. The single most effective stretch for the psoas and rectus femoris — both chronically shortened from sitting.',
  'intermediate', 'high', '60-120 seconds each side',
  ARRAY['Chair', 'Couch', 'Bench'],
  ARRAY['Hip Flexors', 'Psoas', 'Rectus Femoris', 'Quadriceps'],
  ARRAY['Hip Extension', 'Knee Flexion', 'Lumbar Neutral'],
  ARRAY['mobility', 'stretch'],
  ARRAY['Kneel in front of a couch or bench with one foot on the floor and the other foot resting on the surface behind you', 'The back foot should be against the vertical surface with the shin and top of foot flat', 'Keep the front leg at 90 degrees', 'Tuck your tailbone under (posterior pelvic tilt)', 'Hold upright, breathing deeply', 'For more intensity, raise the torso or lean back slightly', 'Switch sides'],
  ARRAY['Couch stretch with back foot on bench, upright posture'],
  ARRAY['Couch stretch with arm overhead for deeper hip flexor engagement'],
  ARRAY['Half-kneeling hip flexor stretch (no elevated surface)'],
  NULL
),
(
  'Step Ups',
  'Unilateral strength exercise that builds leg drive, balance, and coordination. Replicates stair climbing — a fundamental human movement that desk workers lose.',
  'intermediate', 'moderate', '8-12 reps each side',
  ARRAY['Box', 'Bench', 'Chair'],
  ARRAY['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves'],
  ARRAY['Hip Flexion', 'Hip Extension', 'Knee Flexion', 'Knee Extension', 'Ankle Dorsiflexion'],
  ARRAY['strength'],
  ARRAY['Stand facing a box or bench at knee height', 'Step up with one foot, driving through the heel', 'Stand fully on the box without pushing off the back foot', 'Step down with control', 'Repeat for reps', 'Switch legs'],
  ARRAY['Step ups on knee-height box, bodyweight'],
  ARRAY['Step ups with added weight (dumbbells or plate)'],
  ARRAY['Lower box height for reduced range of motion'],
  NULL
),
(
  'Step Downs',
  'Eccentric unilateral exercise that builds knee stability and control. Essential for desk workers with patellar tracking issues.',
  'intermediate', 'moderate', '6-10 reps each side',
  ARRAY['Box', 'Bench'],
  ARRAY['Quadriceps', 'Gluteus Maximus', 'VMO', 'Core Stabilizers'],
  ARRAY['Knee Flexion', 'Hip Flexion', 'Lumbar Neutral'],
  ARRAY['strength'],
  ARRAY['Stand on a box or bench at knee height', 'Slowly lower one foot toward the floor, controlling the descent', 'Touch the floor gently with the heel', 'Drive back up through the standing leg', 'Control the knee — keep it tracking over the toes', 'Repeat for reps', 'Switch legs'],
  ARRAY['Step downs on knee-height box, controlled descent'],
  ARRAY['Step downs with pause at bottom for added time under tension'],
  ARRAY['Lower box height or use a hand for balance'],
  NULL
);

-- ============================================
-- 3. STRENGTH — UPPER BODY (NEW)
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, intensity, duration, equipment, muscle_groups, joint_movements, categories, instructions, baseline, progression, regression, video_url)
VALUES

(
  'Jesus Stretch (Chest Stretch)',
  'The ultimate chest opener. Opens the pectorals that are shortened from slouched desk posture. Essential for counteracting rounded shoulders and forward head posture.',
  'beginner', 'moderate', '60-90 seconds',
  ARRAY['None', 'Doorway'],
  ARRAY['Pectoralis Major', 'Pectoralis Minor', 'Anterior Deltoids'],
  ARRAY['Shoulder Extension', 'Shoulder External Rotation', 'Thoracic Extension'],
  ARRAY['mobility', 'stretch'],
  ARRAY['Stand facing a doorway with arms out at 90 degrees, elbows bent, forearms against the door frame', 'Step one foot forward through the doorway', 'Lean your weight forward, feeling a stretch through the chest', 'Keep your spine tall and chin tucked', 'Breathe deeply for 60-90 seconds', 'Adjust arm height (low/mid/high) to target different pec fibers'],
  ARRAY['Doorway chest stretch with arms at 90 degrees'],
  ARRAY['Doorway stretch with one arm overhead for pec minor emphasis'],
  ARRAY['Single-arm doorway stretch with less lean'],
  NULL
),
(
  'Underhand Dead Hang',
  'A dead hang with palms facing you (supinated grip). Emphasizes biceps and lats while decompressing the spine. Essential for shoulder health and grip strength.',
  'intermediate', 'high', '20-60 seconds',
  ARRAY['Pull Up Bar'],
  ARRAY['Latissimus Dorsi', 'Biceps', 'Forearm Flexors', 'Core Stabilizers'],
  ARRAY['Shoulder Flexion', 'Shoulder Extension', 'Elbow Flexion', 'Scapular Retraction'],
  ARRAY['strength', 'mobility'],
  ARRAY['Grip a pull-up bar with palms facing you (underhand), hands shoulder-width', 'Hang with arms fully extended', 'Pull your shoulders down and back (active hang)', 'Keep core tight and ribs down', 'Hold for time', 'Breathe steadily'],
  ARRAY['Underhand active hang — 20 second holds'],
  ARRAY['Underhand dead hang with scapular pull-ups'],
  ARRAY['Underhand dead hang with feet on the ground for partial support'],
  NULL
),
(
  'Pull Up',
  'The king of upper body pulling exercises. Builds lat strength, grip, and scapular control — all of which are weak in desk workers.',
  'advanced', 'high', '3-8 reps',
  ARRAY['Pull Up Bar'],
  ARRAY['Latissimus Dorsi', 'Biceps', 'Rhomboid', 'Trapezius', 'Core Stabilizers'],
  ARRAY['Shoulder Extension', 'Shoulder Adduction', 'Elbow Flexion', 'Scapular Retraction'],
  ARRAY['strength'],
  ARRAY['Grip a pull-up bar with palms facing away (overhand), slightly wider than shoulder-width', 'Hang with arms fully extended', 'Pull yourself up until your chin clears the bar', 'Lower with control to full extension', 'Keep core tight throughout — no swinging'],
  ARRAY['Full pull ups — 3-8 controlled reps'],
  ARRAY['Weighted pull ups or archer pull ups'],
  ARRAY['Band-assisted pull ups or negative-only pulls'],
  NULL
),
(
  'Pull Down',
  'Lat pulldown variation for building back strength. Alternative to pull ups for those building up to the full movement.',
  'intermediate', 'high', '8-12 reps',
  ARRAY['Pull Up Bar', 'Resistance Band', 'Cable Machine'],
  ARRAY['Latissimus Dorsi', 'Biceps', 'Rhomboid', 'Core Stabilizers'],
  ARRAY['Shoulder Extension', 'Shoulder Adduction', 'Elbow Flexion', 'Scapular Retraction'],
  ARRAY['strength'],
  ARRAY['Grip a pull-up bar or cable attachment with hands wider than shoulder-width', 'Pull the bar down to your upper chest', 'Squeeze the lats at the bottom', 'Control the bar back up', 'Keep torso stable — no leaning back'],
  ARRAY['Band or cable lat pulldown — controlled tempo'],
  ARRAY['Weighted lat pulldown with full stack'],
  ARRAY['Assisted pulldown machine or lighter band resistance'],
  NULL
),
(
  'Overhead Press',
  'Standing overhead pressing builds shoulder strength, stability, and core control. Essential for restoring overhead function lost from desk work.',
  'intermediate', 'moderate', '6-10 reps',
  ARRAY['Dumbbells', 'Barbell', 'Resistance Band'],
  ARRAY['Deltoids', 'Triceps', 'Upper Trapezius', 'Serratus Anterior', 'Core Stabilizers'],
  ARRAY['Shoulder Flexion', 'Shoulder Abduction', 'Elbow Extension'],
  ARRAY['strength'],
  ARRAY['Stand with feet shoulder-width apart, core tight', 'Hold dumbbells at shoulder height, palms facing forward', 'Press overhead until arms are fully extended but not locked', 'Lower with control back to shoulders', 'Keep ribs down — do not arch the back'],
  ARRAY['Standing overhead press — light dumbbells'],
  ARRAY['Standing barbell overhead press or heavier dumbbells'],
  ARRAY['Seated overhead press or band overhead press'],
  NULL
),
(
  'Lateral Raise',
  'Isolated shoulder abduction exercise targeting the medial deltoid. Builds shoulder width and stabilizes the shoulder joint for overhead function.',
  'beginner', 'moderate', '10-15 reps',
  ARRAY['Dumbbells', 'Resistance Band'],
  ARRAY['Deltoids (Medial)', 'Supraspinatus', 'Upper Trapezius'],
  ARRAY['Shoulder Abduction'],
  ARRAY['strength'],
  ARRAY['Stand with light dumbbells at your sides, palms facing in', 'Raise arms out to the sides (slightly forward of center) until at shoulder height', 'Lead with your elbows, not your hands', 'Lower with control', 'Do not let the shoulders hike up toward the ears'],
  ARRAY['Dumbbell lateral raise — light weight, controlled tempo'],
  ARRAY['Dumbbell lateral raise with pause at top'],
  ARRAY['Band lateral raise or very light dumbbells'],
  NULL
),
(
  'Chest Press',
  'Fundamental horizontal pressing exercise for chest, shoulder, and tricep strength. Builds pushing power that is underdeveloped in desk workers.',
  'intermediate', 'high', '8-12 reps',
  ARRAY['Dumbbells', 'Barbell', 'Resistance Band'],
  ARRAY['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
  ARRAY['Shoulder Horizontal Adduction', 'Shoulder Flexion', 'Elbow Extension'],
  ARRAY['strength'],
  ARRAY['Lie on a flat bench holding dumbbells at chest level, palms facing forward', 'Press the weights up until arms are fully extended', 'Lower with control until elbows are at or just below chest level', 'Keep shoulders retracted and down throughout'],
  ARRAY['Dumbbell chest press — moderate weight, controlled form'],
  ARRAY['Barbell bench press for heavier loading'],
  ARRAY['Incline push up or band chest press'],
  NULL
),
(
  'Single Arm Row',
  'Unilateral back exercise that corrects left/right imbalances. Builds lat and rhomboid strength essential for postural correction.',
  'intermediate', 'high', '8-12 reps each side',
  ARRAY['Dumbbell', 'Kettlebell', 'Resistance Band'],
  ARRAY['Latissimus Dorsi', 'Rhomboid', 'Trapezius', 'Biceps', 'Core Stabilizers'],
  ARRAY['Shoulder Extension', 'Scapular Retraction', 'Elbow Flexion'],
  ARRAY['strength'],
  ARRAY['Place one knee and hand on a bench for support', 'Hold a dumbbell in the other hand, arm fully extended', 'Row the weight toward your hip, squeezing the back', 'Lower with control', 'Keep the torso stable — no twisting', 'Switch sides'],
  ARRAY['Single arm dumbbell row — controlled tempo, moderate weight'],
  ARRAY['Single arm row with heavier weight or pause at top'],
  ARRAY['Band single arm row or lighter dumbbell'],
  NULL
),
(
  'Single Arm Pulldown',
  'Unilateral vertical pulling exercise targeting the lats. Corrects side-to-side imbalances and builds pulling strength for posture.',
  'intermediate', 'moderate', '8-12 reps each side',
  ARRAY['Resistance Band', 'Cable Machine'],
  ARRAY['Latissimus Dorsi', 'Biceps', 'Rhomboid', 'Core Stabilizers'],
  ARRAY['Shoulder Extension', 'Shoulder Adduction', 'Elbow Flexion'],
  ARRAY['strength'],
  ARRAY['Anchor a resistance band overhead or attach to a cable machine', 'Grip with one hand, arm fully extended overhead', 'Pull down and back toward your hip', 'Control back to start', 'Keep torso stable', 'Switch sides'],
  ARRAY['Single arm band pulldown — light to moderate band tension'],
  ARRAY['Single arm cable pulldown with heavier weight'],
  ARRAY['Single arm pulldown with lighter band or shorter range'],
  NULL
),
(
  'Overhead Raise (Band/PVC)',
  'Controlled overhead movement that opens the shoulders and builds scapular control. Prepares the shoulder for overhead work while maintaining thoracic extension.',
  'beginner', 'low', '8-12 reps',
  ARRAY['Resistance Band', '5'' PVC Pipe'],
  ARRAY['Deltoids', 'Serratus Anterior', 'Upper Trapezius', 'Core Stabilizers'],
  ARRAY['Shoulder Flexion', 'Thoracic Extension'],
  ARRAY['mobility', 'strength'],
  ARRAY['Stand holding a PVC pipe or light band with a wide grip overhead', 'Keeping arms straight, slowly raise the implement from in front of you to overhead', 'Pause overhead and press the implement back slightly', 'Lower with control', 'Keep ribs down and core tight — do not arch the back'],
  ARRAY['PVC pipe overhead raise — standing, controlled tempo'],
  ARRAY['Band overhead raise for added resistance at the top'],
  ARRAY['Overhead raise with hands wider apart for lighter load'],
  NULL
),
(
  'Arm Circles',
  'Simple but effective shoulder mobility drill that moves the glenohumeral joint through its full range. Excellent warm-up or cooldown for desk workers.',
  'beginner', 'low', '10-15 circles each direction',
  ARRAY['None'],
  ARRAY['Deltoids', 'Rotator Cuff', 'Serratus Anterior'],
  ARRAY['Shoulder Flexion', 'Shoulder Extension', 'Shoulder Abduction', 'Shoulder Adduction', 'Shoulder Internal Rotation', 'Shoulder External Rotation'],
  ARRAY['mobility'],
  ARRAY['Stand with arms extended straight out to the sides', 'Make small circles in one direction', 'Gradually increase circle size', 'Reverse direction after 10-15 circles', 'Can also do forward/backward arm circles in front of the body'],
  ARRAY['Small arm circles standing — controlled range'],
  ARRAY['Large arm circles with full shoulder range'],
  ARRAY['Arm circles lying on floor for reduced load on shoulders'],
  NULL
),
(
  'Banded External Rotation',
  'Isolated rotator cuff exercise targeting the infraspinatus and teres minor. Essential for shoulder health and counteracting the internally rotated posture from desk work.',
  'beginner', 'low', '10-15 reps each side',
  ARRAY['Resistance Band'],
  ARRAY['Infraspinatus', 'Teres Minor', 'Rotator Cuff', 'Rhomboid'],
  ARRAY['Shoulder External Rotation', 'Scapular Retraction'],
  ARRAY['strength'],
  ARRAY['Anchor a resistance band at elbow height', 'Stand with the band in one hand, elbow bent at 90 degrees and tucked into your side', 'Rotate the forearm outward against the band', 'Control back to start', 'Keep the elbow pinned to your side throughout', 'Switch sides'],
  ARRAY['Banded external rotation — light band, elbow pinned to side'],
  ARRAY['Banded external rotation with slower tempo and pause at end range'],
  ARRAY['Banded external rotation with very light band or no band'],
  NULL
);

-- ============================================
-- 4. CERVICAL MOBILITY
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, intensity, duration, equipment, muscle_groups, joint_movements, categories, instructions, baseline, progression, regression, video_url)
VALUES

(
  'Cervical Flexion/Extension',
  'Controlled neck flexion and extension to restore range of motion lost from forward head posture. Essential for desk workers.',
  'beginner', 'low', '8-10 reps each direction',
  ARRAY['None'],
  ARRAY['Deep Neck Flexors', 'Suboccipital', 'Cervical Extensors', 'Upper Trapezius'],
  ARRAY['Cervical Flexion', 'Cervical Extension'],
  ARRAY['mobility'],
  ARRAY['Sit or stand with good posture, chin level', 'Slowly tuck your chin to your chest (flexion)', 'Pause briefly at end range', 'Slowly bring the chin back to neutral, then gently look up (extension)', 'Move slowly and stay within pain-free range', 'Repeat in a controlled rhythm'],
  ARRAY['Seated cervical flexion/extension — controlled pace'],
  ARRAY['Cervical flexion/extension with chin tuck hold at end range'],
  ARRAY['Supine cervical nods (laying on back, less load)'],
  NULL
),
(
  'Cervical Lateral Flexion',
  'Side-to-side neck mobility to release tight scalenes and upper traps. Restores lateral range of motion lost from static desk posture.',
  'beginner', 'low', '8-10 reps each side',
  ARRAY['None'],
  ARRAY['Scalenes', 'Upper Trapezius', 'Levator Scapulae', 'Cervical Stabilizers'],
  ARRAY['Cervical Lateral Flexion'],
  ARRAY['mobility'],
  ARRAY['Sit or stand with good posture', 'Keep eyes forward, slowly tilt your head toward one shoulder', 'Pause at end range', 'Return to center', 'Repeat on the other side', 'Do not let the shoulder rise toward the ear'],
  ARRAY['Seated cervical lateral flexion — controlled range'],
  ARRAY['Cervical lateral flexion with gentle overpressure from hand'],
  ARRAY['Supine cervical lateral flexion (less load)'],
  NULL
),
(
  'Cervical Rotation',
  'Neck rotation exercise to restore rotational range of motion. Tight from desk posture and contributes to reduced driving and sports performance.',
  'beginner', 'low', '8-10 reps each side',
  ARRAY['None'],
  ARRAY['Sternocleidomastoid', 'Cervical Stabilizers', 'Suboccipital'],
  ARRAY['Cervical Rotation'],
  ARRAY['mobility'],
  ARRAY['Sit or stand with good posture', 'Slowly turn your head to one side as far as comfortable', 'Pause briefly at end range', 'Return to center', 'Repeat on the other side', 'Keep the chin level — do not tilt or jut the chin'],
  ARRAY['Seated cervical rotation — controlled range'],
  ARRAY['Cervical rotation with gentle overpressure from hand'],
  ARRAY['Supine cervical rotation (less load)'],
  NULL
);

-- ============================================
-- 5. ADDITIONAL EXERCISES
-- ============================================

INSERT INTO public.exercises (name, description, difficulty, intensity, duration, equipment, muscle_groups, joint_movements, categories, instructions, baseline, progression, regression, video_url)
VALUES

(
  'Overhead Tricep Extension',
  'Isolated tricep exercise that lengthens the muscle through full range. Builds arm strength and elbow health.',
  'beginner', 'moderate', '8-12 reps',
  ARRAY['Dumbbell', 'Resistance Band'],
  ARRAY['Triceps Brachii', 'Core Stabilizers'],
  ARRAY['Elbow Extension', 'Shoulder Flexion'],
  ARRAY['strength'],
  ARRAY['Stand or sit holding a dumbbell overhead with both hands', 'Keep elbows pointing up and close to your head', 'Lower the weight behind your head by bending your elbows', 'Extend back to start, squeezing the triceps', 'Control the movement throughout'],
  ARRAY['Overhead tricep extension — light dumbbell'],
  ARRAY['Overhead tricep extension with heavier weight or single arm'],
  ARRAY['Lying tricep extension or band overhead extension'],
  NULL
),
(
  'Med Ball Throw (Slam)',
  'Full-body explosive movement that builds power, coordination, and shoulder health. Engages the kinetic chain from the ground up through the core and arms.',
  'intermediate', 'high', '6-10 reps',
  ARRAY['Medicine Ball'],
  ARRAY['Pectoralis Major', 'Deltoids', 'Core Stabilizers', 'Quadriceps', 'Gluteus Maximus'],
  ARRAY['Shoulder Flexion', 'Shoulder Horizontal Adduction', 'Hip Flexion', 'Lumbar Flexion'],
  ARRAY['strength', 'power'],
  ARRAY['Stand with feet shoulder-width apart, holding a medicine ball overhead', 'Slam the ball down to the ground in front of you as hard as possible', 'Sit into the hips slightly as you throw for more power', 'Catch the ball on the bounce (if possible) or retrieve it', 'Reset and repeat'],
  ARRAY['Medicine ball slam — light to moderate ball weight'],
  ARRAY['Medicine ball slam with heavier ball or rotational variation'],
  ARRAY['No ball — practice the overhead throwing motion only'],
  NULL
),
(
  'Deadlift',
  'The fundamental hip hinge loaded pattern. Builds full posterior chain strength — glutes, hamstrings, erectors — all of which are compromised by prolonged sitting.',
  'advanced', 'high', '5-8 reps',
  ARRAY['Dumbbells', 'Kettlebell', 'Barbell'],
  ARRAY['Gluteus Maximus', 'Hamstrings', 'Erector Spinae', 'Core Stabilizers', 'Quadriceps', 'Forearm Flexors'],
  ARRAY['Hip Flexion', 'Hip Extension', 'Knee Flexion', 'Lumbar Neutral'],
  ARRAY['strength'],
  ARRAY['Stand with feet hip-width apart, weight on the floor in front of you', 'Hinge at the hips, keeping a flat back', 'Grip the weight with arms straight', 'Drive through the heels to stand up, extending the hips and knees simultaneously', 'Squeeze glutes at the top', 'Lower with control, maintaining a flat back'],
  ARRAY['Dumbbell deadlift — moderate weight, focus on hip hinge mechanics'],
  ARRAY['Conventional barbell deadlift for heavier loading'],
  ARRAY['Kettlebell deadlift or block pulls (elevated start)'],
  NULL
);

-- Done. Exercises with duplicate names in the existing DB will be skipped
-- (the inserts above assume no name conflicts with existing exercises).
-- Run: migrate via Supabase dashboard or CLI.