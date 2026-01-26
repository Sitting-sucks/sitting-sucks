import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { usePrograms, Program, ProgramWithExercises } from "@/hooks/usePrograms";
import { useExercises, Exercise } from "@/hooks/useExercises";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Pencil, Trash2, Loader2, Calendar, GripVertical, X, Dumbbell } from "lucide-react";

const ProgramBuilder = () => {
  const { toast } = useToast();
  const { programs, loading: programsLoading, createProgram, updateProgram, deleteProgram, addExerciseToProgram, removeExerciseFromProgram, getProgramWithExercises } = usePrograms();
  const { exercises, loading: exercisesLoading } = useExercises();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<ProgramWithExercises | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New program form state
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    is_template: true,
    is_premade: false,
  });

  // Builder state
  const [selectedDay, setSelectedDay] = useState(1);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [addingExercise, setAddingExercise] = useState<Exercise | null>(null);
  const [exerciseConfig, setExerciseConfig] = useState({ sets: 3, reps: "10", notes: "" });

  // Filter programs by search term
  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter exercises for adding
  const filteredExercises = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
      e.description?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createProgram(newProgram);
      toast({
        title: "Program created",
        description: `"${newProgram.name}" has been created.`,
      });
      setIsCreateOpen(false);
      setNewProgram({ name: "", description: "", is_template: true, is_premade: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;
    try {
      setIsSubmitting(true);
      await deleteProgram(deletingProgram.id);
      toast({
        title: "Program deleted",
        description: `"${deletingProgram.name}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeletingProgram(null);
    }
  };

  const openBuilder = async (program: Program) => {
    const fullProgram = await getProgramWithExercises(program.id);
    if (fullProgram) {
      setCurrentProgram(fullProgram);
      setIsBuilderOpen(true);
      setSelectedDay(1);
    }
  };

  const handleAddExercise = async () => {
    if (!currentProgram || !addingExercise) return;

    try {
      setIsSubmitting(true);
      const currentDayExercises = currentProgram.program_exercises.filter(
        (pe) => pe.day_number === selectedDay
      );
      const orderIndex = currentDayExercises.length;

      await addExerciseToProgram(
        currentProgram.id,
        addingExercise.id,
        selectedDay,
        orderIndex,
        exerciseConfig.sets,
        exerciseConfig.reps,
        exerciseConfig.notes || undefined
      );

      // Refresh program data
      const updatedProgram = await getProgramWithExercises(currentProgram.id);
      if (updatedProgram) {
        setCurrentProgram(updatedProgram);
      }

      toast({
        title: "Exercise added",
        description: `"${addingExercise.name}" added to Day ${selectedDay}.`,
      });

      setAddingExercise(null);
      setExerciseConfig({ sets: 3, reps: "10", notes: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExercise = async (programExerciseId: string) => {
    if (!currentProgram) return;

    try {
      await removeExerciseFromProgram(programExerciseId);

      // Refresh program data
      const updatedProgram = await getProgramWithExercises(currentProgram.id);
      if (updatedProgram) {
        setCurrentProgram(updatedProgram);
      }

      toast({
        title: "Exercise removed",
        description: "Exercise has been removed from the program.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get exercises for current day
  const currentDayExercises = currentProgram?.program_exercises.filter(
    (pe) => pe.day_number === selectedDay
  ) || [];

  // Get unique days in the program
  const programDays = currentProgram
    ? Array.from(new Set(currentProgram.program_exercises.map((pe) => pe.day_number))).sort()
    : [];
  const maxDay = programDays.length > 0 ? Math.max(...programDays) : 0;
  const availableDays = Array.from({ length: Math.max(maxDay + 1, 7) }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Program Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage workout programs for your clients
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
              <DialogDescription>
                Set up a new workout program that you can customize with exercises
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program-name">Program Name *</Label>
                <Input
                  id="program-name"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  placeholder="e.g., Anti-Sitting Protocol"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-description">Description</Label>
                <Textarea
                  id="program-description"
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  placeholder="Brief description of the program"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-template"
                    checked={newProgram.is_template}
                    onCheckedChange={(checked) => setNewProgram({ ...newProgram, is_template: checked })}
                  />
                  <Label htmlFor="is-template">Save as template</Label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-premade"
                    checked={newProgram.is_premade}
                    onCheckedChange={(checked) => setNewProgram({ ...newProgram, is_premade: checked })}
                  />
                  <Label htmlFor="is-premade">Available to all subscribers (Tier 1)</Label>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Program"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
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
            <div className="text-2xl font-bold">{programs.length}</div>
            <div className="text-sm text-muted-foreground">Total Programs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {programs.filter((p) => p.is_template).length}
            </div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {programs.filter((p) => p.is_premade).length}
            </div>
            <div className="text-sm text-muted-foreground">Premade (Tier 1)</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {programsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Program List */}
      {!programsLoading && (
        <div className="space-y-4">
          {filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? "No programs match your search" : "No programs yet. Click 'Create Program' to get started!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{program.name}</h3>
                        {program.is_template && (
                          <Badge variant="secondary">Template</Badge>
                        )}
                        {program.is_premade && (
                          <Badge variant="default">Tier 1 Access</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {program.description || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openBuilder(program)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit Program
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingProgram(program)}
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

      {/* Program Builder Dialog */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Program: {currentProgram?.name}</DialogTitle>
            <DialogDescription>
              Add exercises to each day of the program
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4">
            {/* Days Selection */}
            <div className="md:w-1/4">
              <Label className="mb-2 block">Program Days</Label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {availableDays.map((day) => {
                  const dayExercises = currentProgram?.program_exercises.filter(
                    (pe) => pe.day_number === day
                  ) || [];
                  return (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedDay(day)}
                    >
                      Day {day}
                      {dayExercises.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {dayExercises.length}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Day Content */}
            <div className="md:w-3/4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Day {selectedDay} Exercises</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Add Exercise to Day {selectedDay}</DialogTitle>
                    </DialogHeader>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search exercises..."
                        value={exerciseSearchTerm}
                        onChange={(e) => setExerciseSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px]">
                      {exercisesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        filteredExercises.map((exercise) => (
                          <Card
                            key={exercise.id}
                            className={`cursor-pointer hover:bg-accent ${
                              addingExercise?.id === exercise.id ? "ring-2 ring-primary" : ""
                            }`}
                            onClick={() => setAddingExercise(exercise)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{exercise.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {exercise.difficulty} | {exercise.intensity}
                                  </div>
                                </div>
                                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                    {addingExercise && (
                      <div className="border-t pt-4 mt-4 space-y-4">
                        <h4 className="font-medium">Configure: {addingExercise.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Sets</Label>
                            <Input
                              type="number"
                              value={exerciseConfig.sets}
                              onChange={(e) =>
                                setExerciseConfig({ ...exerciseConfig, sets: parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reps</Label>
                            <Input
                              value={exerciseConfig.reps}
                              onChange={(e) =>
                                setExerciseConfig({ ...exerciseConfig, reps: e.target.value })
                              }
                              placeholder="e.g., 10 or 8-12"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Notes (optional)</Label>
                          <Input
                            value={exerciseConfig.notes}
                            onChange={(e) =>
                              setExerciseConfig({ ...exerciseConfig, notes: e.target.value })
                            }
                            placeholder="Additional instructions"
                          />
                        </div>
                        <Button onClick={handleAddExercise} disabled={isSubmitting} className="w-full">
                          {isSubmitting ? "Adding..." : "Add to Day " + selectedDay}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {currentDayExercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No exercises for this day. Click "Add Exercise" to get started.
                  </div>
                ) : (
                  currentDayExercises.map((pe, index) => (
                    <Card key={pe.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                            <span className="font-mono text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {pe.exercises?.name || "Unknown Exercise"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {pe.sets} sets x {pe.reps} reps
                              {pe.notes && ` - ${pe.notes}`}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExercise(pe.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProgram} onOpenChange={() => setDeletingProgram(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProgram?.name}"? This will also remove all exercise assignments in this program. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgram}
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

export default ProgramBuilder;
