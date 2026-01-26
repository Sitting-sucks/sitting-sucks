import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isOwnMessage: boolean;
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  showAvatar?: boolean;
}

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
};

export const MessageBubble = ({
  content,
  createdAt,
  isOwnMessage,
  sender,
  showAvatar = true,
}: MessageBubbleProps) => {
  return (
    <div
      className={`flex items-end gap-2 ${
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {showAvatar && !isOwnMessage && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={sender.avatar_url || undefined} />
          <AvatarFallback>
            {sender.full_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && !isOwnMessage && <div className="w-8" />}

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {formatMessageTime(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
