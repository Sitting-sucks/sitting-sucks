import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { OnboardingData } from '@/lib/program-generator';

/** Loads the user's saved onboarding answers from profiles.onboarding_data. */
export function useOnboardingData() {
  const { user } = useAuth();
  const [data, setData] = useState<Partial<OnboardingData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('onboarding_data')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data: row }) => {
        if (cancelled) return;
        const od = (row as unknown as { onboarding_data?: Partial<OnboardingData> } | null)
          ?.onboarding_data;
        if (od && typeof od === 'object') setData(od);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { onboarding: data, loading };
}
