import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ExerciseCard from "@/components/ExerciseCard";
import { Search, Plus, Filter } from "lucide-react";

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedJointMovement, setSelectedJointMovement] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

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

  // Mock exercises data (you mentioned not to add actual exercises, just the structure)
  const exercises = [
    // This is just for demonstration - remove actual exercises as requested
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEquipment = selectedEquipment === "all" || 
                           exercise.equipment.some(eq => eq === selectedEquipment);
    const matchesJointMovement = selectedJointMovement === "all" ||
                               exercise.jointMovements.some(jm => jm === selectedJointMovement);
    const matchesDifficulty = selectedDifficulty === "all" ||
                            exercise.difficulty.toString() === selectedDifficulty;
    
    return matchesSearch && matchesEquipment && matchesJointMovement && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Exercise Library</h1>
              <p className="text-muted-foreground">
                Comprehensive collection of anti-sitting exercises
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

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEquipment("all");
                    setSelectedJointMovement("all");
                    setSelectedDifficulty("all");
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise, index) => (
                <ExerciseCard key={index} {...exercise} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;