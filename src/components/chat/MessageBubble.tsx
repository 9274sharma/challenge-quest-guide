import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';

  if (message.typing) {
    return (
      <div className="flex items-start space-x-3 animate-fade-in-up">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-foreground-muted rounded-full typing-dots"></div>
            <div className="w-2 h-2 bg-foreground-muted rounded-full typing-dots"></div>
            <div className="w-2 h-2 bg-foreground-muted rounded-full typing-dots"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start space-x-3 animate-fade-in-up",
      isUser && "flex-row-reverse space-x-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-secondary" 
          : "bg-primary"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-secondary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={cn(
        "rounded-2xl px-4 py-3 max-w-[80%] break-words",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-md" 
          : "bg-card border border-border rounded-tl-md"
      )}>
        <p className={cn(
          "text-sm leading-relaxed",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>
          {message.content}
        </p>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-primary-foreground" : "text-foreground-muted"
        )}>
          {message.timestamp.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  );
};