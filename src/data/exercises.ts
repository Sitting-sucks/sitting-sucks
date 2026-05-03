// Centralized exercise database - all exercises from the app

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string;
  equipment: string[];
  jointMovements: string[];
  difficulty: number; // 1-5 scale
  intensity: number; // 1-5 scale
  duration: string;
  hasVideo: boolean;
  hasDocument: boolean;
  videoUrl?: string;
  targetMuscles: string[];
  baseline: string;
  progression: string;
  regression: string;
  categories: string[];
  bodyAreas: BodyArea[];
}

export type BodyArea =
  | "Foot/Ankle"
  | "Knee"
  | "Hip"
  | "Shoulder"
  | "Elbow"
  | "Wrist"
  | "C Spine"
  | "T Spine"
  | "L Spine";

export const bodyAreaList: BodyArea[] = [
  "Foot/Ankle",
  "Knee",
  "Hip",
  "L Spine",
  "T Spine",
  "C Spine",
  "Shoulder",
  "Elbow",
  "Wrist",
];

// Maps joint movement strings to their body area(s)
export const jointMovementToBodyAreas: Record<string, BodyArea[]> = {
  // Foot/Ankle
  "Ankle Dorsiflexion": ["Foot/Ankle"],
  "Ankle Plantarflexion": ["Foot/Ankle"],
  "Ankle Inversion": ["Foot/Ankle"],
  "Ankle Eversion": ["Foot/Ankle"],
  "Toe Extension": ["Foot/Ankle"],
  // Knee
  "Knee Flexion": ["Knee"],
  "Knee Extension": ["Knee"],
  "Knee Internal Rotation": ["Knee"],
  "Knee External Rotation": ["Knee"],
  // Hip
  "Hip Flexion": ["Hip"],
  "Hip Extension": ["Hip"],
  "Hip Abduction": ["Hip"],
  "Hip Adduction": ["Hip"],
  "Hip Internal Rotation": ["Hip"],
  "Hip External Rotation": ["Hip"],
  "Hip Neutral": ["Hip"],
  // Lumbar Spine
  "Lumbar Flexion": ["L Spine"],
  "Lumbar Extension": ["L Spine"],
  "Lumbar Lateral Flexion": ["L Spine"],
  "Lumbar Rotation": ["L Spine"],
  "Lumbar Neutral": ["L Spine"],
  // Thoracic Spine
  "Thoracic Flexion": ["T Spine"],
  "Thoracic Extension": ["T Spine"],
  "Thoracic Lateral Flexion": ["T Spine"],
  "Thoracic Rotation": ["T Spine"],
  // Cervical Spine
  "Cervical Flexion": ["C Spine"],
  "Cervical Extension": ["C Spine"],
  "Cervical Lateral Flexion": ["C Spine"],
  "Cervical Rotation": ["C Spine"],
  "Cervical Neutral": ["C Spine"],
  // Shoulder
  "Shoulder Flexion": ["Shoulder"],
  "Shoulder Extension": ["Shoulder"],
  "Shoulder Abduction": ["Shoulder"],
  "Shoulder Adduction": ["Shoulder"],
  "Shoulder Internal Rotation": ["Shoulder"],
  "Shoulder External Rotation": ["Shoulder"],
  "Shoulder Horizontal Abduction": ["Shoulder"],
  "Shoulder Horizontal Adduction": ["Shoulder"],
  "Shoulder Retraction": ["Shoulder"],
  "Shoulder Stabilization": ["Shoulder"],
  // Elbow
  "Elbow Flexion": ["Elbow"],
  "Elbow Extension": ["Elbow"],
  "Forearm Pronation": ["Elbow"],
  "Forearm Supination": ["Elbow"],
  // Wrist
  "Wrist Flexion": ["Wrist"],
  "Wrist Extension": ["Wrist"],
  "Wrist Radial Deviation": ["Wrist"],
  "Wrist Ulnar Deviation": ["Wrist"],
};

export const exercises: Exercise[] = [
  {
    id: "1",
    name: "Push-ups",
    description: "Fundamental upper body strengthening exercise",
    instructions: "Start in a plank position with your hands right under your chest or shoulders. Wrist and elbow position can change this exercise drastically. Elbows should not exceed 45 degrees away from ribs. Elbows being closer to ribs will increase difficulty of exercise on wrists and shoulders. After finding correct position lower body as one unit from head to toes towards the floor. Taking at least 5 seconds to get to the bottom pull shoulder blades back and together, while keeping core active and hips at the same height as the shoulders from the ground.",
    equipment: ["None", "Foam Roller"],
    jointMovements: ["Shoulder Flexion", "Elbow Extension", "Wrist Extension", "Shoulder Retraction"],
    difficulty: 3,
    intensity: 3,
    duration: "4-10 reps",
    hasVideo: true,
    hasDocument: false,
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    targetMuscles: ["Pectoralis Major", "Anterior Deltoids", "Triceps Brachii", "Transverse Abdominis", "Pectoralis Minor", "Rhomboid", "Teres Major"],
    baseline: "Standard push-up from toes",
    progression: "Decline push-ups with feet elevated on chair",
    regression: "Incline push-ups with hands on chair",
    categories: ["strength"],
    bodyAreas: ["Shoulder", "Elbow", "Wrist"],
  },
  {
    id: "2",
    name: "Squats",
    description: "The ultimate sit crushing exercise. Full body engagement.",
    instructions: "Put the 2.5 lbs plates under your heels about shoulder width apart. Grab a light weight (At least 5-10 pounds) and hold it out in front of your face or eyes. You can add a chair behind you to assist where to aim. While keeping upright posture, very slowly start lowering yourself towards the seat loading our weight backward into our hips and glutes. Touch the seat and gentle return back to start by pushing through your glutes.",
    equipment: ["2.5 lbs plates", "5' PVC Pipe"],
    jointMovements: ["Ankle Dorsiflexion", "Shoulder retraction", "core stability", "Knee flexion", "knee extension", "hip flexion", "hip extension"],
    difficulty: 5,
    intensity: 4,
    duration: "3-15 Reps",
    hasVideo: false,
    hasDocument: true,
    targetMuscles: ["Quadriceps", "Gluteus Maximus", "Hamstrings", "Erector Spinae"],
    baseline: "Bodyweight squat to 90 degrees",
    progression: "Squat with weight plates or single-leg pistol squat",
    regression: "Squat to chair or with heel wedges for ankle mobility assistance",
    categories: ["mobility", "strength"],
    bodyAreas: ["Foot/Ankle", "Knee", "Hip", "L Spine"],
  },
  {
    id: "3",
    name: "Forearm Plank",
    description: "A foundational core stability exercise that trains the body to resist extension and maintain full-body tension. Builds strength in the deep core, shoulders, and glutes for posture and performance.",
    instructions: "Start on the floor with elbows directly under shoulders and forearms flat. Extend legs straight back, toes on the ground. Brace your core, squeeze glutes, and keep ribs down. Maintain a straight line from head to heels — don't let hips sag or pike. Hold position for time, breathing steadily.",
    equipment: ["None"],
    jointMovements: ["Shoulder Flexion", "Lumbar Neutral", "Hip Neutral"],
    difficulty: 2,
    intensity: 3,
    duration: "2–3 sets of 20–60 seconds (progress to 90 seconds)",
    hasVideo: true,
    hasDocument: false,
    videoUrl: "https://www.youtube.com/embed/Z9cO9_TsAV8",
    targetMuscles: ["Rectus Abdominis", "Transverse Abdominis", "External Obliques", "Internal Obliques", "Gluteus Maximus", "Anterior Deltoids", "Serratus Anterior", "Erector Spinae", "Quadriceps"],
    baseline: "Forearm plank with elbows under shoulders",
    progression: "Single-arm plank or plank with leg lifts",
    regression: "Incline plank with hands on chair/box or knee plank",
    categories: ["strength"],
    bodyAreas: ["Shoulder", "L Spine", "T Spine"],
  },
  {
    id: "4",
    name: "Lunges",
    description: "Unilateral lower body exercise for strength, balance, and coordination",
    instructions: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Keep front knee tracking over ankle, back knee pointing down, and torso upright. Push through front heel to return.",
    equipment: ["None"],
    jointMovements: ["Ankle Dorsiflexion", "Knee Flexion", "Hip Flexion", "Lumbar Neutral", "Cervical Neutral"],
    difficulty: 2,
    intensity: 3,
    duration: "45 seconds each leg",
    hasVideo: true,
    hasDocument: false,
    videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
    targetMuscles: ["Quadriceps", "Gluteus Maximus", "Hamstrings", "Gastrocnemius", "Soleus"],
    baseline: "Forward lunge with bodyweight",
    progression: "Walking lunges or lunges with weight plates",
    regression: "Stationary lunge with chair support or reverse lunge",
    categories: ["mobility", "strength"],
    bodyAreas: ["Foot/Ankle", "Knee", "Hip"],
  },
  {
    id: "8",
    name: "Calf Raises",
    description: "Lower leg exercise for calf strength and ankle stability",
    instructions: "Stand with feet hip-width apart. Rise up onto toes by pushing through balls of feet. Hold briefly at top then lower slowly with control.",
    equipment: ["None"],
    jointMovements: ["Ankle Plantarflexion"],
    difficulty: 1,
    intensity: 2,
    duration: "45 seconds",
    hasVideo: true,
    hasDocument: false,
    videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
    targetMuscles: ["Calves", "Ankles"],
    baseline: "Double-leg calf raises on flat ground",
    progression: "Single-leg calf raises or calf raises on heel wedges",
    regression: "Calf raises with chair support",
    categories: ["strength"],
    bodyAreas: ["Foot/Ankle"],
  },
  {
    id: "10",
    name: "Calf & Hamstring Stretch on Heel Wedges",
    description: "A mobility drill that combines deep ankle dorsiflexion with a hip hinge to lengthen the hamstrings while improving calf mobility. Builds control and flexibility for squats, deadlifts, and overall lower-body function.",
    instructions: "Place your heels on the heel wedges to put ankles into deep dorsiflexion. Stand tall with feet about hip-width apart, spine long and flat. Begin a hip hinge by pushing hips and butt backward as far as possible, stopping right before you lose balance — this is your true end range. Keep knees extended and chest lifted as hamstrings lengthen. Use yoga blocks under your hands for support at end range if needed. To progress: Hold a light weight (e.g., 5' PVC Pipe or small dumbbell) in front of you, letting it gently pull you deeper into the stretch while maintaining knee extension and a neutral spine. Return to standing tall under control.",
    equipment: ["Heel Wedges", "Yoga Blocks (optional)", "5' PVC Pipe or light weight (optional)"],
    jointMovements: ["Ankle Dorsiflexion", "Knee Extension", "Hip Flexion", "Lumbar Neutral"],
    difficulty: 2,
    intensity: 4,
    duration: "Dynamic: 8-12 slow, controlled reps | Long-Hold: 2-3 sets of 30-90 seconds",
    hasVideo: true,
    hasDocument: true,
    videoUrl: "https://www.youtube.com/embed/9g6_GyvFqFo",
    targetMuscles: ["Hamstrings (biceps femoris, semitendinosus, semimembranosus)", "Gastrocnemius & Soleus (calves)", "Core (rectus abdominis, obliques, erectors)", "Glutes (isometric)", "Small foot stabilizers"],
    baseline: "Calf & hamstring stretch on heel wedges with yoga block support",
    progression: "Add light weight (5' PVC Pipe or dumbbell) for deeper stretch",
    regression: "Hip hinge stretch without heel wedges or with chair support",
    categories: ["mobility"],
    bodyAreas: ["Foot/Ankle", "Knee", "Hip"],
  },
  {
    id: "11",
    name: "Ankle Inversion",
    description: "Strengthening exercise for the medial ankle muscles using resistance band",
    instructions: "Sit with legs extended. Loop the yellow band around your foot and hold the other end. Turn your foot inward against the resistance, moving slowly and controlled. Return to neutral position.",
    equipment: ["Yellow Perform Better Band"],
    jointMovements: ["Ankle Inversion"],
    difficulty: 1,
    intensity: 1,
    duration: "10-25 reps",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Tibialis Posterior", "Flexor Digitorum Longus", "Flexor Hallucis Longus"],
    baseline: "Ankle inversion with yellow band resistance",
    progression: "Ankle inversion with stronger resistance band",
    regression: "Ankle inversion without resistance",
    categories: ["strength"],
    bodyAreas: ["Foot/Ankle"],
  },
  {
    id: "12",
    name: "Ankle Eversion",
    description: "Strengthening exercise for the lateral ankle muscles using resistance band",
    instructions: "Sit with legs extended. Loop the yellow band around your foot and hold the other end. Turn your foot outward against the resistance, moving slowly and controlled. Return to neutral position.",
    equipment: ["Yellow Perform Better Band"],
    jointMovements: ["Ankle Eversion"],
    difficulty: 1,
    intensity: 1,
    duration: "10-25 reps",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Peroneus Longus", "Peroneus Brevis", "Peroneus Tertius"],
    baseline: "Ankle eversion with yellow band resistance",
    progression: "Ankle eversion with stronger resistance band",
    regression: "Ankle eversion without resistance",
    categories: ["strength"],
    bodyAreas: ["Foot/Ankle"],
  },
  {
    id: "13",
    name: "Toe Extension Plank",
    description: "Deep toe extension stretch that targets the plantar fascia and improves foot mobility",
    instructions: "Stand or kneel in front of chair ready to use it for assistance. Put all 5 toes on each foot into a deep extension stretch put your elbows or hands on the chair and hold yourself up forcing a big stretch in your toes, bottom of foot/ankle, and perhaps even the quads. Keep your spine neutral.",
    equipment: ["Chair"],
    jointMovements: ["Toe Extension", "Ankle Dorsiflexion", "Lumbar Neutral"],
    difficulty: 2,
    intensity: 3,
    duration: "20-60 seconds",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Toe Extensors", "Plantar Fascia", "Quadriceps", "Core Stabilizers"],
    baseline: "Toe extension plank with chair support",
    progression: "Toe extension plank without chair support",
    regression: "Toe extension stretch while seated",
    categories: ["mobility"],
    bodyAreas: ["Foot/Ankle"],
  },
  {
    id: "14",
    name: "Wrist Flexion/Extension with Forearm Spinner",
    description: "Intense forearm strengthening exercise using weighted resistance",
    instructions: "Tie 2.5 lb plate to string attached to the spinner. Let the string be fully unwound and weight lying on the floor. Keeping elbows and spine straight, spin the spinner to raise the weight all the way to the top and control it back to the floor. Make sure to keep your posture and elbows straight, this one burns!",
    equipment: ["Forearm Spinner", "Two 2.5 lbs Plates"],
    jointMovements: ["Wrist Flexion", "Wrist Extension"],
    difficulty: 2,
    intensity: 4,
    duration: "1-3 full reps up and down",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Flexor Carpi Radialis", "Flexor Carpi Ulnaris", "Extensor Carpi Radialis", "Extensor Carpi Ulnaris"],
    baseline: "Wrist flexion/extension with forearm spinner and 2.5 lb plate",
    progression: "Wrist flexion/extension with heavier weight",
    regression: "Wrist flexion/extension without weight",
    categories: ["strength"],
    bodyAreas: ["Wrist", "Elbow"],
  },
  {
    id: "15",
    name: "Reverse Fly",
    description: "Posterior deltoid and rhomboid strengthening exercise using resistance band",
    instructions: "Anchor the purple band to something sturdy with an equal amount of band left on each side. Stand facing the sturdy structure and grab the handles. Place your thumbs on the back side of the handles with the rest of your fingers. Start with light tension thinking you are trying to pull the sturdy object towards you with the band while pinching your shoulder blades together.",
    equipment: ["Purple Plastic Handle"],
    jointMovements: ["Shoulder Horizontal Abduction", "Shoulder External Rotation"],
    difficulty: 3,
    intensity: 2,
    duration: "6-15 reps",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Posterior Deltoids", "Rhomboids", "Middle Trapezius"],
    baseline: "Reverse fly with purple band",
    progression: "Walk further away from sturdy structure",
    regression: "Reverse fly without band",
    categories: ["strength"],
    bodyAreas: ["Shoulder", "T Spine"],
  },
  {
    id: "16",
    name: "Standing Hip Abduction",
    description: "Single-leg balance exercise targeting hip abductor muscles",
    instructions: "Holding onto something sturdy align your shoulder hip and ankle on one side allowing the other foot to hover off the ground. While keeping both legs as straight as possible bring the hovering leg as far away from the standing leg.",
    equipment: ["None"],
    jointMovements: ["Hip Abduction"],
    difficulty: 3,
    intensity: 4,
    duration: "8-20 reps",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Gluteus Medius", "Gluteus Minimus", "Tensor Fasciae Latae"],
    baseline: "Standing hip abduction with sturdy support",
    progression: "Standing hip abduction with yellow perform better band",
    regression: "Side-lying hip abduction",
    categories: ["strength"],
    bodyAreas: ["Hip"],
  },
  {
    id: "17",
    name: "Side Plank",
    description: "Lateral core stabilization exercise targeting obliques and deep stabilizers",
    instructions: "Lie on your side with legs extended and stacked. Support your upper body on your forearm, keeping elbow directly under shoulder. Lift hips off ground, creating a straight line from head to feet. Keep shoulders, hips, and ankles aligned. Hold position while breathing normally.",
    equipment: ["None"],
    jointMovements: ["Cervical Neutral", "Thoracic Lateral Flexion", "Lumbar Lateral Flexion", "Hip Neutral", "Shoulder Stabilization"],
    difficulty: 2,
    intensity: 3,
    duration: "15-45 seconds each side",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["External Obliques", "Internal Obliques", "Quadratus Lumborum", "Transverse Abdominis", "Gluteus Medius"],
    baseline: "Forearm side plank with straight body alignment",
    progression: "Side plank with leg lifts or arm reaches",
    regression: "Modified side plank with knees on ground or against wall",
    categories: ["strength"],
    bodyAreas: ["L Spine", "T Spine", "Shoulder", "C Spine"],
  },
  {
    id: "18",
    name: "Overhead Shoulder Flexion on Foam Roller (PVC Pipe)",
    description: "A mobility drill to restore full shoulder flexion while reinforcing thoracic spine extension. This exercise teaches your shoulders to move overhead without compensation from the lower back.",
    instructions: "Lie lengthwise on a foam roller so that your head and lumbar spine are supported. (Finding balance may be tricky at first — use your core to stabilize.) Grab the 5' PVC Pipe with both hands, thumbs wrapped in the same direction as your fingers to promote slight external rotation at the shoulders. Keep ribs down and lower back flat on the roller. Slowly raise the 5' PVC Pipe overhead as far as possible, focusing on motion coming from the shoulders and thoracic spine only. Avoid arching your low back — spine stays long and flat on the roller. Lower the bar back down under control.",
    equipment: ["Foam Roller", "5' PVC Pipe"],
    jointMovements: ["Shoulder Flexion", "Thoracic Extension", "Lumbar Neutral", "Shoulder External Rotation"],
    difficulty: 2,
    intensity: 2,
    duration: "8-12 controlled reps or 30-60 seconds continuous motion",
    hasVideo: false,
    hasDocument: false,
    targetMuscles: ["Anterior Deltoids", "Middle Deltoids", "Serratus Anterior", "Lower Trapezius", "Rectus Abdominis", "Obliques"],
    baseline: "Overhead shoulder flexion with foam roller and 5' PVC Pipe",
    progression: "Overhead shoulder flexion with longer hold times or single-arm variations",
    regression: "Overhead shoulder flexion without foam roller or with shorter range of motion",
    categories: ["mobility"],
    bodyAreas: ["Shoulder", "T Spine"],
  },
  {
    id: "19",
    name: "Supine Core Stability with Band Hold",
    description: "A core stability drill that integrates shoulder stability with trunk control. By holding the band under tension across the chest, you train the deep core to resist extension and reinforce spinal alignment.",
    instructions: "Anchor the purple plastic-handle band securely to a stable point just above head level when lying on your back. Lie on the floor with head near the anchor and feet pointed away. Grab the band with both hands, arms extended straight above the chest or slightly lower. Pull to create tension on the band, then hold the arms steady, keeping elbows locked. Keep ribs down and low back flat to the floor. For progression: Add alternating hip flexion/leg raises while maintaining the band hold.",
    equipment: ["Purple Plastic Handle"],
    jointMovements: ["Shoulder Flexion", "Lumbar Neutral", "Hip Flexion"],
    difficulty: 2,
    intensity: 3,
    duration: "2–3 sets of 20–40 seconds hold (progress to 60 seconds)",
    hasVideo: true,
    hasDocument: false,
    videoUrl: "https://www.youtube.com/embed/8pJqShYuhHU",
    targetMuscles: ["Rectus Abdominis", "Transverse Abdominis", "Hip Flexors", "Anterior Deltoids", "Pectoralis Major", "Serratus Anterior", "Lower Trapezius", "Gluteus Maximus", "External Obliques", "Internal Obliques"],
    baseline: "Supine band hold with arms extended, maintaining spinal contact",
    progression: "Add alternating hip flexion/leg raises while maintaining band hold",
    regression: "Reduce band tension or perform without band resistance",
    categories: ["strength"],
    bodyAreas: ["Shoulder", "L Spine"],
  }
];

// Equipment categories with images for filtering
export const equipmentList = [
  { name: "Yellow Perform Better Band", image: "/lovable-uploads/341515b9-64c7-49bd-ac77-1129071bed02.png" },
  { name: "Purple Plastic Handle", image: "/lovable-uploads/bc8597f3-16a0-407c-a423-cfd0f339b083.png" },
  { name: "Heel Wedges", image: "/lovable-uploads/5b31325f-a9c5-4b98-95a8-fcdcfc3bd59c.png" },
  { name: "Two 2.5 lbs Plates", image: "/src/assets/equipment/weight-plates.jpg" },
  { name: "Forearm Spinner", image: "/lovable-uploads/72822b45-61da-48c3-881d-cf3badab9ca9.png" },
  { name: "Foam Roller", image: "/src/assets/equipment/foam-roller.jpg" },
  { name: "Yoga Blocks", image: "/lovable-uploads/265c2daf-70cc-4d76-8cbf-1cc0da212765.png" },
  { name: "Lacrosse Ball", image: "/src/assets/equipment/lacrosse-ball.jpg" },
  { name: "5' PVC Pipe", image: "/src/assets/equipment/pvc-pipe.jpg" },
  { name: "Chair", image: "/src/assets/equipment/exercise-chair.jpg" }
];

// Joint movements for all body segments
export const jointMovements = [
  // Ankle
  "Ankle Dorsiflexion", "Ankle Plantarflexion", "Ankle Inversion", "Ankle Eversion",
  // Knee
  "Knee Flexion", "Knee Extension", "Knee Internal Rotation", "Knee External Rotation",
  // Hip
  "Hip Flexion", "Hip Extension", "Hip Abduction", "Hip Adduction",
  "Hip Internal Rotation", "Hip External Rotation",
  // Lumbar Spine
  "Lumbar Flexion", "Lumbar Extension", "Lumbar Lateral Flexion", "Lumbar Rotation",
  // Thoracic Spine
  "Thoracic Flexion", "Thoracic Extension", "Thoracic Lateral Flexion", "Thoracic Rotation",
  // Cervical Spine
  "Cervical Flexion", "Cervical Extension", "Cervical Lateral Flexion", "Cervical Rotation",
  // Shoulder
  "Shoulder Flexion", "Shoulder Extension", "Shoulder Abduction", "Shoulder Adduction",
  "Shoulder Internal Rotation", "Shoulder External Rotation", "Shoulder Horizontal Abduction", "Shoulder Horizontal Adduction",
  // Elbow
  "Elbow Flexion", "Elbow Extension", "Forearm Pronation", "Forearm Supination",
  // Wrist
  "Wrist Flexion", "Wrist Extension", "Wrist Radial Deviation", "Wrist Ulnar Deviation"
];
