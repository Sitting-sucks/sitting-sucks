import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(true);

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionData({ subscribed: false });
      } else {
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionData({ subscribed: false });
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  const createCheckoutSession = useCallback(async () => {
    if (!user || !session) {
      throw new Error('User must be logged in to subscribe');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Open Stripe checkout in a new tab
    window.open(data.url, '_blank');
  }, [user, session]);

  const openCustomerPortal = useCallback(async () => {
    if (!user || !session) {
      throw new Error('User must be logged in to access customer portal');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Open customer portal in a new tab
    window.open(data.url, '_blank');
  }, [user, session]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    subscribed: subscriptionData.subscribed,
    subscriptionTier: subscriptionData.subscription_tier,
    subscriptionEnd: subscriptionData.subscription_end,
    loading,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };
};