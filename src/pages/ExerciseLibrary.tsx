import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ExerciseCard from "@/components/ExerciseCard";
import { Search, Plus, Filter, Lock, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionGate } from "@/components/SubscriptionGate";

// Equipment images
import yellowBandImg from "@/assets/equipment/yellow-band.jpg";
import purpleHandleImg from "@/assets/equipment/purple-handle.jpg";
import heelWedgesImg from "@/assets/equipment/heel-wedges.jpg";
import weightPlatesImg from "@/assets/equipment/weight-plates.jpg";
import forearmSpinnerImg from "@/assets/equipment/forearm-spinner.jpg";
import foamRollerImg from "@/assets/equipment/foam-roller.jpg";
import yogaBlocksImg from "@/assets/equipment/yoga-blocks.jpg";
import lacrosseBallImg from "@/assets/equipment/lacrosse-ball.jpg";
import pvcPipeImg from "@/assets/equipment/pvc-pipe.jpg";
import exerciseChairImg from "@/assets/equipment/exercise-chair.jpg";

const ExerciseLibrary = () => {
  const { subscribed } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedJointMovement, setSelectedJointMovement] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");

  // Equipment categories with images
  const equipmentList = [
    { name: "Yellow Perform Better Band", image: yellowBandImg },
    { name: "Purple Plastic Handle", image: purpleHandleImg },
    { name: "Heel Wedges", image: heelWedgesImg },
    { name: "Two 2.5 lbs Plates", image: weightPlatesImg },
    { name: "Forearm Spinner", image: forearmSpinnerImg },
    { name: "Foam Roller", image: foamRollerImg },
    { name: "Yoga Blocks", image: yogaBlocksImg },
    { name: "Lacrosse Ball", image: lacrosseBallImg },
    { name: "3-4' PVC Pipe", image: pvcPipeImg },
    { name: "12-36\" Box/Chair", image: exerciseChairImg }
  ];

  // Joint movements for all body segments
  const jointMovements = [
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

  // Expanded free exercises library
  const freeExercises = [
    {
      id: "1",
      name: "Push-ups",
      description: "Classic bodyweight exercise for chest, shoulders, and triceps",
      instructions: "Start in plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches floor, then push back up. Keep core tight throughout movement.",
      equipment: ["None"],
      jointMovements: ["Shoulder Flexion", "Elbow Extension"],
      difficulty: 2,
      intensity: 3,
      duration: "30 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
      targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    },
    {
      id: "2",
      name: "Squats",
      description: "Fundamental lower body exercise targeting quads, glutes, and hamstrings",
      instructions: "Stand with feet shoulder-width apart. Lower your body by bending knees and pushing hips back as if sitting in chair. Keep chest up and knees behind toes. Return to starting position.",
      equipment: ["None"],
      jointMovements: ["Knee Flexion", "Hip Flexion"],
      difficulty: 1,
      intensity: 2,
      duration: "45 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
      targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    },
    {
      id: "3",
      name: "Planks",
      description: "Core strengthening exercise for stability and endurance",
      instructions: "Start in push-up position, then lower to forearms. Keep body in straight line from head to heels. Engage core and hold position without letting hips sag or pike up.",
      equipment: ["None"],
      jointMovements: ["Core Stabilization"],
      difficulty: 1,
      intensity: 2,
      duration: "30-60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Core", "Shoulders", "Glutes"],
    },
    {
      id: "4",
      name: "Lunges",
      description: "Unilateral leg exercise for strength and balance",
      instructions: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Keep front knee over ankle and back knee pointing down. Push back to starting position.",
      equipment: ["None"],
      jointMovements: ["Hip Flexion", "Knee Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "45 seconds each leg",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
      targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    },
    {
      id: "5",
      name: "Mountain Climbers",
      description: "Dynamic cardio exercise combining core and leg work",
      instructions: "Start in plank position. Bring one knee to chest, then quickly switch legs in running motion. Keep hips level and core engaged throughout.",
      equipment: ["None"],
      jointMovements: ["Hip Flexion", "Shoulder Stabilization"],
      difficulty: 3,
      intensity: 4,
      duration: "30 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
      targetMuscles: ["Core", "Shoulders", "Legs", "Cardio"],
    },
    {
      id: "6",
      name: "Glute Bridges",
      description: "Hip extension exercise targeting glutes and hamstrings",
      instructions: "Lie on back with knees bent, feet flat on floor. Squeeze glutes and lift hips up creating straight line from knees to shoulders. Hold briefly then lower.",
      equipment: ["None"],
      jointMovements: ["Hip Extension"],
      difficulty: 1,
      intensity: 2,
      duration: "45 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
      targetMuscles: ["Glutes", "Hamstrings", "Core"],
    },
    {
      id: "7",
      name: "Wall Sits",
      description: "Isometric quad exercise for building endurance",
      instructions: "Stand with back against wall, slide down until thighs are parallel to floor. Keep knees at 90 degrees and weight in heels. Hold position.",
      equipment: ["None"],
      jointMovements: ["Knee Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "30-60 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
      targetMuscles: ["Quadriceps", "Glutes", "Calves"],
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
    },
    {
      id: "9",
      name: "Jumping Jacks",
      description: "Full-body cardio exercise for warming up and conditioning",
      instructions: "Start with feet together, arms at sides. Jump feet apart while raising arms overhead. Jump back to starting position. Maintain steady rhythm.",
      equipment: ["None"],
      jointMovements: ["Shoulder Abduction", "Hip Abduction"],
      difficulty: 1,
      intensity: 3,
      duration: "30 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
      targetMuscles: ["Full Body", "Cardio"],
    },
    {
      id: "10",
      name: "Heel Wedge Calf Stretch",
      description: "Deep calf and Achilles stretch using heel wedges",
      instructions: "Place heel wedges under heels. Lean forward against wall keeping legs straight. Feel stretch in calves and Achilles tendon.",
      equipment: ["Heel Wedges"],
      jointMovements: ["Ankle Dorsiflexion"],
      difficulty: 1,
      intensity: 1,
      duration: "2 minutes each leg",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Calves", "Achilles"],
    },
    {
      id: "11",
      name: "Foam Rolling - Quadriceps",
      description: "Self-massage for quadriceps muscle recovery",
      instructions: "Lie face down with foam roller under thighs. Support upper body on forearms. Roll from just above knees to hip crease, pausing on tender spots.",
      equipment: ["Foam Roller"],
      jointMovements: ["Hip Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "2 minutes",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
      targetMuscles: ["Quadriceps"],
    },
    {
      id: "12",
      name: "Lacrosse Ball - Foot Massage",
      description: "Plantar fascia release using lacrosse ball",
      instructions: "Stand and place lacrosse ball under foot. Apply pressure and roll ball from heel to toes. Focus on arch area and any tender spots.",
      equipment: ["Lacrosse Ball"],
      jointMovements: ["Ankle Mobility"],
      difficulty: 1,
      intensity: 2,
      duration: "2 minutes each foot",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Plantar Fascia", "Foot"],
    },
  ];

  // Expanded premium exercises library
  const premiumExercises = [
    {
      id: "13",
      name: "Bulgarian Split Squats",
      description: "Single-leg exercise for unilateral strength and stability",
      instructions: "Stand 2 feet in front of bench. Place rear foot on bench. Lower into lunge position, keeping front knee over ankle. Push through front heel to return.",
      equipment: ["12-36\" Box/Chair"],
      jointMovements: ["Hip Flexion", "Knee Flexion"],
      difficulty: 4,
      intensity: 4,
      duration: "45 seconds each leg",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
      targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
      isPremium: true,
    },
    {
      id: "14",
      name: "Turkish Get-ups",
      description: "Complex movement pattern for full-body coordination",
      instructions: "Start lying on back with weight in right hand. Press weight overhead. Use left hand and elbow to prop up. Transition to standing while keeping weight overhead.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Shoulder Flexion", "Hip Flexion", "Thoracic Extension"],
      difficulty: 5,
      intensity: 4,
      duration: "2 minutes each side",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/0bWRPC49noU",
      targetMuscles: ["Full Body", "Core", "Shoulders"],
      isPremium: true,
    },
    {
      id: "15",
      name: "Resistance Band Rows",
      description: "Upper back strengthening with resistance bands",
      instructions: "Anchor band at chest height. Hold handles with arms extended. Pull elbows back squeezing shoulder blades together. Control return.",
      equipment: ["Yellow Perform Better Band"],
      jointMovements: ["Shoulder Extension", "Elbow Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/tZkMJvhCZGU",
      targetMuscles: ["Lats", "Rhomboids", "Middle Traps", "Biceps"],
      isPremium: true,
    },
    {
      id: "16",
      name: "Deadlifts with Plates",
      description: "Hip hinge movement with weight plates",
      instructions: "Hold plates at thighs. Hinge at hips pushing butt back. Lower plates while keeping back straight. Drive hips forward to return.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Hip Extension", "Knee Extension"],
      difficulty: 3,
      intensity: 4,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ytGaGIn3SjE",
      targetMuscles: ["Hamstrings", "Glutes", "Lower Back"],
      isPremium: true,
    },
    {
      id: "17",
      name: "Forearm Spinner Training",
      description: "Grip and forearm strengthening using specialized equipment",
      instructions: "Hold forearm spinner with arm extended. Rotate device clockwise and counterclockwise. Control the motion with wrist and forearm muscles.",
      equipment: ["Forearm Spinner"],
      jointMovements: ["Forearm Pronation", "Forearm Supination"],
      difficulty: 2,
      intensity: 3,
      duration: "90 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/rt17lmnaLSM",
      targetMuscles: ["Forearms", "Grip", "Wrists"],
      isPremium: true,
    },
    {
      id: "18",
      name: "Box Step-ups",
      description: "Unilateral leg strengthening with elevated platform",
      instructions: "Place one foot on box. Step up by driving through heel of elevated leg. Control descent. Keep torso upright throughout.",
      equipment: ["12-36\" Box/Chair"],
      jointMovements: ["Hip Extension", "Knee Extension"],
      difficulty: 2,
      intensity: 3,
      duration: "45 seconds each leg",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
      targetMuscles: ["Quadriceps", "Glutes", "Calves"],
      isPremium: true,
    },
    {
      id: "19",
      name: "Advanced Thoracic Extension",
      description: "Thoracic spine mobility using PVC pipe for posture improvement",
      instructions: "Sit with PVC pipe across upper back. Extend spine over pipe focusing on thoracic region. Hold and breathe deeply.",
      equipment: ["3-4' PVC Pipe"],
      jointMovements: ["Thoracic Extension"],
      difficulty: 2,
      intensity: 2,
      duration: "3 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/vugBFBOe1II",
      targetMuscles: ["Thoracic Spine", "Chest"],
      isPremium: true,
    },
    {
      id: "20",
      name: "Yoga Block Supported Poses",
      description: "Modified yoga poses using blocks for proper alignment",
      instructions: "Use yoga blocks to support various stretching positions. Blocks help achieve proper alignment and deeper stretches safely.",
      equipment: ["Yoga Blocks"],
      jointMovements: ["Hip Flexion", "Thoracic Extension"],
      difficulty: 1,
      intensity: 1,
      duration: "5 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Hip Flexors", "Spine", "Hamstrings"],
      isPremium: true,
    },
    {
      id: "21",
      name: "Lacrosse Ball Glute Release",
      description: "Trigger point therapy for glute muscles",
      instructions: "Sit on lacrosse ball with it under glute muscle. Lean into ball and move slowly to find trigger points. Apply pressure for 30 seconds.",
      equipment: ["Lacrosse Ball"],
      jointMovements: ["Hip Mobility"],
      difficulty: 2,
      intensity: 3,
      duration: "3 minutes each side",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
      targetMuscles: ["Glutes", "Hip Flexors"],
      isPremium: true,
    },
    {
      id: "22",
      name: "Resistance Band Bicep Curls",
      description: "Isolated bicep strengthening with resistance bands",
      instructions: "Step on band center, hold handles at sides. Curl handles up by flexing biceps, keeping elbows at sides. Control lowering phase.",
      equipment: ["Yellow Perform Better Band"],
      jointMovements: ["Elbow Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/tZkMJvhCZGU",
      targetMuscles: ["Biceps", "Forearms"],
      isPremium: true,
    },
    {
      id: "23",
      name: "Single-Leg Deadlift with Plate",
      description: "Unilateral balance and posterior chain exercise",
      instructions: "Hold plate in both hands. Stand on one leg. Hinge at hip lowering plate toward ground while extending free leg back. Return to standing.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Hip Extension", "Ankle Stabilization"],
      difficulty: 4,
      intensity: 4,
      duration: "45 seconds each leg",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ytGaGIn3SjE",
      targetMuscles: ["Hamstrings", "Glutes", "Core", "Balance"],
      isPremium: true,
    },
    {
      id: "24",
      name: "Purple Handle Grip Training",
      description: "Grip strength and hand dexterity training",
      instructions: "Perform various grip exercises using purple handle. Squeeze, rotate, and manipulate handle to improve grip strength and coordination.",
      equipment: ["Purple Plastic Handle"],
      jointMovements: ["Wrist Flexion", "Wrist Extension"],
      difficulty: 1,
      intensity: 2,
      duration: "2 minutes",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/rt17lmnaLSM",
      targetMuscles: ["Grip", "Forearms", "Fingers"],
      isPremium: true,
    },
    {
      id: "25",
      name: "Elevated Heel Squats",
      description: "Deep squat mobility using heel wedges",
      instructions: "Place heel wedges under heels. Perform deep squats with improved ankle mobility. Focus on sitting back and keeping chest up.",
      equipment: ["Heel Wedges"],
      jointMovements: ["Ankle Dorsiflexion", "Hip Flexion", "Knee Flexion"],
      difficulty: 2,
      intensity: 3,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
      targetMuscles: ["Quadriceps", "Glutes", "Ankles"],
      isPremium: true,
    },
    {
      id: "26",
      name: "Foam Roller Lat Release",
      description: "Latissimus dorsi muscle release and mobility",
      instructions: "Lie on side with foam roller under armpit/lat area. Roll from armpit to mid-back, avoiding rolling directly on ribs. Pause on tender spots.",
      equipment: ["Foam Roller"],
      jointMovements: ["Shoulder Adduction"],
      difficulty: 2,
      intensity: 3,
      duration: "2 minutes each side",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
      targetMuscles: ["Latissimus Dorsi", "Shoulders"],
      isPremium: true,
    },
    {
      id: "27",
      name: "PVC Pipe Overhead Mobility",
      description: "Shoulder and thoracic mobility using PVC pipe",
      instructions: "Hold PVC pipe with wide grip overhead. Lower pipe behind head keeping arms straight. Lift back overhead. Focus on shoulder flexibility.",
      equipment: ["3-4' PVC Pipe"],
      jointMovements: ["Shoulder Flexion", "Thoracic Extension"],
      difficulty: 3,
      intensity: 2,
      duration: "3 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/vugBFBOe1II",
      targetMuscles: ["Shoulders", "Chest", "Thoracic Spine"],
      isPremium: true,
    },
  ];

  const exercises = subscribed ? [...freeExercises, ...premiumExercises] : freeExercises;

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEquipment = selectedEquipment === "all" || 
                           exercise.equipment.some(eq => eq === selectedEquipment);
    const matchesJointMovement = selectedJointMovement === "all" ||
                               exercise.jointMovements.some(jm => jm === selectedJointMovement);
    const matchesDifficulty = selectedDifficulty === "all" ||
                            exercise.difficulty.toString() === selectedDifficulty;
    const matchesIntensity = selectedIntensity === "all" ||
                           exercise.intensity.toString() === selectedIntensity;
    
    return matchesSearch && matchesEquipment && matchesJointMovement && matchesDifficulty && matchesIntensity;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Exercise Library
                {subscribed && <Crown className="h-6 w-6 text-primary" />}
              </h1>
              <p className="text-muted-foreground">
                {subscribed 
                  ? "Full access to all exercises and premium features" 
                  : "Free exercises available • Upgrade for full library access"
                }
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Search & Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Equipment</SelectItem>
                    {equipmentList.map((equipment) => (
                      <SelectItem key={equipment.name} value={equipment.name}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedJointMovement} onValueChange={setSelectedJointMovement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Joint Movement" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">All Movements</SelectItem>
                    {jointMovements.map((movement) => (
                      <SelectItem key={movement} value={movement}>
                        {movement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="1">⭐ Beginner</SelectItem>
                    <SelectItem value="2">⭐⭐ Easy</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Moderate</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Hard</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Expert</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intensities</SelectItem>
                    <SelectItem value="1">🔥 Very Low</SelectItem>
                    <SelectItem value="2">🔥🔥 Low</SelectItem>
                    <SelectItem value="3">🔥🔥🔥 Moderate</SelectItem>
                    <SelectItem value="4">🔥🔥🔥🔥 High</SelectItem>
                    <SelectItem value="5">🔥🔥🔥🔥🔥 Very High</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEquipment("all");
                    setSelectedJointMovement("all");
                    setSelectedDifficulty("all");
                    setSelectedIntensity("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Equipment Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {equipmentList.map((equipment, index) => (
              <Card 
                key={equipment.name} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEquipment(equipment.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <img 
                      src={equipment.image} 
                      alt={equipment.name}
                      className="w-16 h-16 object-cover rounded-lg mx-auto"
                    />
                  </div>
                  <p className="text-sm font-medium">{equipment.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Joint Movement Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Joint Movement Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["Ankle", "Knee", "Hip", "Lumbar Spine", "Thoracic Spine", "Cervical Spine", "Shoulder", "Elbow", "Wrist"].map((joint) => (
              <Badge 
                key={joint} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {joint}
              </Badge>
            ))}
          </div>
        </div>

        {/* Exercise Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Exercises ({filteredExercises.length})
            </h2>
            <p className="text-muted-foreground">
              {filteredExercises.length === 0 
                ? "No exercises found. Add exercises to get started!"
                : `Showing ${filteredExercises.length} exercise${filteredExercises.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No Exercises Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your exercise library by adding your first exercise.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Exercise
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise, index) => (
                  <ExerciseCard key={index} {...exercise} />
                ))}
              </div>
              
              {/* Premium Section for Non-Subscribers */}
              {!subscribed && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Premium Exercises ({premiumExercises.length})
                    </h2>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Premium Only
                    </Badge>
                  </div>
                  
                  <SubscriptionGate feature="advanced exercise library">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                      {premiumExercises.slice(0, 6).map((exercise, index) => (
                        <div key={index} className="relative">
                          <ExerciseCard {...exercise} />
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium text-muted-foreground">Premium Exercise</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SubscriptionGate>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;