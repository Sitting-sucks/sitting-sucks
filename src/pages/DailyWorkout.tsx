import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Clock, 
  Target,
  Zap,
  CheckCircle2
} from "lucide-react";

const DailyWorkout = () => {
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  // Mock daily workout - randomized full body protocol
  const todaysWorkout = {
    name: "Full Body Anti-Sitting Protocol",
    date: new Date().toLocaleDateString(),
    totalDuration: "25 minutes",
    totalExercises: 8,
    focusAreas: ["Hip Flexors", "Thoracic Spine", "Glutes", "Shoulders"],
    exercises: [
      {
        name: "Hip Flexor Stretch",
        duration: "2 minutes",
        equipment: ["Heel Wedges"],
        jointMovements: ["Hip Flexion", "Hip Extension"],
        difficulty: 2,
        intensity: 3,
        instructions: "Place heel wedges under front foot, step into deep lunge position...",
        restAfter: "30 seconds"
      },
      {
        name: "Thoracic Extension",
        duration: "3 minutes", 
        equipment: ["Foam Roller"],
        jointMovements: ["Thoracic Extension"],
        difficulty: 3,
        intensity: 2,
        instructions: "Place foam roller horizontally under shoulder blades...",
        restAfter: "45 seconds"
      },
      {
        name: "Glute Activation",
        duration: "3 minutes",
        equipment: ["Yellow Perform Better Band"],
        jointMovements: ["Hip Abduction", "Hip Extension"],
        difficulty: 2,
        intensity: 4,
        instructions: "Wrap band around legs just above knees...",
        restAfter: "1 minute"
      },
      // Add more exercises as needed
    ]
  };

  const currentExercise = todaysWorkout.exercises[currentExerciseIndex];
  const workoutProgress = ((currentExerciseIndex + 1) / todaysWorkout.exercises.length) * 100;

  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setIsPlaying(true);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < todaysWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimeRemaining(300); // Reset timer
    }
  };

  const handleGenerateNewWorkout = () => {
    // This would call an API to generate a new randomized workout
    setCurrentExerciseIndex(0);
    setIsWorkoutStarted(false);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isWorkoutStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Workout Overview */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🔥</div>
              <CardTitle className="text-3xl">{todaysWorkout.name}</CardTitle>
              <CardDescription className="text-lg">
                {todaysWorkout.date} • Randomized Full Body Protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{todaysWorkout.totalDuration}</div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{todaysWorkout.totalExercises}</div>
                  <p className="text-sm text-muted-foreground">Exercises</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Full Body</div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Random</div>
                  <p className="text-sm text-muted-foreground">Selection</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Today's Focus Areas:</h3>
                <div className="flex flex-wrap gap-2">
                  {todaysWorkout.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleStartWorkout} className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Start Workout</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGenerateNewWorkout}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Generate New Workout</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Exercise Sequence</CardTitle>
              <CardDescription>Your randomized anti-sitting protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{exercise.duration}</span>
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
                Exercise {currentExerciseIndex + 1} of {todaysWorkout.exercises.length}
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
                  {currentExercise.duration} • {currentExercise.equipment.join(", ")}
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
              <p className="text-muted-foreground">{currentExercise.instructions}</p>
            </div>

            {/* Joint Movements */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Joint Movements:</h3>
              <div className="flex flex-wrap gap-2">
                {currentExercise.jointMovements.map((movement, index) => (
                  <Badge key={index} variant="outline">
                    {movement}
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
                disabled={currentExerciseIndex === todaysWorkout.exercises.length - 1}
                className="flex items-center space-x-2"
              >
                {currentExerciseIndex === todaysWorkout.exercises.length - 1 ? (
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

            {/* Rest Period Info */}
            {currentExercise.restAfter && (
              <div className="mt-4 p-4 bg-accent/50 rounded-lg text-center">
                <p className="text-sm">
                  <strong>Rest after this exercise:</strong> {currentExercise.restAfter}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exercises */}
        {currentExerciseIndex < todaysWorkout.exercises.length - 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Coming Up Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysWorkout.exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {currentExerciseIndex + index + 2}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{exercise.duration}</p>
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