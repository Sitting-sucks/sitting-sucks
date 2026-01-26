import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Program = Tables<'programs'>;
export type ProgramInsert = TablesInsert<'programs'>;
export type ProgramUpdate = TablesUpdate<'programs'>;

export type ProgramExercise = Tables<'program_exercises'>;
export type ProgramExerciseInsert = TablesInsert<'program_exercises'>;

export type ClientProgram = Tables<'client_programs'>;

// Extended program type with exercises
export interface ProgramWithExercises extends Program {
  program_exercises: (ProgramExercise & {
    exercises: Tables<'exercises'> | null;
  })[];
}

export const usePrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPrograms();
    }
  }, [user, fetchPrograms]);

  const createProgram = async (program: ProgramInsert) => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .insert({ ...program, trainer_id: user?.id })
        .select()
        .single();

      if (error) throw error;

      await fetchPrograms();
      return data;
    } catch (err) {
      console.error('Error creating program:', err);
      throw err;
    }
  };

  const updateProgram = async (id: string, updates: ProgramUpdate) => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPrograms();
      return data;
    } catch (err) {
      console.error('Error updating program:', err);
      throw err;
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPrograms();
    } catch (err) {
      console.error('Error deleting program:', err);
      throw err;
    }
  };

  // Add exercises to a program
  const addExerciseToProgram = async (
    programId: string,
    exerciseId: string,
    dayNumber: number = 1,
    orderIndex: number = 0,
    sets?: number,
    reps?: string,
    notes?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('program_exercises')
        .insert({
          program_id: programId,
          exercise_id: exerciseId,
          day_number: dayNumber,
          order_index: orderIndex,
          sets,
          reps,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding exercise to program:', err);
      throw err;
    }
  };

  // Remove exercise from a program
  const removeExerciseFromProgram = async (programExerciseId: string) => {
    try {
      const { error } = await supabase
        .from('program_exercises')
        .delete()
        .eq('id', programExerciseId);

      if (error) throw error;
    } catch (err) {
      console.error('Error removing exercise from program:', err);
      throw err;
    }
  };

  // Get program with all its exercises
  const getProgramWithExercises = async (programId: string): Promise<ProgramWithExercises | null> => {
    try {
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single();

      if (programError) throw programError;

      const { data: programExercises, error: exercisesError } = await supabase
        .from('program_exercises')
        .select(`
          *,
          exercises (*)
        `)
        .eq('program_id', programId)
        .order('day_number')
        .order('order_index');

      if (exercisesError) throw exercisesError;

      return {
        ...program,
        program_exercises: programExercises || [],
      };
    } catch (err) {
      console.error('Error fetching program with exercises:', err);
      return null;
    }
  };

  return {
    programs,
    loading,
    error,
    refetch: fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    addExerciseToProgram,
    removeExerciseFromProgram,
    getProgramWithExercises,
  };
};

// Hook to get programs assigned to the current user (for clients)
export const useMyPrograms = () => {
  const { user } = useAuth();
  const [myPrograms, setMyPrograms] = useState<(ClientProgram & { programs: Program | null })[]>([]);
  const [premadePrograms, setPremadePrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPrograms = useCallback(async () => {
    if (!user) {
      setMyPrograms([]);
      setPremadePrograms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch assigned programs
      const { data: assigned, error: assignedError } = await supabase
        .from('client_programs')
        .select(`
          *,
          programs (*)
        `)
        .eq('client_id', user.id)
        .eq('status', 'active');

      if (assignedError) throw assignedError;

      // Fetch premade programs (available to all subscribers)
      const { data: premade, error: premadeError } = await supabase
        .from('programs')
        .select('*')
        .eq('is_premade', true);

      if (premadeError) throw premadeError;

      setMyPrograms(assigned || []);
      setPremadePrograms(premade || []);
    } catch (err) {
      console.error('Error fetching my programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyPrograms();
  }, [fetchMyPrograms]);

  return {
    myPrograms,
    premadePrograms,
    loading,
    error,
    refetch: fetchMyPrograms,
  };
};

// Hook for trainers to manage client program assignments
export const useClientPrograms = () => {
  const [assignments, setAssignments] = useState<(ClientProgram & { profiles: Tables<'profiles'> | null; programs: Program | null })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_programs')
        .select(`
          *,
          profiles (*),
          programs (*)
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const assignProgramToClient = async (clientId: string, programId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_programs')
        .insert({
          client_id: clientId,
          program_id: programId,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssignments();
      return data;
    } catch (err) {
      console.error('Error assigning program:', err);
      throw err;
    }
  };

  const unassignProgram = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('client_programs')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      await fetchAssignments();
    } catch (err) {
      console.error('Error unassigning program:', err);
      throw err;
    }
  };

  const updateAssignmentStatus = async (assignmentId: string, status: 'active' | 'completed' | 'paused') => {
    try {
      const { data, error } = await supabase
        .from('client_programs')
        .update({ status })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;

      await fetchAssignments();
      return data;
    } catch (err) {
      console.error('Error updating assignment:', err);
      throw err;
    }
  };

  return {
    assignments,
    loading,
    refetch: fetchAssignments,
    assignProgramToClient,
    unassignProgram,
    updateAssignmentStatus,
  };
};
