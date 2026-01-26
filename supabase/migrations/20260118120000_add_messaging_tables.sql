-- Migration: Add messaging tables for coach-client communication
-- This enables real-time messaging between trainers and their Tier 2 (Coaching) clients

-- ============================================
-- 1. CREATE CONVERSATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_message_at timestamptz,
  UNIQUE(trainer_id, client_id)
);

-- ============================================
-- 2. CREATE MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS POLICIES FOR CONVERSATIONS
-- ============================================

-- Users can view conversations they are part of
CREATE POLICY "Users can view own conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (
  trainer_id = auth.uid() OR client_id = auth.uid()
);

-- Trainers can create conversations with their clients
CREATE POLICY "Trainers can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (
  -- Must be a trainer
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer')
  AND trainer_id = auth.uid()
  -- Client must be assigned to this trainer
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = client_id AND trainer_id = auth.uid())
);

-- Clients can create conversations with their trainer
CREATE POLICY "Clients can create conversation with their trainer"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (
  -- Must be a client with a trainer assigned
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'client' AND trainer_id IS NOT NULL)
  AND client_id = auth.uid()
  AND trainer_id = (SELECT trainer_id FROM public.profiles WHERE id = auth.uid())
);

-- Participants can update conversation (for last_message_at)
CREATE POLICY "Participants can update conversation"
ON public.conversations FOR UPDATE
TO authenticated
USING (trainer_id = auth.uid() OR client_id = auth.uid());

-- ============================================
-- 5. RLS POLICIES FOR MESSAGES
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.trainer_id = auth.uid() OR c.client_id = auth.uid())
  )
);

-- Users can send messages to their conversations
CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.trainer_id = auth.uid() OR c.client_id = auth.uid())
  )
);

-- Users can update messages (for marking as read)
CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.trainer_id = auth.uid() OR c.client_id = auth.uid())
  )
);

-- ============================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_conversations_trainer ON public.conversations(trainer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = false;

-- ============================================
-- 7. ENABLE REALTIME FOR MESSAGES TABLE
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ============================================
-- 8. TRIGGER TO UPDATE CONVERSATION TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- 9. COMMENTS
-- ============================================

COMMENT ON TABLE public.conversations IS 'Tracks messaging relationships between trainers and clients';
COMMENT ON TABLE public.messages IS 'Stores messages between trainers and clients with real-time support';
COMMENT ON COLUMN public.messages.is_read IS 'Whether the recipient has read the message';
