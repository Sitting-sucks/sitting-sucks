import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  name: string;
  description: string;
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  difficulty: number;
  intensity: number;
  instructions: string[];
}

interface DailyWorkout {
  id: string;
  exercises: Exercise[];
  focus: string;
  totalDuration: number;
  date: string;
}

const exercisePool: Exercise[] = [
  {
    name: "Push-ups",
    description: "Classic upper body exercise targeting chest, shoulders, and triceps",
    duration: 45,
    equipment: ["None"],
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    difficulty: 2,
    intensity: 3,
    instructions: [
      "Start in plank position with hands slightly wider than shoulders",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your core tight throughout the movement"
    ]
  },
  {
    name: "Squats",
    description: "Fundamental lower body exercise for legs and glutes",
    duration: 60,
    equipment: ["None"],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    difficulty: 2,
    intensity: 3,
    instructions: [
      "Stand with feet hip-width apart",
      "Lower down as if sitting back into a chair",
      "Keep chest up and knees tracking over toes",
      "Return to standing position"
    ]
  },
  {
    name: "Plank",
    description: "Core strengthening exercise that engages the entire body",
    duration: 30,
    equipment: ["None"],
    targetMuscles: ["Core", "Shoulders"],
    difficulty: 2,
    intensity: 2,
    instructions: [
      "Start in forearm plank position",
      "Keep body in straight line from head to heels",
      "Engage core and breathe steadily",
      "Hold the position for the duration"
    ]
  },
  {
    name: "Lunges",
    description: "Single-leg exercise for lower body strength and stability",
    duration: 45,
    equipment: ["None"],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    difficulty: 3,
    intensity: 3,
    instructions: [
      "Step forward into a lunge position",
      "Lower back knee toward the ground",
      "Keep front knee over ankle",
      "Push through front heel to return to start"
    ]
  }
];

const generateRandomWorkout = (date: string): DailyWorkout => {
  // Use date as seed for consistent daily workouts
  const seed = new Date(date).getDate();
  const shuffledExercises = [...exercisePool].sort(() => (seed % 2) - 0.5);
  
  // Select 4 exercises for the daily workout
  const selectedExercises = shuffledExercises.slice(0, 4);
  const totalDuration = selectedExercises.reduce((sum, exercise) => sum + exercise.duration, 0);
  
  const focusAreas = ["Full Body", "Upper Body", "Lower Body", "Core & Cardio"];
  const focus = focusAreas[seed % focusAreas.length];

  return {
    id: `daily-${date}`,
    exercises: selectedExercises,
    focus,
    totalDuration,
    date,
  };
};

export const useDailyWorkout = () => {
  const { user } = useAuth();
  const [dailyWorkout, setDailyWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccessedToday, setHasAccessedToday] = useState(false);

  const getTodaysWorkout = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Check if user has already accessed today's workout
      const { data: existingWorkout, error } = await supabase
        .from('daily_workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('workout_date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily workout:', error);
        return;
      }

      if (existingWorkout) {
        setDailyWorkout(existingWorkout.workout_data as unknown as DailyWorkout);
        setHasAccessedToday(true);
      } else {
        // Generate new workout for today
        const newWorkout = generateRandomWorkout(today);
        setDailyWorkout(newWorkout);
        setHasAccessedToday(false);
      }
    } catch (error) {
      console.error('Error getting today\'s workout:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveDailyWorkoutAccess = useCallback(async () => {
    if (!user || !dailyWorkout || hasAccessedToday) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('daily_workouts')
        .insert({
          user_id: user.id,
          workout_date: today,
          workout_data: dailyWorkout as unknown as any,
        });

      if (error) {
        console.error('Error saving daily workout access:', error);
      } else {
        setHasAccessedToday(true);
      }
    } catch (error) {
      console.error('Error saving daily workout access:', error);
    }
  }, [user, dailyWorkout, hasAccessedToday]);

  useEffect(() => {
    getTodaysWorkout();
  }, [getTodaysWorkout]);

  return {
    dailyWorkout,
    loading,
    hasAccessedToday,
    saveDailyWorkoutAccess,
    refreshWorkout: getTodaysWorkout,
  };
};