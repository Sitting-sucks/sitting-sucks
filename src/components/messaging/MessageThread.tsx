import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { User, ArrowLeft, MessageCircle } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { MessageWithSender, ConversationWithDetails } from '@/hooks/useMessages';
import { format, isSameDay } from 'date-fns';

interface MessageThreadProps {
  conversation: ConversationWithDetails | undefined;
  messages: MessageWithSender[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  showBackButton?: boolean;
}

const MessagesSkeleton = () => (
  <div className="flex-1 p-4 space-y-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={`flex items-end gap-2 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
      >
        {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
        <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-48' : 'w-56'} rounded-2xl`} />
      </div>
    ))}
  </div>
);

const DateSeparator = ({ date }: { date: Date }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 border-t border-border" />
    <span className="text-xs text-muted-foreground font-medium">
      {format(date, 'MMMM d, yyyy')}
    </span>
    <div className="flex-1 border-t border-border" />
  </div>
);

export const MessageThread = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  loading = false,
  showBackButton = false,
}: MessageThreadProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/20">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-xl mb-2">Select a conversation</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Choose a conversation from the list to start messaging, or your messages will appear here when someone reaches out.
        </p>
      </div>
    );
  }

  // Group messages by date for date separators
  const messagesWithDates: Array<{ type: 'date'; date: Date } | { type: 'message'; message: MessageWithSender }> = [];
  let lastDate: Date | null = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    if (!lastDate || !isSameDay(lastDate, messageDate)) {
      messagesWithDates.push({ type: 'date', date: messageDate });
      lastDate = messageDate;
    }
    messagesWithDates.push({ type: 'message', message });
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background">
        {showBackButton && onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.other_user.avatar_url || undefined} />
          <AvatarFallback>
            {conversation.other_user.full_name?.[0]?.toUpperCase() || (
              <User className="h-5 w-5" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">
            {conversation.other_user.full_name || 'Unknown User'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {conversation.trainer_id === currentUserId ? 'Client' : 'Coach'}
          </p>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <MessagesSkeleton />
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">
            No messages yet. Say hello!
          </p>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          <div className="p-4 space-y-3">
            {messagesWithDates.map((item, index) => {
              if (item.type === 'date') {
                return <DateSeparator key={`date-${index}`} date={item.date} />;
              }
              const message = item.message;
              const isOwnMessage = message.sender_id === currentUserId;
              return (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  createdAt={message.created_at}
                  isOwnMessage={isOwnMessage}
                  sender={message.sender}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default MessageThread;
