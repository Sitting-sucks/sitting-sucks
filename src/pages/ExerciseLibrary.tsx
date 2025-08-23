import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ExerciseCard from "@/components/ExerciseCard";
import { Search, Plus, Filter, Lock, Crown, Eye } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewVariations, setPreviewVariations] = useState(false);

  // Equipment categories with images
  const equipmentList = [
    { name: "Yellow Perform Better Band", image: "/lovable-uploads/341515b9-64c7-49bd-ac77-1129071bed02.png" },
    { name: "Purple Plastic Handle", image: "/lovable-uploads/bc8597f3-16a0-407c-a423-cfd0f339b083.png" },
    { name: "Heel Wedges", image: "/lovable-uploads/5b31325f-a9c5-4b98-95a8-fcdcfc3bd59c.png" },
    { name: "Two 2.5 lbs Plates", image: weightPlatesImg },
    { name: "Forearm Spinner", image: "/lovable-uploads/72822b45-61da-48c3-881d-cf3badab9ca9.png" },
    { name: "Foam Roller", image: foamRollerImg },
    { name: "Yoga Blocks", image: "/lovable-uploads/265c2daf-70cc-4d76-8cbf-1cc0da212765.png" },
    { name: "Lacrosse Ball", image: lacrosseBallImg },
    { name: "3-4' PVC Pipe", image: pvcPipeImg },
    { name: "Chair", image: exerciseChairImg }
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

  // Free exercises library - core exercises only
  const freeExercises = [
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
    },
    {
      id: "2",
      name: "Squats",
      description: "The ultimate sit crushing exercise. Full body engagement.",
      instructions: "Put the 2.5 lbs plates under your heels about shoulder width apart. Grab a light weight (At least 5-10 pounds) and hold it out in front of your face or eyes. You can add a chair behind you to assist where to aim. While keeping upright posture, very slowly start lowering yourself towards the seat loading our weight backward into our hips and glutes. Touch the seat and gentle return back to start by pushing through your glutes.",
      equipment: ["2.5 lbs plates", "PVC pipe"],
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
    },
    {
      id: "3",
      name: "Planks",
      description: "Isometric core stabilization exercise for postural strength",
      instructions: "Start in push-up position, then lower to forearms. Maintain neutral spine from head to heels. Engage deep core muscles and breathe normally throughout hold.",
      equipment: ["None", "Foam Roller"],
      jointMovements: ["Cervical Neutral", "Thoracic Neutral", "Lumbar Neutral", "Hip Neutral", "Shoulder Stabilization"],
      difficulty: 1,
      intensity: 2,
      duration: "30-60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Transverse Abdominis", "Rectus Abdominis", "Internal/External Obliques", "Erector Spinae", "Anterior Deltoids"],
      baseline: "Forearm plank with neutral spine",
      progression: "Single-arm plank or plank with leg lifts",
      regression: "Incline plank with hands on chair/box or knee plank",
      categories: ["strength"],
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
    },
    {
      id: "10",
      name: "Heel Wedge Calf Stretch",
      description: "Deep calf and plantar flexing muscles using heel wedges",
      instructions: "Put your heel wedges so the longest part of the wedge is face up allowing toes to be higher than the heal putting the ankle into dorsiflexion, forcing the calf to stretch.",
      equipment: ["Heel Wedges"],
      jointMovements: ["Ankle Dorsiflexion"],
      difficulty: 1,
      intensity: 4,
      duration: "30 s - 2 minutes",
      hasVideo: false,
      hasDocument: true,
      targetMuscles: ["Calves", "Plantar Flexor Muscles"],
      baseline: "Heel wedge calf stretch with yoga block for assistance",
      progression: "Heel wedge calf stretch with added weight",
      regression: "Heel wedge calf stretch using chair for assistance",
      categories: ["mobility"],
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
    },
    {
      id: "18",
      name: "Overhead Shoulder Flexion on Foam Roller (PVC Pipe)",
      description: "A mobility drill to restore full shoulder flexion while reinforcing thoracic spine extension. This exercise teaches your shoulders to move overhead without compensation from the lower back.",
      instructions: "Lie lengthwise on a foam roller so that your head and lumbar spine are supported. (Finding balance may be tricky at first — use your core to stabilize.) Grab the PVC pipe with both hands, thumbs wrapped in the same direction as your fingers to promote slight external rotation at the shoulders. Keep ribs down and lower back flat on the roller. Slowly raise the PVC pipe overhead as far as possible, focusing on motion coming from the shoulders and thoracic spine only. Avoid arching your low back — spine stays long and flat on the roller. Lower the bar back down under control.",
      equipment: ["Foam Roller", "3-4' PVC Pipe"],
      jointMovements: ["Shoulder Flexion", "Thoracic Extension", "Lumbar Neutral", "Shoulder External Rotation"],
      difficulty: 2,
      intensity: 2,
      duration: "8-12 controlled reps or 30-60 seconds continuous motion",
      hasVideo: false,
      hasDocument: false,
      targetMuscles: ["Anterior Deltoids", "Middle Deltoids", "Serratus Anterior", "Lower Trapezius", "Rectus Abdominis", "Obliques"],
      baseline: "Overhead shoulder flexion with foam roller and PVC pipe",
      progression: "Overhead shoulder flexion with longer hold times or single-arm variations",
      regression: "Overhead shoulder flexion without foam roller or with shorter range of motion",
      categories: ["mobility"],
    },
  ];

  // Premium exercises array - empty for now
  const premiumExercises: any[] = [];

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
    const matchesCategory = selectedCategory === "all" ||
                           exercise.categories.includes(selectedCategory);
    
    return matchesSearch && matchesEquipment && matchesJointMovement && matchesDifficulty && matchesIntensity && matchesCategory;
  }).sort((a, b) => {
    // Sort by category: mobility first, then strength
    const aHasMobility = a.categories.includes("mobility");
    const bHasMobility = b.categories.includes("mobility");
    
    if (aHasMobility && !bHasMobility) return -1;
    if (!aHasMobility && bHasMobility) return 1;
    return 0;
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="mobility">Mobility</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                  </SelectContent>
                </Select>

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
                    setSelectedCategory("all");
                    setSelectedEquipment("all");
                    setSelectedJointMovement("all");
                    setSelectedDifficulty("all");
                    setSelectedIntensity("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
              
              {/* Preview Variations Toggle */}
              {!subscribed && (
                <div className="flex items-center space-x-2 mt-4 p-3 bg-muted/30 rounded-lg">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="preview-variations" className="text-sm font-medium">
                    Preview Exercise Variations
                  </Label>
                  <Switch
                    id="preview-variations"
                    checked={previewVariations}
                    onCheckedChange={setPreviewVariations}
                  />
                  <Badge variant="outline" className="text-xs">
                    Preview Mode
                  </Badge>
                </div>
              )}
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
                  <ExerciseCard key={index} {...exercise} allowPreview={previewVariations} />
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