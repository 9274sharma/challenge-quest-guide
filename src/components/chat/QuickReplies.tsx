import { MobileButton } from '@/components/ui/mobile-button';

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const QuickReplies = ({ suggestions, onSelect }: QuickRepliesProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="px-4 py-2 animate-slide-up">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <MobileButton
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelect(suggestion)}
              className="text-xs"
            >
              {suggestion}
            </MobileButton>
          ))}
        </div>
      </div>
    </div>
  );
};