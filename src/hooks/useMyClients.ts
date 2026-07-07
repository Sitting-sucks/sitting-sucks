import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MyClient {
  id: string;
  full_name: string | null;
  email: string;
}

/**
 * The current trainer's roster — clients whose profiles.trainer_id === the trainer.
 * Email is joined from the subscribers table (profiles has no email column).
 */
export const useMyClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<MyClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'client')
        .eq('trainer_id', user.id);
      if (error) throw error;

      const ids = (profiles || []).map((p) => p.id);
      const emails: Record<string, string> = {};
      if (ids.length > 0) {
        const { data: subs } = await supabase
          .from('subscribers')
          .select('user_id, email')
          .in('user_id', ids);
        (subs || []).forEach((s) => {
          if (s.user_id) emails[s.user_id] = s.email;
        });
      }

      setClients(
        (profiles || []).map((p) => ({
          id: p.id,
          full_name: p.full_name,
          email: emails[p.id] || '',
        }))
      );
    } catch (err) {
      console.error('Error fetching roster:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, refetch: fetchClients };
};
