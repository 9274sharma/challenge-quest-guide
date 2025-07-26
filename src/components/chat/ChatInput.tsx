import { useState, useRef, useEffect } from "react";
import { Send, Mic, Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;
  const [lastSent, setLastSent] = useState<number>(0);
  const [shake, setShake] = useState(false);
  const debounceMs = 600;

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
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
    const now = Date.now();
    if (!trimmedMessage || disabled) return;
    if (now - lastSent < debounceMs) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setLastSent(now);
    onSendMessage(trimmedMessage);
    setMessage("");
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCharacterColor = () => {
    const remaining = maxLength - message.length;
    if (remaining < 50) return "text-destructive";
    if (remaining < 100) return "text-warning";
    return "text-foreground-muted";
  };

  return (
    <div
      className={cn(
        "bg-card border-t border-border px-4 py-3 safe-bottom",
        shake && "animate-shake"
      )}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Character Counter */}
        {message.length > maxLength * 0.8 && (
          <div
            className={cn(
              "text-xs text-right mb-2 transition-colors",
              getCharacterColor()
            )}
          >
            {message.length}/{maxLength}
          </div>
        )}

        {/* Input Container */}
        <div className="flex items-center space-x-2">
          {/* Always show camera and plus icons to the left */}
          <button
            className="touch-target p-2 text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center"
            title="Open camera"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            className="touch-target p-2 text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center"
            title="Add more options"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Text Input and Mic Icon as siblings for perfect alignment */}
          <div className="flex-1 flex items-center bg-input rounded-xl border border-border-input px-3 py-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full bg-transparent border-none outline-none resize-none placeholder:text-foreground-muted placeholder:italic placeholder:opacity-70 placeholder:text-sm text-base leading-tight flex items-center",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
              rows={1}
              style={{
                // minHeight: 36,
                maxHeight: 120,
                padding: 0,
                margin: 0,
                boxShadow: "none",
                alignItems: "center",
                display: "flex",
              }}
            />
            {/* Voice Button (when input is empty) */}
            {!message.trim() && (
              <button
                className="touch-target p-1 ml-2 text-foreground-muted hover:text-foreground transition-colors flex items-center justify-center"
                disabled={disabled}
                title="Voice input"
                tabIndex={0}
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
                "touch-target p-3 rounded-xl transition-all duration-200 animate-bounce-in flex items-center justify-center",
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
