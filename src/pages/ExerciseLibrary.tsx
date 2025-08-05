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

const ExerciseLibrary = () => {
  const { subscribed } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedJointMovement, setSelectedJointMovement] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");

  // Equipment categories based on your requirements
  const equipmentList = [
    "Yellow Perform Better Band",
    "Purple Plastic Handle", 
    "Heel Wedges",
    "Two 2.5 lbs Plates",
    "Forearm Spinner",
    "Foam Roller",
    "Yoga Blocks",
    "Lacrosse Ball",
    "3-4' PVC Pipe",
    "12-36\" Box/Chair"
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

  // Enhanced exercises data with detailed information
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
      name: "Deadlifts",
      description: "Compound movement working the entire posterior chain",
      instructions: "Stand with feet hip-width apart, barbell over mid-foot. Bend at hips and knees to grip bar. Keep chest up, shoulders back. Drive through heels to lift bar, extending hips and knees simultaneously.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Hip Extension", "Knee Extension"],
      difficulty: 4,
      intensity: 5,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ytGaGIn3SjE",
      targetMuscles: ["Hamstrings", "Glutes", "Lower Back", "Traps", "Lats"],
    },
    {
      id: "4",
      name: "Pull-ups",
      description: "Upper body pulling exercise for back and biceps",
      instructions: "Hang from pull-up bar with arms fully extended, hands slightly wider than shoulders. Pull your body up until chin clears the bar. Lower with control to starting position.",
      equipment: ["12-36\" Box/Chair"],
      jointMovements: ["Shoulder Extension", "Elbow Flexion"],
      difficulty: 4,
      intensity: 4,
      duration: "30 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
      targetMuscles: ["Lats", "Rhomboids", "Biceps", "Rear Delts"],
    },
    {
      id: "5",
      name: "Foam Rolling - IT Band",
      description: "Self-myofascial release for IT band and lateral thigh",
      instructions: "Lie on side with foam roller under IT band. Support upper body with forearm. Roll slowly from hip to just above knee, pausing on tender spots for 30 seconds.",
      equipment: ["Foam Roller"],
      jointMovements: ["Hip Abduction", "Hip Adduction"],
      difficulty: 2,
      intensity: 3,
      duration: "2 minutes",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/QE1GDSVObyE",
      targetMuscles: ["IT Band", "Quadriceps", "Glutes"],
    },
    {
      id: "6",
      name: "Ankle Mobility with Wedges",
      description: "Improve ankle dorsiflexion using heel wedges",
      instructions: "Place heel wedges under heels. Perform calf stretches, wall ankle stretches, or deep squats. The wedges help achieve greater range of motion safely.",
      equipment: ["Heel Wedges"],
      jointMovements: ["Ankle Dorsiflexion"],
      difficulty: 1,
      intensity: 1,
      duration: "3 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
      targetMuscles: ["Calves", "Achilles"],
    },
  ];

  // Premium exercises (locked for non-subscribers)
  const premiumExercises = [
    {
      id: "7",
      name: "Bulgarian Split Squats",
      description: "Single-leg exercise for unilateral strength and stability",
      instructions: "Stand 2 feet in front of bench. Place rear foot on bench. Lower into lunge position, keeping front knee over ankle. Push through front heel to return.",
      equipment: ["12-36\" Box/Chair"],
      jointMovements: ["Hip Flexion", "Knee Flexion"],
      difficulty: 4,
      intensity: 4,
      duration: "45 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
      targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
      isPremium: true,
    },
    {
      id: "8",
      name: "Turkish Get-ups",
      description: "Complex movement pattern for full-body coordination",
      instructions: "Start lying on back with weight in right hand. Press weight overhead. Use left hand and elbow to prop up. Transition to standing while keeping weight overhead.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Shoulder Flexion", "Hip Flexion", "Thoracic Extension"],
      difficulty: 5,
      intensity: 4,
      duration: "2 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/0bWRPC49noU",
      targetMuscles: ["Full Body", "Core", "Shoulders"],
      isPremium: true,
    },
    {
      id: "9",
      name: "Advanced Band Pull-aparts",
      description: "Posterior deltoid and rhomboid strengthening with bands",
      instructions: "Hold band at chest level with arms extended. Pull band apart by squeezing shoulder blades together. Control return to start position.",
      equipment: ["Yellow Perform Better Band"],
      jointMovements: ["Shoulder Horizontal Abduction"],
      difficulty: 3,
      intensity: 3,
      duration: "60 seconds",
      hasVideo: true,
      hasDocument: false,
      videoUrl: "https://www.youtube.com/embed/tZkMJvhCZGU",
      targetMuscles: ["Rear Delts", "Rhomboids", "Middle Traps"],
      isPremium: true,
    },
    {
      id: "10",
      name: "Single-Arm Farmer's Walk",
      description: "Unilateral loaded carry for core stability and grip strength",
      instructions: "Hold weight in one hand at side. Walk forward maintaining upright posture. Keep shoulders level and core engaged throughout.",
      equipment: ["Two 2.5 lbs Plates"],
      jointMovements: ["Shoulder Stabilization"],
      difficulty: 3,
      intensity: 4,
      duration: "90 seconds",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/rt17lmnaLSM",
      targetMuscles: ["Core", "Shoulders", "Forearms"],
      isPremium: true,
    },
    {
      id: "11",
      name: "Advanced Thoracic Spine Mobility",
      description: "Complex thoracic spine movement patterns with PVC pipe",
      instructions: "Hold PVC pipe overhead. Rotate torso left and right while maintaining arm position. Add lateral bending for increased mobility.",
      equipment: ["3-4' PVC Pipe"],
      jointMovements: ["Thoracic Rotation", "Thoracic Lateral Flexion"],
      difficulty: 3,
      intensity: 2,
      duration: "3 minutes",
      hasVideo: true,
      hasDocument: true,
      videoUrl: "https://www.youtube.com/embed/vugBFBOe1II",
      targetMuscles: ["Thoracic Spine", "Shoulders"],
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
                      <SelectItem key={equipment} value={equipment}>
                        {equipment}
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
                key={equipment} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEquipment(equipment)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🏋️</div>
                  <p className="text-sm font-medium">{equipment}</p>
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