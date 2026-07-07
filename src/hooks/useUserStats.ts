import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

export type UserStats = Tables<'user_stats'>;
export type PersonalRecord = Tables<'personal_records'>;
export type UserAchievement = Tables<'user_achievements'>;
export type WorkoutLog = Tables<'workout_logs'>;

// Achievement definitions
export const ACHIEVEMENTS = {
  // Workout milestones
  first_workout: { name: 'First Step', description: 'Complete your first workout', icon: '1', tier: 'bronze', points: 25 },
  workout_10: { name: 'Getting Started', description: 'Complete 10 workouts', icon: '1', tier: 'bronze', points: 50 },
  workout_25: { name: 'Building Momentum', description: 'Complete 25 workouts', icon: '2', tier: 'silver', points: 100 },
  workout_50: { name: 'Dedicated', description: 'Complete 50 workouts', icon: '3', tier: 'gold', points: 200 },
  workout_100: { name: 'Century Club', description: 'Complete 100 workouts', icon: '4', tier: 'platinum', points: 500 },
  workout_250: { name: 'Iron Will', description: 'Complete 250 workouts', icon: '5', tier: 'platinum', points: 1000 },

  // Streak achievements
  streak_7: { name: 'Week Warrior', description: '7-day login streak', icon: '6', tier: 'bronze', points: 50 },
  streak_14: { name: 'Two Week Terror', description: '14-day login streak', icon: '7', tier: 'silver', points: 100 },
  streak_30: { name: 'Monthly Master', description: '30-day login streak', icon: '8', tier: 'gold', points: 250 },
  streak_60: { name: 'Consistency King', description: '60-day login streak', icon: '9', tier: 'gold', points: 500 },
  streak_100: { name: 'Unstoppable', description: '100-day login streak', icon: '1', tier: 'platinum', points: 1000 },

  // Volume achievements
  weight_1000: { name: 'Ton Lifter', description: 'Lift 1,000 lbs total', icon: '2', tier: 'bronze', points: 50 },
  weight_10000: { name: 'Heavy Hitter', description: 'Lift 10,000 lbs total', icon: '3', tier: 'silver', points: 100 },
  weight_50000: { name: 'Iron Giant', description: 'Lift 50,000 lbs total', icon: '4', tier: 'gold', points: 250 },
  weight_100000: { name: 'Legendary Lifter', description: 'Lift 100,000 lbs total', icon: '5', tier: 'platinum', points: 500 },

  // Time achievements
  time_60: { name: 'Hour Power', description: 'Exercise for 60 minutes total', icon: '6', tier: 'bronze', points: 25 },
  time_300: { name: 'Five Hour Fighter', description: 'Exercise for 5 hours total', icon: '7', tier: 'silver', points: 75 },
  time_1000: { name: 'Time Titan', description: 'Exercise for 1,000 minutes total', icon: '8', tier: 'gold', points: 200 },
} as const;

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing stats
      const { data, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setStats(data);
      } else {
        // Create new stats record for user
        const { data: newData, error: insertError } = await supabase
          .from('user_stats')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setStats(newData);
      }
    } catch (err) {
      logger.error('Error fetching stats', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPersonalRecords = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setPersonalRecords(data || []);
    } catch (err) {
      logger.error('Error fetching PRs', err);
    }
  }, [user]);

  const fetchAchievements = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (err) {
      logger.error('Error fetching achievements', err);
    }
  }, [user]);

  const fetchRecentWorkouts = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentWorkouts(data || []);
    } catch (err) {
      logger.error('Error fetching recent workouts', err);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
    fetchPersonalRecords();
    fetchAchievements();
    fetchRecentWorkouts();
  }, [fetchStats, fetchPersonalRecords, fetchAchievements, fetchRecentWorkouts]);

  // Update stats when logging a workout
  const updateStatsOnWorkout = async (workoutData: {
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
    muscleGroups?: string[];
    exerciseId?: string;
  }) => {
    if (!user || !stats) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = getWeekStart(now);
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const volume = (workoutData.weight || 0) * (workoutData.reps || 0) * (workoutData.sets || 1);

    // Check if we need to reset weekly/monthly stats
    const needsWeekReset = !stats.week_start_date || stats.week_start_date !== weekStart;
    const needsMonthReset = !stats.month_start_date || stats.month_start_date !== monthStart;

    const updatedMuscleGroups = { ...((stats.muscle_group_counts as Record<string, number> | null) || {}) };
    const updatedExerciseCounts = { ...((stats.exercise_counts as Record<string, number> | null) || {}) };

    workoutData.muscleGroups?.forEach(mg => {
      updatedMuscleGroups[mg] = (updatedMuscleGroups[mg] || 0) + 1;
    });

    if (workoutData.exerciseId) {
      updatedExerciseCounts[workoutData.exerciseId] = (updatedExerciseCounts[workoutData.exerciseId] || 0) + 1;
    }

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          total_workouts: stats.total_workouts + 1,
          total_sets: stats.total_sets + (workoutData.sets || 0),
          total_reps: stats.total_reps + (workoutData.reps || 0),
          total_weight_lifted: stats.total_weight_lifted + volume,
          total_duration_minutes: stats.total_duration_minutes + (workoutData.duration || 0),
          weekly_workouts: needsWeekReset ? 1 : stats.weekly_workouts + 1,
          weekly_sets: needsWeekReset ? (workoutData.sets || 0) : stats.weekly_sets + (workoutData.sets || 0),
          weekly_reps: needsWeekReset ? (workoutData.reps || 0) : stats.weekly_reps + (workoutData.reps || 0),
          weekly_weight: needsWeekReset ? volume : stats.weekly_weight + volume,
          weekly_duration_minutes: needsWeekReset ? (workoutData.duration || 0) : stats.weekly_duration_minutes + (workoutData.duration || 0),
          week_start_date: weekStart,
          monthly_workouts: needsMonthReset ? 1 : stats.monthly_workouts + 1,
          monthly_sets: needsMonthReset ? (workoutData.sets || 0) : stats.monthly_sets + (workoutData.sets || 0),
          monthly_reps: needsMonthReset ? (workoutData.reps || 0) : stats.monthly_reps + (workoutData.reps || 0),
          monthly_weight: needsMonthReset ? volume : stats.monthly_weight + volume,
          monthly_duration_minutes: needsMonthReset ? (workoutData.duration || 0) : stats.monthly_duration_minutes + (workoutData.duration || 0),
          month_start_date: monthStart,
          muscle_group_counts: updatedMuscleGroups,
          exercise_counts: updatedExerciseCounts,
          updated_at: now.toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setStats(data);

      // Check for new achievements - use try/catch to not fail the main operation
      try {
        await checkAndAwardAchievements(data);
      } catch (achievementError) {
        logger.error('Error checking achievements', achievementError);
        // Don't throw - achievement check failing shouldn't fail the workout update
      }

      return data;
    } catch (err) {
      logger.error('Error updating stats', err);
      throw err;
    }
  };

  // Check and award achievements
  const checkAndAwardAchievements = async (currentStats: UserStats) => {
    if (!user) return;

    const achievementsToCheck = [
      // Workout milestones
      { type: 'first_workout', condition: currentStats.total_workouts >= 1 },
      { type: 'workout_10', condition: currentStats.total_workouts >= 10 },
      { type: 'workout_25', condition: currentStats.total_workouts >= 25 },
      { type: 'workout_50', condition: currentStats.total_workouts >= 50 },
      { type: 'workout_100', condition: currentStats.total_workouts >= 100 },
      { type: 'workout_250', condition: currentStats.total_workouts >= 250 },
      // Weight milestones
      { type: 'weight_1000', condition: currentStats.total_weight_lifted >= 1000 },
      { type: 'weight_10000', condition: currentStats.total_weight_lifted >= 10000 },
      { type: 'weight_50000', condition: currentStats.total_weight_lifted >= 50000 },
      { type: 'weight_100000', condition: currentStats.total_weight_lifted >= 100000 },
      // Time milestones
      { type: 'time_60', condition: currentStats.total_duration_minutes >= 60 },
      { type: 'time_300', condition: currentStats.total_duration_minutes >= 300 },
      { type: 'time_1000', condition: currentStats.total_duration_minutes >= 1000 },
    ];

    const earnedTypes = achievements.map(a => a.achievement_type);

    for (const check of achievementsToCheck) {
      if (check.condition && !earnedTypes.includes(check.type)) {
        const achievementDef = ACHIEVEMENTS[check.type as keyof typeof ACHIEVEMENTS];
        if (achievementDef) {
          await awardAchievement(check.type, achievementDef);
        }
      }
    }
  };

  // Award a specific achievement
  const awardAchievement = async (type: string, definition: typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_name: definition.name,
          achievement_description: definition.description,
          achievement_icon: definition.icon,
          tier: definition.tier,
          points_awarded: definition.points,
        })
        .select()
        .single();

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error;
      }

      if (data) {
        setAchievements(prev => [data, ...prev]);
        return { achievement: data, isNew: true };
      }
    } catch (err) {
      logger.error('Error awarding achievement', err);
    }
    return null;
  };

  // Update or create personal record
  const updatePersonalRecord = async (exerciseId: string, data: {
    weight?: number;
    reps?: number;
    volume?: number;
    totalVolume?: number;
  }) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const existingPR = personalRecords.find(pr => pr.exercise_id === exerciseId);

    const updates: Partial<PersonalRecord> & { updated_at: string } = { updated_at: new Date().toISOString() };
    let hasNewPR = false;

    if (data.weight && (!existingPR?.max_weight || data.weight > existingPR.max_weight)) {
      updates.max_weight = data.weight;
      updates.max_weight_date = today;
      hasNewPR = true;
    }

    if (data.reps && (!existingPR?.max_reps || data.reps > existingPR.max_reps)) {
      updates.max_reps = data.reps;
      updates.max_reps_date = today;
      hasNewPR = true;
    }

    if (data.volume && (!existingPR?.max_volume || data.volume > existingPR.max_volume)) {
      updates.max_volume = data.volume;
      updates.max_volume_date = today;
      hasNewPR = true;
    }

    if (data.totalVolume && (!existingPR?.max_total_volume || data.totalVolume > existingPR.max_total_volume)) {
      updates.max_total_volume = data.totalVolume;
      updates.max_total_volume_date = today;
      hasNewPR = true;
    }

    if (!hasNewPR) return null;

    try {
      if (existingPR) {
        const { data: updatedPR, error } = await supabase
          .from('personal_records')
          .update(updates)
          .eq('id', existingPR.id)
          .select()
          .single();

        if (error) throw error;
        setPersonalRecords(prev => prev.map(pr => pr.id === existingPR.id ? updatedPR : pr));
        return { record: updatedPR, isNew: true };
      } else {
        const { data: newPR, error } = await supabase
          .from('personal_records')
          .insert({
            user_id: user.id,
            exercise_id: exerciseId,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        setPersonalRecords(prev => [...prev, newPR]);
        return { record: newPR, isNew: true };
      }
    } catch (err) {
      logger.error('Error updating PR', err);
      throw err;
    }
  };

  // Get stats for a specific time period
  const getStatsByPeriod = (period: 'week' | 'month' | 'year' | 'all') => {
    if (!stats) return null;

    switch (period) {
      case 'week':
        return {
          workouts: stats.weekly_workouts,
          sets: stats.weekly_sets,
          reps: stats.weekly_reps,
          weight: stats.weekly_weight,
          duration: stats.weekly_duration_minutes,
        };
      case 'month':
        return {
          workouts: stats.monthly_workouts,
          sets: stats.monthly_sets,
          reps: stats.monthly_reps,
          weight: stats.monthly_weight,
          duration: stats.monthly_duration_minutes,
        };
      case 'all':
      default:
        return {
          workouts: stats.total_workouts,
          sets: stats.total_sets,
          reps: stats.total_reps,
          weight: stats.total_weight_lifted,
          duration: stats.total_duration_minutes,
        };
    }
  };

  // Get top muscle groups
  const getTopMuscleGroups = (limit = 5) => {
    if (!stats?.muscle_group_counts) return [];

    return Object.entries(stats.muscle_group_counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  };

  // Get top exercises
  const getTopExercises = (limit = 5) => {
    if (!stats?.exercise_counts) return [];

    return Object.entries(stats.exercise_counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  };

  return {
    stats,
    personalRecords,
    achievements,
    recentWorkouts,
    loading,
    error,
    updateStatsOnWorkout,
    updatePersonalRecord,
    awardAchievement,
    getStatsByPeriod,
    getTopMuscleGroups,
    getTopExercises,
    refetch: fetchStats,
    refetchAchievements: fetchAchievements,
    refetchPRs: fetchPersonalRecords,
  };
};

// Helper function to get week start date (Monday)
function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}
