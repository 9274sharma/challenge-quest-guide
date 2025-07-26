import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileButton } from "@/components/ui/mobile-button";
import { ChevronLeft, Star, Smile, Award, Users, Heart } from "lucide-react";

const motivations = [
  {
    id: "growth",
    label: "Growth",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "fun",
    label: "Fun",
    icon: Smile,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "achievement",
    label: "Achievement",
    icon: Award,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "wellbeing",
    label: "Wellbeing",
    icon: Heart,
    color: "from-red-500 to-pink-500",
  },
];

export const Motivation = () => {
  const navigate = useNavigate();
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMotivation = (motivationId: string) => {
    setSelectedMotivations((prev) =>
      prev.includes(motivationId)
        ? prev.filter((id) => id !== motivationId)
        : [...prev, motivationId]
    );
  };

  const handleContinue = () => {
    if (selectedMotivations.length === 0) return;
    localStorage.setItem(
      "challengely_motivations",
      JSON.stringify(selectedMotivations)
    );
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/difficulty");
    }, 300);
  };

  const handleBack = () => {
    navigate("/interests");
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

  return (
    <MobileLayout className="px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          title="secondary"
          onClick={handleBack}
          className="touch-target p-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6 text-foreground-secondary" />
        </button>
        <div className="flex-1 bg-secondary rounded-full h-2 mx-4">
          <div className="bg-primary h-2 rounded-full w-1/2 transition-all duration-500"></div>
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
            What motivates you?
          </h1>
          <p className="text-foreground-secondary">
            Select what drives you to complete challenges.
          </p>
        </div>
        {/* Motivations Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {motivations.map((motivation) => {
            const Icon = motivation.icon;
            const isSelected = selectedMotivations.includes(motivation.id);
            return (
              <button
                key={motivation.id}
                onClick={() => toggleMotivation(motivation.id)}
                className={`mobile-card p-6 text-center transition-all duration-200 transform hover:scale-105 touch-target ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/5 shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${motivation.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-foreground">
                  {motivation.label}
                </h3>
              </button>
            );
          })}
        </div>
        {/* Continue/Skip Buttons */}
        <div className="sticky bottom-8 space-y-4">
          <MobileButton
            variant="gradient"
            size="full"
            onClick={handleContinue}
            disabled={selectedMotivations.length === 0}
            className={
              selectedMotivations.length > 0 ? "animate-bounce-in" : ""
            }
          >
            Continue
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
