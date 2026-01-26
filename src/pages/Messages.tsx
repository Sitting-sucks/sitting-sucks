import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useSubscription } from '@/hooks/useSubscription';
import { useMessages } from '@/hooks/useMessages';
import { ConversationList, MessageThread } from '@/components/messaging';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const { isTrainer, loading: roleLoading } = useRole();
  const { subscriptionTier, loading: subLoading } = useSubscription();
  const {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    loading: conversationsLoading,
    messagesLoading,
    sendMessage,
  } = useMessages();

  const [showConversationList, setShowConversationList] = useState(true);

  // Check if user has access (trainer or Tier 2 subscriber)
  const hasAccess = isTrainer || subscriptionTier === 'coaching';
  const isLoading = roleLoading || subLoading;

  // Handle selecting a conversation (on mobile, hide the list)
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowConversationList(false);
  };

  // Handle going back to conversation list (mobile)
  const handleBack = () => {
    setShowConversationList(true);
    setActiveConversationId(null);
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Access denied - show upgrade prompt
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Messaging Requires Coaching Tier</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Direct messaging with your coach is available exclusively for Coaching (Tier 2) subscribers.
                Upgrade to get personalized support and guidance.
              </p>
              <Link to="/pricing">
                <Button size="lg">
                  View Pricing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-4 py-6 border-b">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                {isTrainer ? 'Chat with your clients' : 'Chat with your coach'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-180px)]">
          {/* Conversation List - hidden on mobile when viewing a thread */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r flex-shrink-0 ${
              showConversationList ? 'block' : 'hidden md:block'
            }`}
          >
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              loading={conversationsLoading}
            />
          </div>

          {/* Message Thread - hidden on mobile when viewing list */}
          <div
            className={`flex-1 ${
              !showConversationList ? 'block' : 'hidden md:block'
            }`}
          >
            <MessageThread
              conversation={activeConversation}
              messages={messages}
              currentUserId={user?.id || ''}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              loading={messagesLoading}
              showBackButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
