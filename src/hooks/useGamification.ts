import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

export type UserGamification = Tables<'user_gamification'>;
export type PointHistory = Tables<'point_history'>;

// Streak achievement definitions (matching useUserStats ACHIEVEMENTS)
const STREAK_ACHIEVEMENTS = {
  streak_7: { name: 'Week Warrior', description: '7-day login streak', icon: '6', tier: 'bronze', points: 50 },
  streak_14: { name: 'Two Week Terror', description: '14-day login streak', icon: '7', tier: 'silver', points: 100 },
  streak_30: { name: 'Monthly Master', description: '30-day login streak', icon: '8', tier: 'gold', points: 250 },
  streak_60: { name: 'Consistency King', description: '60-day login streak', icon: '9', tier: 'gold', points: 500 },
  streak_100: { name: 'Unstoppable', description: '100-day login streak', icon: '1', tier: 'platinum', points: 1000 },
} as const;

// Point values for different actions
export const POINT_VALUES = {
  DAILY_SIGN_IN: 10,
  STREAK_BONUS_3: 25,
  STREAK_BONUS_7: 50,
  STREAK_BONUS_14: 100,
  STREAK_BONUS_30: 250,
  WORKOUT_COMPLETED: 50,
  EXERCISE_LOGGED: 5,
};

// Level thresholds
export const LEVELS = [
  { level: 1, name: "Beginner", minPoints: 0, maxPoints: 99 },
  { level: 2, name: "Novice", minPoints: 100, maxPoints: 299 },
  { level: 3, name: "Intermediate", minPoints: 300, maxPoints: 599 },
  { level: 4, name: "Advanced", minPoints: 600, maxPoints: 999 },
  { level: 5, name: "Expert", minPoints: 1000, maxPoints: 1999 },
  { level: 6, name: "Master", minPoints: 2000, maxPoints: 3499 },
  { level: 7, name: "Elite", minPoints: 3500, maxPoints: 5499 },
  { level: 8, name: "Champion", minPoints: 5500, maxPoints: 7999 },
  { level: 9, name: "Legend", minPoints: 8000, maxPoints: 11999 },
  { level: 10, name: "Titan", minPoints: 12000, maxPoints: Infinity },
];

export const getLevelInfo = (points: number) => {
  return LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
};

export const getNextLevelInfo = (currentLevel: number) => {
  return LEVELS.find(l => l.level === currentLevel + 1);
};

export const useGamification = () => {
  const { user } = useAuth();
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGamification = useCallback(async () => {
    if (!user) {
      setGamification(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing gamification data
      const { data, error: fetchError } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is expected for new users
        throw fetchError;
      }

      if (data) {
        setGamification(data);
      } else {
        // Create new gamification record for user
        const { data: newData, error: insertError } = await supabase
          .from('user_gamification')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setGamification(newData);
      }
    } catch (err) {
      logger.error('Error fetching gamification', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gamification data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPointHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('point_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPointHistory(data || []);
    } catch (err) {
      logger.error('Error fetching point history', err);
    }
  }, [user]);

  useEffect(() => {
    fetchGamification();
    fetchPointHistory();
  }, [fetchGamification, fetchPointHistory]);

  // Award points to user
  const awardPoints = async (points: number, reason: string) => {
    if (!user || !gamification) return;

    try {
      // Insert point history
      await supabase.from('point_history').insert({
        user_id: user.id,
        points,
        reason,
      });

      // Calculate new level
      const newTotalPoints = gamification.total_points + points;
      const newLevelInfo = getLevelInfo(newTotalPoints);

      // Update gamification data
      const { data, error } = await supabase
        .from('user_gamification')
        .update({
          total_points: newTotalPoints,
          current_level: newLevelInfo.level,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamification(data);

      // Await the refetch to avoid race conditions
      await fetchPointHistory();

      return { points, reason, newTotal: newTotalPoints, levelUp: newLevelInfo.level > gamification.current_level };
    } catch (err) {
      logger.error('Error awarding points', err);
      throw err;
    }
  };

  // Check and process daily sign-in
  const processSignIn = async () => {
    if (!user || !gamification) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastSignIn = gamification.last_sign_in_date;

    // Already signed in today
    if (lastSignIn === today) {
      return null;
    }

    try {
      let newStreak = 1;
      let bonusPoints = 0;
      let bonusReason = '';

      // Check if this continues a streak
      if (lastSignIn) {
        const lastDate = new Date(lastSignIn);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day!
          newStreak = gamification.current_streak + 1;

          // Check for streak bonuses
          if (newStreak === 3) {
            bonusPoints = POINT_VALUES.STREAK_BONUS_3;
            bonusReason = '3-day streak bonus!';
          } else if (newStreak === 7) {
            bonusPoints = POINT_VALUES.STREAK_BONUS_7;
            bonusReason = '7-day streak bonus!';
          } else if (newStreak === 14) {
            bonusPoints = POINT_VALUES.STREAK_BONUS_14;
            bonusReason = '14-day streak bonus!';
          } else if (newStreak === 30) {
            bonusPoints = POINT_VALUES.STREAK_BONUS_30;
            bonusReason = '30-day streak bonus!';
          }
        }
        // If more than 1 day gap, streak resets to 1
      }

      const longestStreak = Math.max(gamification.longest_streak, newStreak);
      const totalPointsToAward = POINT_VALUES.DAILY_SIGN_IN + bonusPoints;
      const newTotalPoints = gamification.total_points + totalPointsToAward;
      const newLevelInfo = getLevelInfo(newTotalPoints);

      // Insert point history for daily sign-in
      await supabase.from('point_history').insert({
        user_id: user.id,
        points: POINT_VALUES.DAILY_SIGN_IN,
        reason: 'Daily sign-in',
      });

      // Insert bonus points if applicable
      if (bonusPoints > 0) {
        await supabase.from('point_history').insert({
          user_id: user.id,
          points: bonusPoints,
          reason: bonusReason,
        });
      }

      // Update gamification data
      const { data, error } = await supabase
        .from('user_gamification')
        .update({
          total_points: newTotalPoints,
          current_level: newLevelInfo.level,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_sign_in_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamification(data);

      // Await the refetch to avoid race conditions
      await fetchPointHistory();

      // Check and award streak achievements
      await checkStreakAchievements(newStreak);

      return {
        dailyPoints: POINT_VALUES.DAILY_SIGN_IN,
        bonusPoints,
        bonusReason,
        newStreak,
        levelUp: newLevelInfo.level > gamification.current_level,
        newLevel: newLevelInfo,
      };
    } catch (err) {
      logger.error('Error processing sign-in', err);
      return null;
    }
  };

  // Check and award streak achievements
  const checkStreakAchievements = async (currentStreak: number) => {
    if (!user) return;

    const streakMilestones = [
      { type: 'streak_7', threshold: 7 },
      { type: 'streak_14', threshold: 14 },
      { type: 'streak_30', threshold: 30 },
      { type: 'streak_60', threshold: 60 },
      { type: 'streak_100', threshold: 100 },
    ];

    for (const milestone of streakMilestones) {
      if (currentStreak >= milestone.threshold) {
        const achievementDef = STREAK_ACHIEVEMENTS[milestone.type as keyof typeof STREAK_ACHIEVEMENTS];

        try {
          // Try to insert - will fail silently if already exists (unique constraint)
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_type: milestone.type,
              achievement_name: achievementDef.name,
              achievement_description: achievementDef.description,
              achievement_icon: achievementDef.icon,
              tier: achievementDef.tier,
              points_awarded: achievementDef.points,
            });

          // 23505 is duplicate key error - expected if already earned
          if (error && error.code !== '23505') {
            logger.error(`Error awarding streak achievement ${milestone.type}`, error);
          }
        } catch (err) {
          logger.error(`Error checking streak achievement ${milestone.type}`, err);
        }
      }
    }
  };

  // Award points for completing a workout
  const awardWorkoutPoints = async () => {
    if (!user || !gamification) return;

    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .update({
          workouts_completed: gamification.workouts_completed + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamification(data);

      return await awardPoints(POINT_VALUES.WORKOUT_COMPLETED, 'Workout completed');
    } catch (err) {
      console.error('Error awarding workout points:', err);
    }
  };

  // Award points for logging an exercise
  const awardExerciseLogPoints = async () => {
    if (!user || !gamification) return;

    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .update({
          exercises_logged: gamification.exercises_logged + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamification(data);

      return await awardPoints(POINT_VALUES.EXERCISE_LOGGED, 'Exercise logged');
    } catch (err) {
      console.error('Error awarding exercise log points:', err);
    }
  };

  const levelInfo = gamification ? getLevelInfo(gamification.total_points) : LEVELS[0];
  const nextLevelInfo = getNextLevelInfo(levelInfo.level);
  const progressToNextLevel = nextLevelInfo
    ? ((gamification?.total_points || 0) - levelInfo.minPoints) / (nextLevelInfo.minPoints - levelInfo.minPoints) * 100
    : 100;

  return {
    gamification,
    pointHistory,
    loading,
    error,
    levelInfo,
    nextLevelInfo,
    progressToNextLevel,
    awardPoints,
    processSignIn,
    awardWorkoutPoints,
    awardExerciseLogPoints,
    refetch: fetchGamification,
  };
};
