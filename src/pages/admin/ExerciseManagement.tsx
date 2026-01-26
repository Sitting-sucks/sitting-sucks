import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useExercises, Exercise } from "@/hooks/useExercises";
import { ExerciseForm } from "@/components/admin/ExerciseForm";
import { Plus, Search, Pencil, Trash2, Loader2, Dumbbell } from "lucide-react";

const ExerciseManagement = () => {
  const { toast } = useToast();
  const { exercises, loading, createExercise, updateExercise, deleteExercise } = useExercises();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [deletingExercise, setDeletingExercise] = useState<Exercise | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter exercises by search term
  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingExercise(null);
    setIsFormOpen(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingExercise) return;

    try {
      setIsSubmitting(true);
      await deleteExercise(deletingExercise.id);
      toast({
        title: "Exercise deleted",
        description: `"${deletingExercise.name}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeletingExercise(null);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingExercise) {
        await updateExercise(editingExercise.id, data);
        toast({
          title: "Exercise updated",
          description: `"${data.name}" has been updated successfully.`,
        });
      } else {
        await createExercise(data);
        toast({
          title: "Exercise created",
          description: `"${data.name}" has been added to the library.`,
        });
      }
      setIsFormOpen(false);
      setEditingExercise(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="h-8 w-8" />
            Exercise Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage exercises in your library
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{exercises.length}</div>
            <div className="text-sm text-muted-foreground">Total Exercises</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {exercises.filter((e) => e.categories.includes("mobility")).length}
            </div>
            <div className="text-sm text-muted-foreground">Mobility Exercises</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {exercises.filter((e) => e.categories.includes("strength")).length}
            </div>
            <div className="text-sm text-muted-foreground">Strength Exercises</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Exercise List */}
      {!loading && (
        <div className="space-y-4">
          {filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? "No exercises match your search" : "No exercises yet. Click 'Add Exercise' to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{exercise.name}</h3>
                        <Badge variant="destructive">
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline">{exercise.intensity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {exercise.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {exercise.equipment.slice(0, 3).map((eq) => (
                          <Badge key={eq} variant="secondary" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                        {exercise.equipment.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{exercise.equipment.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(exercise)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingExercise(exercise)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "Edit Exercise" : "Create New Exercise"}
            </DialogTitle>
            <DialogDescription>
              {editingExercise
                ? "Update the exercise details below"
                : "Fill in the details to add a new exercise to your library"}
            </DialogDescription>
          </DialogHeader>
          <ExerciseForm
            exercise={editingExercise}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingExercise(null);
            }}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingExercise} onOpenChange={() => setDeletingExercise(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingExercise?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExerciseManagement;
