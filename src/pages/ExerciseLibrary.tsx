import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, X, Loader2 } from "lucide-react";
import ExerciseCard from "@/components/ExerciseCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { useSubscription } from "@/hooks/useSubscription";
import { useExercises, Exercise } from "@/hooks/useExercises";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { ExerciseForm } from "@/components/admin/ExerciseForm";
import { equipmentList, jointMovements, bodyAreaList, jointMovementToBodyAreas, BodyArea } from "@/data/exercises";

const ExerciseLibrary = () => {
  const { subscribed } = useSubscription();
  const { isTrainer } = useRole();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedJointMovement, setSelectedJointMovement] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | "all">("all");
  const [previewVariations, setPreviewVariations] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exercises from database
  const { exercises, loading, error, updateExercise } = useExercises({
    searchQuery: searchTerm || undefined,
    equipment: selectedEquipment !== "all" ? [selectedEquipment] : undefined,
    jointMovements: selectedJointMovement !== "all" ? [selectedJointMovement] : undefined,
    difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
    intensity: selectedIntensity !== "all" ? selectedIntensity : undefined,
    categories: selectedCategory !== "all" ? [selectedCategory] : undefined,
  });

  // Sort exercises with mobility first
  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => {
      if (a.categories.includes("mobility") && !b.categories.includes("mobility")) {
        return -1;
      }
      if (!a.categories.includes("mobility") && b.categories.includes("mobility")) {
        return 1;
      }
      return 0;
    });
  }, [exercises]);

  // Get available joint movements from current exercises
  const availableJointMovements = useMemo(() => {
    return Array.from(
      new Set(
        sortedExercises.flatMap(exercise => exercise.joint_movements)
      )
    ).filter(movement => jointMovements.includes(movement));
  }, [sortedExercises]);

  // Filter by body area using joint_movements → bodyArea mapping
  const displayedExercises = useMemo(() => {
    if (selectedBodyArea === "all") return sortedExercises;
    return sortedExercises.filter(exercise =>
      exercise.joint_movements.some(jm => {
        const areas = jointMovementToBodyAreas[jm] || [];
        return areas.includes(selectedBodyArea as BodyArea);
      })
    );
  }, [sortedExercises, selectedBodyArea]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEquipment("all");
    setSelectedJointMovement("all");
    setSelectedDifficulty("all");
    setSelectedIntensity("all");
    setSelectedCategory("all");
    setSelectedBodyArea("all");
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setEditingExercise(exercise);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingExercise) return;

    try {
      setIsSubmitting(true);
      await updateExercise(editingExercise.id, data);
      toast({
        title: "Exercise updated",
        description: `"${data.name}" has been updated successfully.`,
      });
      setIsEditDialogOpen(false);
      setEditingExercise(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-lg text-destructive mb-4">Error loading exercises</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Exercise Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive collection of mobility and strengthening exercises designed to counteract the effects of prolonged sitting.
        </p>
      </div>

      {/* Body Area Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={selectedBodyArea === "all" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setSelectedBodyArea("all")}
          >
            All Areas
          </Badge>
          {bodyAreaList.map((area) => (
            <Badge
              key={area}
              variant={selectedBodyArea === area ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-sm"
              onClick={() => setSelectedBodyArea(selectedBodyArea === area ? "all" : area)}
            >
              {area}
            </Badge>
          ))}
        </div>
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
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
              <SelectTrigger>
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intensities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
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
          {loading ? "Loading..." : `Showing ${displayedExercises.length} exercises`}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Mobility exercises prioritized</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading exercises...</p>
          </CardContent>
        </Card>
      )}

      {/* Exercise Grid */}
      {!loading && displayedExercises.length === 0 ? (
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
      ) : !loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              id={exercise.id}
              name={exercise.name}
              description={exercise.description || ""}
              instructions={exercise.instructions || undefined}
              equipment={exercise.equipment}
              jointMovements={exercise.joint_movements}
              difficulty={exercise.difficulty}
              intensity={exercise.intensity}
              duration={exercise.duration || undefined}
              hasVideo={!!exercise.video_url}
              hasDocument={false}
              videoUrl={exercise.video_url || undefined}
              targetMuscles={exercise.muscle_groups}
              categories={exercise.categories}
              baseline={subscribed || previewVariations ? exercise.baseline || undefined : undefined}
              progression={subscribed || previewVariations ? exercise.progression || undefined : undefined}
              regression={subscribed || previewVariations ? exercise.regression || undefined : undefined}
              allowPreview={previewVariations}
              isTrainer={isTrainer}
              onEdit={handleEditExercise}
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

      {/* Edit Exercise Dialog (Trainers Only) */}
      {isTrainer && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingExercise(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Exercise</DialogTitle>
              <DialogDescription>
                Update the exercise details below. Changes will be visible to all users.
              </DialogDescription>
            </DialogHeader>
            <ExerciseForm
              exercise={editingExercise}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingExercise(null);
              }}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExerciseLibrary;
