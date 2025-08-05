import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, RotateCcw, Clock, Target, Gift, Crown, CheckCircle2 } from 'lucide-react';
import { useDailyWorkout } from '@/hooks/useDailyWorkout';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { toast } from 'sonner';

const DailyWorkout = () => {
  const { dailyWorkout, loading, hasAccessedToday, saveDailyWorkoutAccess, refreshWorkout } = useDailyWorkout();
  const { subscribed } = useSubscription();
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handleStartWorkout = async () => {
    if (!subscribed && hasAccessedToday) {
      toast.error('You have already accessed your free daily workout. Upgrade to Premium for unlimited access!');
      return;
    }
    
    setIsWorkoutStarted(true);
    setIsPlaying(true);
    
    if (!subscribed && !hasAccessedToday) {
      await saveDailyWorkoutAccess();
      toast.success('You have used your free daily workout! Upgrade to Premium for unlimited access.');
    }
  };

  const handleNextExercise = () => {
    if (!dailyWorkout) return;
    
    if (currentExerciseIndex < dailyWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimeRemaining(dailyWorkout.exercises[currentExerciseIndex + 1].duration);
    } else {
      toast.success('Workout completed! Great job!');
      setIsWorkoutStarted(false);
      setCurrentExerciseIndex(0);
      setIsPlaying(false);
    }
  };

  const handleGenerateNewWorkout = () => {
    if (!subscribed) {
      toast.error('Premium feature! Upgrade to generate custom workouts.');
      return;
    }
    
    refreshWorkout();
    setCurrentExerciseIndex(0);
    setIsWorkoutStarted(false);
    setIsPlaying(false);
    toast.success('New workout generated!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dailyWorkout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Workout Available</CardTitle>
            <CardDescription>Unable to load today's workout. Please try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshWorkout} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show premium gate for non-subscribers who have already accessed today's workout
  if (!subscribed && hasAccessedToday && !isWorkoutStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SubscriptionGate feature="unlimited daily workouts">
            <div />
          </SubscriptionGate>
        </div>
      </div>
    );
  }

  const currentExercise = dailyWorkout.exercises[currentExerciseIndex];
  const workoutProgress = ((currentExerciseIndex + 1) / dailyWorkout.exercises.length) * 100;

  if (!isWorkoutStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Free User Notice */}
          {!subscribed && (
            <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Free Daily Workout</p>
                    <p className="text-sm text-muted-foreground">
                      {hasAccessedToday 
                        ? "You've used your free workout today. Upgrade for unlimited access!" 
                        : "Enjoy 1 free randomized workout per day. Upgrade for unlimited access!"
                      }
                    </p>
                  </div>
                  {!hasAccessedToday && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      FREE TODAY
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workout Overview */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🔥</div>
              <CardTitle className="text-3xl flex items-center justify-center gap-2">
                Today's Workout
                {subscribed && <Crown className="h-6 w-6 text-primary" />}
              </CardTitle>
              <CardDescription className="text-lg">
                {dailyWorkout.date} • {dailyWorkout.focus}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.round(dailyWorkout.totalDuration / 60)} min</div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{dailyWorkout.exercises.length}</div>
                  <p className="text-sm text-muted-foreground">Exercises</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{dailyWorkout.focus}</div>
                  <p className="text-sm text-muted-foreground">Focus</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {subscribed ? 'Premium' : 'Free'}
                  </div>
                  <p className="text-sm text-muted-foreground">Access</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleStartWorkout} 
                  className="flex items-center space-x-2"
                  disabled={!subscribed && hasAccessedToday}
                >
                  <Play className="h-5 w-5" />
                  <span>{!subscribed && hasAccessedToday ? 'Already Used Today' : 'Start Workout'}</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGenerateNewWorkout}
                  className="flex items-center space-x-2"
                  disabled={!subscribed}
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>{subscribed ? 'Generate New Workout' : 'Premium Feature'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Exercise Sequence</CardTitle>
              <CardDescription>Your randomized workout routine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{exercise.duration}s</span>
                        </span>
                        <span>{exercise.equipment.join(", ")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${
                              i < exercise.difficulty ? 'bg-orange-400' : 'bg-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Difficulty</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Workout In Progress View
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Workout in Progress</h1>
              <Badge variant="secondary">
                Exercise {currentExerciseIndex + 1} of {dailyWorkout.exercises.length}
              </Badge>
            </div>
            <Progress value={workoutProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(workoutProgress)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{currentExercise.name}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {currentExercise.duration}s • {currentExercise.equipment.join(", ")}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{formatTime(timeRemaining)}</div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Exercise Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <div className="space-y-2">
                {currentExercise.instructions.map((instruction, index) => (
                  <p key={index} className="text-muted-foreground">• {instruction}</p>
                ))}
              </div>
            </div>

            {/* Target Muscles */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Target Muscles:</h3>
              <div className="flex flex-wrap gap-2">
                {currentExercise.targetMuscles.map((muscle, index) => (
                  <Badge key={index} variant="outline">
                    <Target className="w-3 h-3 mr-1" />
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Exercise Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isPlaying ? "Pause" : "Resume"}</span>
              </Button>

              <Button
                size="lg"
                onClick={handleNextExercise}
                className="flex items-center space-x-2"
              >
                {currentExerciseIndex === dailyWorkout.exercises.length - 1 ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Complete Workout</span>
                  </>
                ) : (
                  <>
                    <SkipForward className="h-5 w-5" />
                    <span>Next Exercise</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exercises */}
        {currentExerciseIndex < dailyWorkout.exercises.length - 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Coming Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyWorkout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {currentExerciseIndex + index + 2}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{exercise.duration}s</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyWorkout;