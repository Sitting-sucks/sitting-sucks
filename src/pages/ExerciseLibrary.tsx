import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";
import ExerciseCard from "@/components/ExerciseCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { useSubscription } from "@/hooks/useSubscription";
import { exercises, equipmentList, jointMovements } from "@/data/exercises";

const ExerciseLibrary = () => {
  const { subscribed } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedJointMovement, setSelectedJointMovement] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewVariations, setPreviewVariations] = useState(false);

  // Premium exercises array - empty for now
  const premiumExercises: any[] = [];

  const allExercises = subscribed ? [...exercises, ...premiumExercises] : exercises;

  const filteredExercises = allExercises.filter(exercise => {
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
    // Prioritize mobility exercises
    if (a.categories.includes("mobility") && !b.categories.includes("mobility")) {
      return -1;
    }
    if (!a.categories.includes("mobility") && b.categories.includes("mobility")) {
      return 1;
    }
    return 0;
  });

  // Get available joint movements from filtered exercises
  const availableJointMovements = Array.from(
    new Set(
      filteredExercises.flatMap(exercise => exercise.jointMovements)
    )
  ).filter(movement => jointMovements.includes(movement));

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEquipment("all");
    setSelectedJointMovement("all");
    setSelectedDifficulty("all");
    setSelectedIntensity("all");
    setSelectedCategory("all");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Exercise Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive collection of mobility and strengthening exercises designed to counteract the effects of prolonged sitting.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>Search & Filter Exercises</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="None">None</SelectItem>
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
              <SelectContent>
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
                <SelectItem value="1">1 - Beginner</SelectItem>
                <SelectItem value="2">2 - Easy</SelectItem>
                <SelectItem value="3">3 - Intermediate</SelectItem>
                <SelectItem value="4">4 - Advanced</SelectItem>
                <SelectItem value="5">5 - Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
              <SelectTrigger>
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intensities</SelectItem>
                <SelectItem value="1">1 - Very Light</SelectItem>
                <SelectItem value="2">2 - Light</SelectItem>
                <SelectItem value="3">3 - Moderate</SelectItem>
                <SelectItem value="4">4 - High</SelectItem>
                <SelectItem value="5">5 - Very High</SelectItem>
              </SelectContent>
            </Select>

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
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>

            {!subscribed && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="preview-variations"
                  checked={previewVariations}
                  onCheckedChange={setPreviewVariations}
                />
                <Label htmlFor="preview-variations">Preview Mode</Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Categories */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Equipment Categories</CardTitle>
          <CardDescription>
            Click on equipment to filter exercises that use it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {equipmentList.map((equipment) => (
              <Card
                key={equipment.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEquipment === equipment.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedEquipment(
                  selectedEquipment === equipment.name ? "all" : equipment.name
                )}
              >
                <CardContent className="p-4 text-center">
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="w-16 h-16 mx-auto mb-2 object-cover rounded"
                  />
                  <p className="text-sm font-medium">{equipment.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Joint Movement Categories */}
      {availableJointMovements.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Joint Movement Categories</CardTitle>
            <CardDescription>
              Select specific joint movements to target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableJointMovements.map((movement) => (
                <Badge
                  key={movement}
                  variant={selectedJointMovement === movement ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedJointMovement(
                    selectedJointMovement === movement ? "all" : movement
                  )}
                >
                  {movement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredExercises.length} of {allExercises.length} exercises
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Mobility exercises prioritized</span>
        </div>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No exercises found</p>
            <p className="text-sm text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              description={exercise.description}
              instructions={exercise.instructions}
              equipment={exercise.equipment}
              jointMovements={exercise.jointMovements}
              difficulty={exercise.difficulty}
              intensity={exercise.intensity}
              duration={exercise.duration}
              hasVideo={exercise.hasVideo}
              hasDocument={exercise.hasDocument}
              videoUrl={exercise.videoUrl}
              targetMuscles={exercise.targetMuscles}
              categories={exercise.categories}
              baseline={subscribed || previewVariations ? exercise.baseline : undefined}
              progression={subscribed || previewVariations ? exercise.progression : undefined}
              regression={subscribed || previewVariations ? exercise.regression : undefined}
              allowPreview={previewVariations}
            />
          ))}
        </div>
      )}

      {/* Premium Exercises Section */}
      {!subscribed && (
        <SubscriptionGate feature="Premium Exercise Library">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Advanced mobility sequences</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Specialized strengthening routines</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Expert exercise variations</p>
            </div>
          </div>
        </SubscriptionGate>
      )}

      <Separator className="my-12" />

      {/* Footer Info */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold">Transform Your Movement</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each exercise is specifically designed to counteract the negative effects of prolonged sitting, 
          helping you restore mobility, build strength, and improve your overall movement quality.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="outline">Mobility First</Badge>
          <Badge variant="outline">Science-Based</Badge>
          <Badge variant="outline">Progressive Overload</Badge>
          <Badge variant="outline">Functional Movement</Badge>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;