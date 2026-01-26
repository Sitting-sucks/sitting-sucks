import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { RealtimeChannel } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

type ConversationRow = Tables<'conversations'>;
type MessageRow = Tables<'messages'>;

export interface ConversationWithDetails extends ConversationRow {
  other_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  unread_count: number;
  last_message?: string;
}

export interface MessageWithSender extends MessageRow {
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch conversations where user is either trainer or client
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`trainer_id.eq.${user.id},client_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convError) throw convError;

      if (!convData || convData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Fetch additional data for each conversation
      const conversationsWithDetails = await Promise.all(
        convData.map(async (conv) => {
          // Determine the other user
          const otherUserId = conv.trainer_id === user.id ? conv.client_id : conv.trainer_id;

          // Fetch other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', otherUserId)
            .single();

          // Fetch unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          // Fetch last message preview
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            other_user: profileData || { id: otherUserId, full_name: null, avatar_url: null },
            unread_count: unreadCount || 0,
            last_message: lastMessageData?.content,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (err) {
      logger.error('Error fetching conversations', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      setMessagesLoading(true);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Fetch sender profiles
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', msg.sender_id)
            .single();

          return {
            ...msg,
            sender: senderData || { id: msg.sender_id, full_name: null, avatar_url: null },
          };
        })
      );

      setMessages(messagesWithSenders);

      // Mark unread messages as read
      const unreadMessageIds = (data || [])
        .filter(msg => !msg.is_read && msg.sender_id !== user.id)
        .map(msg => msg.id);

      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessageIds);

        // Update conversation unread count in local state
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, unread_count: 0 }
              : conv
          )
        );
      }
    } catch (err) {
      logger.error('Error fetching messages', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setMessagesLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!user || !activeConversationId || !content.trim()) return null;

    try {
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (sendError) throw sendError;

      // Add message with sender info optimistically
      const messageWithSender: MessageWithSender = {
        ...data,
        sender: {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        },
      };

      setMessages(prev => [...prev, messageWithSender]);

      // Update conversation's last_message preview
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, last_message: content.trim(), last_message_at: new Date().toISOString() }
            : conv
        ).sort((a, b) => {
          const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return bTime - aTime;
        })
      );

      return data;
    } catch (err) {
      logger.error('Error sending message', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  // Create or get existing conversation with a user
  const getOrCreateConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(trainer_id.eq.${user.id},client_id.eq.${otherUserId}),and(trainer_id.eq.${otherUserId},client_id.eq.${user.id})`)
        .single();

      if (existingConv) {
        return existingConv.id;
      }

      // Determine roles to create conversation properly
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const { data: otherUserProfile } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', otherUserId)
        .single();

      const currentUserIsTrainer = currentUserProfile?.role === 'trainer';

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          trainer_id: currentUserIsTrainer ? user.id : otherUserId,
          client_id: currentUserIsTrainer ? otherUserId : user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state
      const newConversation: ConversationWithDetails = {
        ...newConv,
        other_user: {
          id: otherUserId,
          full_name: otherUserProfile?.full_name || null,
          avatar_url: otherUserProfile?.avatar_url || null,
        },
        unread_count: 0,
      };

      setConversations(prev => [newConversation, ...prev]);

      return newConv.id;
    } catch (err) {
      logger.error('Error creating conversation', err);
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      return null;
    }
  };

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!user || !activeConversationId) return;

    const channel: RealtimeChannel = supabase
      .channel(`messages:${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as MessageRow;

          // Skip if this is our own message (already added optimistically)
          if (newMessage.sender_id === user.id) return;

          // Fetch sender info
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender: MessageWithSender = {
            ...newMessage,
            sender: senderData || { id: newMessage.sender_id, full_name: null, avatar_url: null },
          };

          // Add to messages if not already present
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, messageWithSender];
          });

          // Mark as read immediately since we're viewing this conversation
          await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', newMessage.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversationId]);

  // Set up real-time subscription for new conversations/updates
  useEffect(() => {
    if (!user) return;

    const channel: RealtimeChannel = supabase
      .channel('conversations_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          // Refetch conversations on any change
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages]);

  // Get active conversation details
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    loading,
    messagesLoading,
    error,
    sendMessage,
    getOrCreateConversation,
    refetch: fetchConversations,
  };
};
