import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type WorkoutRecommendation = Tables<'workout_recommendations'>;
export type Exercise = Tables<'exercises'>;

// All muscle groups in the system
const ALL_MUSCLE_GROUPS = [
  'Calves', 'Hamstrings', 'Quadriceps', 'Glutes', 'Hip Flexors',
  'Core', 'Lower Back', 'Upper Back', 'Chest', 'Shoulders',
  'Biceps', 'Triceps', 'Forearms', 'Neck', 'Ankles', 'Wrists'
];

// Recommended rest periods between training same muscle group (in days)
const MUSCLE_REST_DAYS: Record<string, number> = {
  'Calves': 1,
  'Hamstrings': 2,
  'Quadriceps': 2,
  'Glutes': 2,
  'Hip Flexors': 1,
  'Core': 1,
  'Lower Back': 2,
  'Upper Back': 2,
  'Chest': 2,
  'Shoulders': 2,
  'Biceps': 1,
  'Triceps': 1,
  'Forearms': 1,
  'Neck': 1,
  'Ankles': 1,
  'Wrists': 1,
};

interface RecommendationContext {
  lastWorkout: Tables<'workout_logs'> | null;
  recentWorkouts: Tables<'workout_logs'>[];
  daysSinceLastWorkout: number;
  muscleGroupsNeedingWork: string[];
  weeklyWorkoutCount: number;
  averageWorkoutsPerWeek: number;
}

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<WorkoutRecommendation | null>(null);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  const [context, setContext] = useState<RecommendationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current recommendation or generate new one
  const fetchRecommendation = useCallback(async () => {
    if (!user) {
      setRecommendation(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check for existing valid recommendation
      const { data: existing, error: fetchError } = await supabase
        .from('workout_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing && !fetchError) {
        setRecommendation(existing);
        await fetchRecommendedExercises(existing.recommended_exercise_ids);
        return;
      }

      // Generate new recommendation
      await generateRecommendation();
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendation');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch exercises for recommendation
  const fetchRecommendedExercises = async (exerciseIds: string[]): Promise<Exercise[]> => {
    if (!exerciseIds.length) {
      setRecommendedExercises([]);
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .in('id', exerciseIds);

      if (error) {
        console.error('Error fetching recommended exercises:', error);
        throw error;
      }

      const exercises = data || [];
      setRecommendedExercises(exercises);
      return exercises;
    } catch (err) {
      console.error('Error fetching recommended exercises:', err);
      setRecommendedExercises([]);
      return [];
    }
  };

  // Generate a new recommendation
  const generateRecommendation = async () => {
    if (!user) return;

    try {
      // Get recent workouts (last 14 days)
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const { data: recentWorkouts, error: workoutError } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', fourteenDaysAgo.toISOString())
        .order('logged_at', { ascending: false });

      if (workoutError) throw workoutError;

      // Analyze workout patterns
      const lastWorkout = recentWorkouts?.[0] || null;
      const daysSinceLastWorkout = lastWorkout
        ? Math.floor((Date.now() - new Date(lastWorkout.logged_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Determine which muscle groups need work
      const muscleGroupLastTrained: Record<string, Date> = {};

      recentWorkouts?.forEach(workout => {
        workout.muscle_groups_worked?.forEach(mg => {
          const workoutDate = new Date(workout.logged_at);
          if (!muscleGroupLastTrained[mg] || workoutDate > muscleGroupLastTrained[mg]) {
            muscleGroupLastTrained[mg] = workoutDate;
          }
        });
      });

      const now = new Date();
      const muscleGroupsNeedingWork = ALL_MUSCLE_GROUPS.filter(mg => {
        const lastTrained = muscleGroupLastTrained[mg];
        if (!lastTrained) return true; // Never trained

        const daysSince = Math.floor((now.getTime() - lastTrained.getTime()) / (1000 * 60 * 60 * 24));
        const restDays = MUSCLE_REST_DAYS[mg] || 2;
        return daysSince >= restDays;
      });

      // Calculate weekly workout patterns
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyWorkoutCount = recentWorkouts?.filter(w =>
        new Date(w.logged_at) >= oneWeekAgo
      ).length || 0;

      const averageWorkoutsPerWeek = recentWorkouts ? recentWorkouts.length / 2 : 0;

      setContext({
        lastWorkout,
        recentWorkouts: recentWorkouts || [],
        daysSinceLastWorkout,
        muscleGroupsNeedingWork,
        weeklyWorkoutCount,
        averageWorkoutsPerWeek,
      });

      // Get exercises that target needed muscle groups
      const { data: exercises, error: exerciseError } = await supabase
        .from('exercises')
        .select('*');

      if (exerciseError) throw exerciseError;

      // Score and rank exercises
      const scoredExercises = (exercises || []).map(exercise => {
        let score = 0;

        // Higher score for exercises targeting muscle groups that need work
        const targetsMusclesNeedingWork = exercise.muscle_groups?.filter(mg =>
          muscleGroupsNeedingWork.includes(mg)
        ).length || 0;
        score += targetsMusclesNeedingWork * 10;

        // Bonus for anti-sitting focused exercises
        if (exercise.categories?.includes('Anti-Sitting')) {
          score += 15;
        }

        // Bonus for mobility work if it's been a while since last workout
        if (daysSinceLastWorkout >= 3 && exercise.categories?.includes('Mobility')) {
          score += 10;
        }

        // Slight penalty for recently trained muscle groups
        const targetsRecentlyTrained = exercise.muscle_groups?.filter(mg =>
          muscleGroupLastTrained[mg] &&
          Math.floor((now.getTime() - muscleGroupLastTrained[mg].getTime()) / (1000 * 60 * 60 * 24)) < (MUSCLE_REST_DAYS[mg] || 2)
        ).length || 0;
        score -= targetsRecentlyTrained * 5;

        return { exercise, score };
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

      const recommendedExerciseIds = scoredExercises.map(e => e.exercise.id);
      setRecommendedExercises(scoredExercises.map(e => e.exercise));

      // Generate recommendation reason
      let reason = '';
      if (daysSinceLastWorkout >= 7) {
        reason = "It's been a while since your last workout. Let's ease back in with some mobility and anti-sitting exercises.";
      } else if (daysSinceLastWorkout >= 3) {
        reason = "Time to get back to it! These exercises will help maintain your progress.";
      } else if (muscleGroupsNeedingWork.length > 5) {
        reason = `Focus on ${muscleGroupsNeedingWork.slice(0, 3).join(', ')} today - they haven't been trained recently.`;
      } else {
        reason = "Based on your recent activity, here are exercises to keep you balanced and progressing.";
      }

      // Save recommendation
      const { data: newRec, error: insertError } = await supabase
        .from('workout_recommendations')
        .insert({
          user_id: user.id,
          recommended_exercise_ids: recommendedExerciseIds,
          recommendation_reason: reason,
          last_workout_id: lastWorkout?.id,
          days_since_last_workout: daysSinceLastWorkout,
          muscle_groups_needing_work: muscleGroupsNeedingWork,
          status: 'pending',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setRecommendation(newRec);
    } catch (err) {
      console.error('Error generating recommendation:', err);
      throw err;
    }
  };

  // Accept recommendation (start workout)
  const acceptRecommendation = async () => {
    if (!recommendation || !user) return;

    try {
      const { error } = await supabase
        .from('workout_recommendations')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString(),
        })
        .eq('id', recommendation.id);

      if (error) throw error;

      return { accepted: true, exercises: recommendedExercises };
    } catch (err) {
      console.error('Error accepting recommendation:', err);
      throw err;
    }
  };

  // Dismiss recommendation
  const dismissRecommendation = async () => {
    if (!recommendation || !user) return;

    try {
      const { error } = await supabase
        .from('workout_recommendations')
        .update({
          status: 'dismissed',
          responded_at: new Date().toISOString(),
        })
        .eq('id', recommendation.id);

      if (error) throw error;

      // Generate a new recommendation
      setRecommendation(null);
      await generateRecommendation();
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      throw err;
    }
  };

  // Get quick workout suggestion based on time available
  const getQuickWorkout = async (minutes: number) => {
    if (!user) return null;

    const exerciseDurations: Record<string, number> = {
      'short': 5,
      'medium': 10,
      'long': 15,
    };

    // Filter exercises that fit in time
    const suitableExercises = recommendedExercises.filter(e => {
      const duration = e.duration ? parseInt(e.duration) : 10;
      return duration <= minutes / 3; // Allow for 3 exercises
    }).slice(0, Math.floor(minutes / 5));

    return suitableExercises;
  };

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  return {
    recommendation,
    recommendedExercises,
    context,
    loading,
    error,
    acceptRecommendation,
    dismissRecommendation,
    getQuickWorkout,
    regenerate: generateRecommendation,
    refetch: fetchRecommendation,
  };
};
