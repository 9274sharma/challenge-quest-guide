import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileButton } from "@/components/ui/mobile-button";
import { Trophy } from "lucide-react";

export const Welcome = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/interests");
    }, 300);
  };

  const handleSkip = () => {
    // Set default preferences
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
    <MobileLayout className="justify-center items-center text-center px-6">
      <div
        className={`space-y-8 ${
          isAnimating ? "animate-fade-out" : "animate-fade-in-up"
        }`}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-3xl flex items-center justify-center shadow-lg">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Welcome to
            <br />
            <span className="text-primary">Challengly</span>
          </h1>
          <p className="text-foreground-secondary text-lg leading-relaxed max-w-sm mx-auto">
            Your daily dose of personalized challenges to help you grow and
            achieve your goals.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-8 space-y-4">
          <MobileButton
            variant="gradient"
            size="full"
            onClick={handleGetStarted}
            className="animate-pulse-glow"
          >
            Get Started
          </MobileButton>
          {/* <MobileButton
            variant="outline"
            size="full"
            onClick={handleSkip}
            className="text-foreground-secondary"
          >
            Skip
          </MobileButton> */}
        </div>
      </div>
    </MobileLayout>
  );
};
