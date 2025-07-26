import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileButton } from "@/components/ui/mobile-button";
import { ChevronLeft, Zap, Target, Flame } from "lucide-react";

const difficulties = [
  {
    id: "easy",
    label: "Easy",
    description: "Simple tasks that fit perfectly into a busy day.",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    time: "5-15 min",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Engaging challenges that require some dedication and effort.",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    time: "15-30 min",
  },
  {
    id: "hard",
    label: "Hard",
    description: "Demanding tasks designed to truly push your limits.",
    icon: Flame,
    color: "from-red-500 to-pink-500",
    time: "30+ min",
  },
];

export const Difficulty = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContinue = () => {
    if (!selectedDifficulty) return;

    // Store difficulty in localStorage
    localStorage.setItem("challengely_difficulty", selectedDifficulty);

    setIsAnimating(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  const handleSkip = () => {
    localStorage.setItem(
      "challengely_interests",
      JSON.stringify(["fitness", "creativity", "mindfulness"])
    );
    localStorage.setItem("challengely_difficulty", "medium");
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  const handleBack = () => {
    navigate("/motivation"); // Go back to Motivation screen
  };

  return (
    <MobileLayout className="px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          title="button"
          onClick={handleBack}
          className="touch-target p-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6 text-foreground-secondary" />
        </button>
        <div className="flex-1 bg-secondary rounded-full h-2 mx-4">
          <div className="bg-primary h-2 rounded-full w-2/3 transition-all duration-500"></div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 ${
          isAnimating ? "animate-fade-out" : "animate-fade-in-up"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Set Your Challenge Level
          </h1>
          <p className="text-foreground-secondary">
            How tough do you want your challenges to be? You can always change
            this later.
          </p>
        </div>

        {/* Difficulty Options */}
        <div className="space-y-4 mb-8">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon;
            const isSelected = selectedDifficulty === difficulty.id;

            return (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`
                  w-full mobile-card p-6 text-left transition-all duration-200 transform hover:scale-[1.02] touch-target
                  ${
                    isSelected
                      ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                      : "hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${difficulty.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">
                        {difficulty.label}
                      </h3>
                      <span className="text-xs font-medium text-foreground-muted bg-secondary px-2 py-1 rounded-full">
                        {difficulty.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary leading-relaxed">
                      {difficulty.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="sticky bottom-8 space-y-4">
          <MobileButton
            variant="gradient"
            size="full"
            onClick={handleContinue}
            disabled={!selectedDifficulty}
            className={selectedDifficulty ? "animate-bounce-in" : ""}
          >
            Complete Profile
          </MobileButton>
          <MobileButton
            variant="outline"
            size="full"
            onClick={handleSkip}
            className="text-foreground-secondary"
          >
            Skip
          </MobileButton>
        </div>
      </div>
    </MobileLayout>
  );
};
