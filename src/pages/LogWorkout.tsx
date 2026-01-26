import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, CheckCircle2, Dumbbell, ArrowLeft, Save } from "lucide-react";

interface ExerciseToLog {
  id: string;
  program_exercise_id: string;
  name: string;
  target_sets: number | null;
  target_reps: string | null;
  notes: string | null;
  // User input
  sets_completed: string;
  reps_completed: string;
  weight_used: string;
  user_notes: string;
  completed: boolean;
}

const LogWorkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed, subscriptionTier } = useSubscription();
  const { awardWorkoutPoints, awardExerciseLogPoints } = useGamification();
  const [searchParams] = useSearchParams();

  const programId = searchParams.get("program");
  const dayNumber = parseInt(searchParams.get("day") || "1");

  const [exercises, setExercises] = useState<ExerciseToLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programName, setProgramName] = useState("");

  const isTier2 = subscriptionTier === "coaching";

  useEffect(() => {
    const fetchExercises = async () => {
      if (!programId) return;

      try {
        setLoading(true);

        // Get program name
        const { data: programData } = await supabase
          .from("programs")
          .select("name")
          .eq("id", programId)
          .single();

        if (programData) {
          setProgramName(programData.name);
        }

        // Get exercises for this day
        const { data, error } = await supabase
          .from("program_exercises")
          .select(`
            id,
            sets,
            reps,
            notes,
            exercises (
              id,
              name
            )
          `)
          .eq("program_id", programId)
          .eq("day_number", dayNumber)
          .order("order_index");

        if (error) throw error;

        const exercisesToLog: ExerciseToLog[] = (data || []).map((pe) => ({
          id: pe.exercises?.id || "",
          program_exercise_id: pe.id,
          name: pe.exercises?.name || "Unknown Exercise",
          target_sets: pe.sets,
          target_reps: pe.reps,
          notes: pe.notes,
          sets_completed: pe.sets?.toString() || "",
          reps_completed: pe.reps || "",
          weight_used: "",
          user_notes: "",
          completed: false,
        }));

        setExercises(exercisesToLog);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        toast({
          title: "Error",
          description: "Failed to load exercises.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [programId, dayNumber, toast]);

  const updateExercise = (index: number, field: keyof ExerciseToLog, value: string | boolean) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSave = async () => {
    if (!user || !programId) return;

    try {
      setSaving(true);

      const completedExercises = exercises.filter((ex) => ex.completed);

      if (completedExercises.length === 0) {
        toast({
          title: "No exercises completed",
          description: "Mark at least one exercise as completed before saving.",
          variant: "destructive",
        });
        return;
      }

      // Insert workout logs
      const logsToInsert = completedExercises.map((ex) => ({
        user_id: user.id,
        program_id: programId,
        exercise_id: ex.id,
        sets_completed: parseInt(ex.sets_completed) || null,
        reps_completed: ex.reps_completed || null,
        weight_used: ex.weight_used || null,
        notes: ex.user_notes || null,
      }));

      const { error } = await supabase.from("workout_logs").insert(logsToInsert);

      if (error) throw error;

      // Award gamification points
      let pointsAwarded = true;
      try {
        await awardWorkoutPoints();
        for (let i = 0; i < completedExercises.length; i++) {
          await awardExerciseLogPoints();
        }
      } catch (gamificationError) {
        console.error("Gamification error:", gamificationError);
        pointsAwarded = false;
      }

      // Show appropriate toast based on whether points were awarded
      if (pointsAwarded) {
        toast({
          title: "Workout logged!",
          description: `${completedExercises.length} exercise(s) saved to your progress. Points earned!`,
        });
      } else {
        toast({
          title: "Workout logged",
          description: `${completedExercises.length} exercise(s) saved, but there was an issue awarding points. They may be added later.`,
          variant: "default",
        });
      }

      navigate("/progress");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!subscribed || !isTier2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Tier 2 Feature</h2>
            <p className="text-muted-foreground mb-6">
              Workout logging and progress tracking is available for Tier 2 subscribers.
            </p>
            <Link to="/pricing">
              <Button>Upgrade to Tier 2</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!programId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Program Selected</h2>
            <p className="text-muted-foreground mb-6">
              Please select a program from My Programs to log a workout.
            </p>
            <Link to="/my-programs">
              <Button>Go to My Programs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/my-programs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Programs
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Dumbbell className="h-8 w-8" />
          Log Workout
        </h1>
        <p className="text-muted-foreground mt-1">
          {programName} - Day {dayNumber}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : exercises.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No exercises for this day.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <Card
              key={exercise.program_exercise_id}
              className={exercise.completed ? "ring-2 ring-green-500" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => updateExercise(index, "completed", !exercise.completed)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      exercise.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {exercise.completed && <CheckCircle2 className="h-5 w-5" />}
                  </button>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Target: {exercise.target_sets} sets x {exercise.target_reps}
                          {exercise.notes && ` - ${exercise.notes}`}
                        </p>
                      </div>
                      <Badge variant={exercise.completed ? "default" : "outline"}>
                        {exercise.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`sets-${index}`}>Sets Completed</Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          value={exercise.sets_completed}
                          onChange={(e) => updateExercise(index, "sets_completed", e.target.value)}
                          placeholder={exercise.target_sets?.toString() || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reps-${index}`}>Reps Completed</Label>
                        <Input
                          id={`reps-${index}`}
                          value={exercise.reps_completed}
                          onChange={(e) => updateExercise(index, "reps_completed", e.target.value)}
                          placeholder={exercise.target_reps || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`weight-${index}`}>Weight Used</Label>
                        <Input
                          id={`weight-${index}`}
                          value={exercise.weight_used}
                          onChange={(e) => updateExercise(index, "weight_used", e.target.value)}
                          placeholder="e.g., 25 lbs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`notes-${index}`}>Notes (optional)</Label>
                      <Textarea
                        id={`notes-${index}`}
                        value={exercise.user_notes}
                        onChange={(e) => updateExercise(index, "user_notes", e.target.value)}
                        placeholder="How did it feel? Any modifications?"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Save Button */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">
                    {exercises.filter((e) => e.completed).length} of {exercises.length} exercises completed
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Mark exercises as completed and save your workout
                  </p>
                </div>
                <Button onClick={handleSave} disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Workout
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LogWorkout;
