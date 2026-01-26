import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

export type Exercise = Tables<'exercises'>;
export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

interface UseExercisesOptions {
  searchQuery?: string;
  equipment?: string[];
  jointMovements?: string[];
  difficulty?: string;
  intensity?: string;
  categories?: string[];
}

export const useExercises = (options: UseExercisesOptions = {}) => {
  // Memoize options to prevent infinite loops from object reference changes
  const memoizedOptions = useMemo(() => ({
    searchQuery: options.searchQuery,
    equipment: options.equipment,
    jointMovements: options.jointMovements,
    difficulty: options.difficulty,
    intensity: options.intensity,
    categories: options.categories,
  }), [
    options.searchQuery,
    // Stringify arrays to create stable dependency values
    JSON.stringify(options.equipment),
    JSON.stringify(options.jointMovements),
    options.difficulty,
    options.intensity,
    JSON.stringify(options.categories),
  ]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('exercises')
        .select('*')
        .order('name');

      // Apply search filter
      if (memoizedOptions.searchQuery) {
        query = query.or(`name.ilike.%${memoizedOptions.searchQuery}%,description.ilike.%${memoizedOptions.searchQuery}%`);
      }

      // Apply difficulty filter
      if (memoizedOptions.difficulty) {
        query = query.eq('difficulty', memoizedOptions.difficulty);
      }

      // Apply intensity filter
      if (memoizedOptions.intensity) {
        query = query.eq('intensity', memoizedOptions.intensity);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      let filteredData = data || [];

      // Apply equipment filter (array overlap)
      if (memoizedOptions.equipment && memoizedOptions.equipment.length > 0) {
        filteredData = filteredData.filter(exercise =>
          memoizedOptions.equipment!.some(eq => exercise.equipment.includes(eq))
        );
      }

      // Apply joint movements filter (array overlap)
      if (memoizedOptions.jointMovements && memoizedOptions.jointMovements.length > 0) {
        filteredData = filteredData.filter(exercise =>
          memoizedOptions.jointMovements!.some(jm => exercise.joint_movements.includes(jm))
        );
      }

      // Apply categories filter (array overlap)
      if (memoizedOptions.categories && memoizedOptions.categories.length > 0) {
        filteredData = filteredData.filter(exercise =>
          memoizedOptions.categories!.some(cat => exercise.categories.includes(cat))
        );
      }

      setExercises(filteredData);
    } catch (err) {
      logger.error('Error fetching exercises', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  }, [memoizedOptions]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = async (exercise: ExerciseInsert) => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert(exercise)
        .select()
        .single();

      if (error) throw error;

      // Refresh the list
      await fetchExercises();
      return data;
    } catch (err) {
      logger.error('Error creating exercise', err);
      throw err;
    }
  };

  const updateExercise = async (id: string, updates: ExerciseUpdate) => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Refresh the list
      await fetchExercises();
      return data;
    } catch (err) {
      logger.error('Error updating exercise', err);
      throw err;
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh the list
      await fetchExercises();
    } catch (err) {
      logger.error('Error deleting exercise', err);
      throw err;
    }
  };

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
  };
};

// Hook to get a single exercise by ID
export const useExercise = (id: string | null) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track if the effect is still mounted
    let isMounted = true;

    if (!id) {
      setExercise(null);
      setLoading(false);
      return;
    }

    const fetchExercise = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', id)
          .single();

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (fetchError) throw fetchError;
        setExercise(data);
      } catch (err) {
        // Only update state if component is still mounted
        if (!isMounted) return;

        logger.error('Error fetching exercise', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExercise();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { exercise, loading, error };
};
