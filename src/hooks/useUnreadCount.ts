import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      // Get all conversation IDs for this user
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`trainer_id.eq.${user.id},client_id.eq.${user.id}`);

      if (convError) throw convError;

      if (!conversations || conversations.length === 0) {
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      const conversationIds = conversations.map(c => c.id);

      // Count unread messages not sent by current user
      const { count, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      if (countError) throw countError;

      setUnreadCount(count || 0);
    } catch (err) {
      logger.error('Error fetching unread count', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel: RealtimeChannel = supabase
      .channel('unread_messages_count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Refetch count on any message change
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount,
  };
};
