import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Camera, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Type your message..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 20;
      const maxHeight = lineHeight * 5; // max 5 lines
      const newHeight = Math.min(scrollHeight, maxHeight);
      
      textarea.style.height = `${newHeight}px`;
      setIsExpanded(newHeight > lineHeight);
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCharacterColor = () => {
    const remaining = maxLength - message.length;
    if (remaining < 50) return 'text-destructive';
    if (remaining < 100) return 'text-warning';
    return 'text-foreground-muted';
  };

  return (
    <div className="bg-card border-t border-border px-4 py-3 safe-bottom">
      <div className="w-full max-w-sm mx-auto">
        {/* Character Counter */}
        {message.length > maxLength * 0.8 && (
          <div className={cn("text-xs text-right mb-2 transition-colors", getCharacterColor())}>
            {message.length}/{maxLength}
          </div>
        )}

        {/* Input Container */}
        <div className="flex items-end space-x-2">
          {/* Expandable Toolbar */}
          {isExpanded && (
            <div className="flex items-center space-x-2 animate-slide-up">
              <button className="touch-target p-2 text-foreground-muted hover:text-foreground transition-colors">
                <Camera className="w-5 h-5" />
              </button>
              <button className="touch-target p-2 text-foreground-muted hover:text-foreground transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "chat-input w-full px-4 py-3 pr-12 border resize-none",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
              rows={1}
            />
            
            {/* Voice Button (when input is empty) */}
            {!message.trim() && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 touch-target p-1 text-foreground-muted hover:text-foreground transition-colors"
                disabled={disabled}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Send Button */}
          {message.trim() && (
            <button
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              className={cn(
                "touch-target p-3 rounded-xl transition-all duration-200 animate-bounce-in",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};