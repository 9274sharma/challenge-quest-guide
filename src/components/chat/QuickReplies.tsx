import { MobileButton } from "@/components/ui/mobile-button";

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  horizontal?: boolean;
}

export const QuickReplies = ({
  suggestions,
  onSelect,
  horizontal,
}: QuickRepliesProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="px-0 py-0">
      <div className="w-full max-w-sm mx-auto">
        <div
          className={
            horizontal
              ? "flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide"
              : "flex flex-wrap gap-2"
          }
        >
          {suggestions.map((suggestion, index) => (
            <MobileButton
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelect(suggestion)}
              className={
                horizontal
                  ? "text-xs px-4 py-2 whitespace-nowrap flex-shrink-0 min-w-fit"
                  : "text-xs"
              }
            >
              {suggestion}
            </MobileButton>
          ))}
        </div>
      </div>
    </div>
  );
};
