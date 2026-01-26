import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CalendarIcon, Dumbbell, Clock, Star, Plus, X, Loader2, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useGamification } from '@/hooks/useGamification';
import { useUserStats } from '@/hooks/useUserStats';
import { useHaptics } from '@/hooks/useNative';
import { toast } from 'sonner';

interface QuickLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Exercise {
  id: string | null;
  name: string;
  muscle_groups: string[];
  duration: string | null;
  isCustom?: boolean;
}

interface ExerciseEntry {
  id: string;
  exercise: Exercise;
  sets: string;
  reps: string;
  weight: string;
  duration: string;
  notes: string;
}

const MUSCLE_GROUPS = [
  'Calves', 'Hamstrings', 'Quadriceps', 'Glutes', 'Hip Flexors',
  'Core', 'Lower Back', 'Upper Back', 'Chest', 'Shoulders',
  'Biceps', 'Triceps', 'Forearms', 'Full Body',
];

export const QuickLogModal = ({ open, onOpenChange }: QuickLogModalProps) => {
  const { user } = useAuth();
  const { awardWorkoutPoints } = useGamification();
  const { updateStatsOnWorkout } = useUserStats();
  const haptics = useHaptics();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [showCustomExercise, setShowCustomExercise] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customMuscleGroups, setCustomMuscleGroups] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    workoutName: '',
    rating: 3,
    effort: 5,
    notes: '',
  });

  // Fetch exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('id, name, muscle_groups, duration')
        .order('name');

      if (!error && data) {
        setExercises(data);
      }
    };

    if (open) {
      fetchExercises();
    }
  }, [open]);

  // Filter exercises based on search
  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercises.slice(0, 20);
    const query = searchQuery.toLowerCase();
    return exercises
      .filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.muscle_groups?.some(mg => mg.toLowerCase().includes(query))
      )
      .slice(0, 20);
  }, [exercises, searchQuery]);

  // Calculate total duration from exercise entries
  const totalDuration = useMemo(() => {
    return exerciseEntries.reduce((total, entry) => {
      const dur = parseInt(entry.duration) || 0;
      return total + dur;
    }, 0);
  }, [exerciseEntries]);

  // Get all muscle groups from entries
  const allMuscleGroups = useMemo(() => {
    const groups = new Set<string>();
    exerciseEntries.forEach(entry => {
      entry.exercise.muscle_groups?.forEach(mg => groups.add(mg));
    });
    return Array.from(groups);
  }, [exerciseEntries]);

  const addExercise = (exercise: Exercise) => {
    const newEntry: ExerciseEntry = {
      id: crypto.randomUUID(),
      exercise,
      sets: '',
      reps: '',
      weight: '',
      duration: exercise.duration?.match(/\d+/)?.[0] || '5',
      notes: '',
    };
    setExerciseEntries(prev => [...prev, newEntry]);
    setShowExerciseSearch(false);
    setShowCustomExercise(false);
    setSearchQuery('');

    // Light haptic feedback when adding exercise
    haptics.impact('light');
  };

  const addCustomExercise = () => {
    if (!customExerciseName.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }

    const customExercise: Exercise = {
      id: null,
      name: customExerciseName.trim(),
      muscle_groups: customMuscleGroups,
      duration: null,
      isCustom: true,
    };

    addExercise(customExercise);
    setCustomExerciseName('');
    setCustomMuscleGroups([]);
  };

  const toggleCustomMuscleGroup = (mg: string) => {
    setCustomMuscleGroups(prev =>
      prev.includes(mg) ? prev.filter(m => m !== mg) : [...prev, mg]
    );
  };

  const updateExerciseEntry = (id: string, field: keyof ExerciseEntry, value: string) => {
    setExerciseEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const removeExerciseEntry = (id: string) => {
    setExerciseEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const parsePositiveInt = (value: string): number | null => {
    if (!value || value.trim() === '') return null;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return null;
    return num;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to log workouts');
      return;
    }

    if (exerciseEntries.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    setLoading(true);
    try {
      // Create workout log entries for each exercise
      const logEntries = exerciseEntries.map(entry => {
        // For custom exercises, include the exercise name in workout_name
        const workoutName = entry.exercise.isCustom
          ? `${formData.workoutName || 'Quick Workout'} - ${entry.exercise.name}`
          : formData.workoutName || 'Quick Workout';

        // For custom exercises, add the exercise name to notes if not already noted
        const notes = entry.exercise.isCustom && !entry.notes
          ? `Custom exercise: ${entry.exercise.name}${formData.notes ? `. ${formData.notes}` : ''}`
          : entry.notes || formData.notes || null;

        return {
          user_id: user.id,
          exercise_id: entry.exercise.id, // Will be null for custom exercises
          logged_at: date.toISOString(),
          workout_name: workoutName,
          duration_minutes: parsePositiveInt(entry.duration),
          rating: formData.rating,
          perceived_effort: formData.effort,
          muscle_groups_worked: entry.exercise.muscle_groups || [],
          notes,
          sets_completed: parsePositiveInt(entry.sets),
          reps_completed: entry.reps || null,
          weight_used: entry.weight || null,
          source: 'manual',
        };
      });

      const { error } = await supabase.from('workout_logs').insert(logEntries);

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23503') {
          toast.error('Profile not found. Please try signing out and back in.');
        } else if (error.code === '42501') {
          toast.error('Permission denied. Please sign out and sign back in.');
        } else {
          toast.error(`Failed to log workout: ${error.message}`);
        }
        return;
      }

      // Calculate totals for stats
      const totalSets = exerciseEntries.reduce((sum, e) => sum + (parseInt(e.sets) || 0), 0);
      const totalReps = exerciseEntries.reduce((sum, e) => {
        // Parse reps - could be "10-12" or "10"
        const repMatch = e.reps.match(/\d+/);
        return sum + (repMatch ? parseInt(repMatch[0]) : 0);
      }, 0);
      const totalWeight = exerciseEntries.reduce((sum, e) => {
        const weightMatch = e.weight.match(/\d+/);
        return sum + (weightMatch ? parseInt(weightMatch[0]) : 0);
      }, 0);

      // Update user stats for dashboard sync
      try {
        await updateStatsOnWorkout({
          sets: totalSets,
          reps: totalReps,
          weight: totalWeight,
          duration: totalDuration,
          muscleGroups: allMuscleGroups,
          exerciseId: exerciseEntries[0]?.exercise.id || undefined,
        });
      } catch (statsError) {
        console.error('Error updating stats (workout still saved):', statsError);
      }

      // Award points (with error handling)
      try {
        await awardWorkoutPoints();
      } catch (pointsError) {
        console.error('Error awarding points (workout still saved):', pointsError);
      }

      // Haptic feedback on success
      haptics.success();

      toast.success('Workout logged successfully!', {
        description: `${exerciseEntries.length} exercise${exerciseEntries.length > 1 ? 's' : ''} logged • +50 points earned`,
      });

      // Reset form
      setFormData({
        workoutName: '',
        rating: 3,
        effort: 5,
        notes: '',
      });
      setExerciseEntries([]);
      setDate(new Date());
      onOpenChange(false);
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Log Workout
          </DialogTitle>
          <DialogDescription>
            Add exercises and track your sets, reps, and weights
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Workout Name & Date Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  id="workoutName"
                  placeholder="e.g., Morning Routine"
                  value={formData.workoutName}
                  onChange={(e) => setFormData(prev => ({ ...prev, workoutName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Exercise Search */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Exercises</Label>
                {exerciseEntries.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {exerciseEntries.length} exercise{exerciseEntries.length > 1 ? 's' : ''} • ~{totalDuration} min
                  </span>
                )}
              </div>

              {showCustomExercise ? (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Custom Exercise Name</Label>
                      <Input
                        placeholder="e.g., Dumbbell Curls, Yoga Flow..."
                        value={customExerciseName}
                        onChange={(e) => setCustomExerciseName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Muscle Groups (optional)</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {MUSCLE_GROUPS.map((mg) => (
                          <Badge
                            key={mg}
                            variant={customMuscleGroups.includes(mg) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs hover:bg-primary/90 transition-colors"
                            onClick={() => toggleCustomMuscleGroup(mg)}
                          >
                            {mg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setShowCustomExercise(false);
                          setCustomExerciseName('');
                          setCustomMuscleGroups([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={addCustomExercise}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : showExerciseSearch ? (
                <Card>
                  <CardContent className="p-2">
                    <Command className="rounded-lg border-0">
                      <CommandInput
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        autoFocus
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="py-4 text-center">
                            <p className="text-sm text-muted-foreground mb-2">No exercises found</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowExerciseSearch(false);
                                setShowCustomExercise(true);
                                setCustomExerciseName(searchQuery);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add "{searchQuery}" as custom
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredExercises.map((exercise) => (
                            <CommandItem
                              key={exercise.id}
                              value={exercise.name}
                              onSelect={() => addExercise(exercise)}
                              className="cursor-pointer"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exercise.muscle_groups?.slice(0, 3).join(', ')}
                                </p>
                              </div>
                              <Plus className="h-4 w-4 text-primary" />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setShowExerciseSearch(false);
                          setSearchQuery('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setShowExerciseSearch(false);
                          setShowCustomExercise(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Custom Exercise
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start gap-2"
                    onClick={() => setShowExerciseSearch(true)}
                  >
                    <Search className="h-4 w-4" />
                    Search Library
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowCustomExercise(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Custom
                  </Button>
                </div>
              )}
            </div>

            {/* Exercise Entries */}
            {exerciseEntries.length > 0 && (
              <div className="space-y-3">
                {exerciseEntries.map((entry, index) => (
                  <Card key={entry.id} className="relative">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entry.exercise.name}</p>
                            {entry.exercise.isCustom && (
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.exercise.muscle_groups?.slice(0, 3).map(mg => (
                              <Badge key={mg} variant="secondary" className="text-xs">
                                {mg}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeExerciseEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Sets</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="3"
                            value={entry.sets}
                            onChange={(e) => updateExerciseEntry(entry.id, 'sets', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Reps</Label>
                          <Input
                            placeholder="10-12"
                            value={entry.reps}
                            onChange={(e) => updateExerciseEntry(entry.id, 'reps', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Weight</Label>
                          <Input
                            placeholder="lbs"
                            value={entry.weight}
                            onChange={(e) => updateExerciseEntry(entry.id, 'weight', e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Duration</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="min"
                            value={entry.duration}
                            onChange={(e) => updateExerciseEntry(entry.id, 'duration', e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </div>

                      {/* Per-exercise notes (collapsible) */}
                      <div className="mt-2">
                        <Input
                          placeholder="Notes for this exercise (optional)"
                          value={entry.notes}
                          onChange={(e) => updateExerciseEntry(entry.id, 'notes', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Muscle Groups Summary */}
            {allMuscleGroups.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Muscle Groups Worked</Label>
                <div className="flex flex-wrap gap-1">
                  {allMuscleGroups.map(mg => (
                    <Badge key={mg} variant="outline">
                      {mg}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>How was your workout?</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Perceived Effort */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Perceived Effort (RPE)</Label>
                <span className="text-sm font-medium">{formData.effort}/10</span>
              </div>
              <Slider
                value={[formData.effort]}
                onValueChange={([value]) => setFormData(prev => ({ ...prev, effort: value }))}
                min={1}
                max={10}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Easy</span>
                <span>Maximum</span>
              </div>
            </div>

            {/* General Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">General Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did you feel? Any PRs? Notes for next time..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {exerciseEntries.length > 0 ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Total: ~{totalDuration} minutes
              </span>
            ) : (
              <span>Add exercises to log your workout</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || exerciseEntries.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Workout
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
