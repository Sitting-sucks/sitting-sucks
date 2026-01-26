import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'trainer' | 'client';

interface RoleData {
  role: UserRole;
  trainerId: string | null;
}

export const useRole = () => {
  const { user } = useAuth();
  const [roleData, setRoleData] = useState<RoleData>({ role: 'client', trainerId: null });
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async () => {
    if (!user) {
      setRoleData({ role: 'client', trainerId: null });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, trainer_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
        setRoleData({ role: 'client', trainerId: null });
      } else {
        setRoleData({
          role: (data?.role as UserRole) || 'client',
          trainerId: data?.trainer_id || null,
        });
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      setRoleData({ role: 'client', trainerId: null });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  const isTrainer = roleData.role === 'trainer';
  const isClient = roleData.role === 'client';

  return {
    role: roleData.role,
    trainerId: roleData.trainerId,
    isTrainer,
    isClient,
    loading,
    refetch: fetchRole,
  };
};
