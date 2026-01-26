import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConversationWithDetails } from '@/hooks/useMessages';

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  loading?: boolean;
}

const ConversationSkeleton = () => (
  <div className="flex items-center gap-3 p-3">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

export const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  loading = false,
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Your messages with coaches or clients will appear here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          const hasUnread = conversation.unread_count > 0;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.other_user.avatar_url || undefined} />
                  <AvatarFallback>
                    {conversation.other_user.full_name?.[0]?.toUpperCase() || (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-medium truncate ${
                      hasUnread ? 'text-foreground' : 'text-foreground'
                    }`}
                  >
                    {conversation.other_user.full_name || 'Unknown User'}
                  </span>
                  {conversation.last_message_at && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(conversation.last_message_at), {
                        addSuffix: false,
                      })}
                    </span>
                  )}
                </div>
                {conversation.last_message && (
                  <p
                    className={`text-sm truncate ${
                      hasUnread
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {conversation.last_message}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
