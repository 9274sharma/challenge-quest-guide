import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { MobileButton } from "@/components/ui/mobile-button";
import { Trophy, Clock, Target, Share, Calendar, Flame } from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import html2canvas from "html2canvas";
import { useRef } from "react";

// Mock challenges data
const challenges = [
  {
    id: 1,
    title: "Learn a New Language",
    description:
      "Start your language learning journey today! Choose a language that excites you and dive into a beginner lesson to learn basic greetings and common phrases.",
    estimatedTime: "30 minutes",
    difficulty: "Easy",
    category: "learning",
    type: "Learn a New Language",
  },
  {
    id: 2,
    title: "30-Minute Creative Writing",
    description:
      "Write a short story, poem, or journal entry for 30 minutes. Let your creativity flow without judgment.",
    estimatedTime: "30 minutes",
    difficulty: "Medium",
    category: "creativity",
    type: "Creative Writing Session",
  },
  {
    id: 3,
    title: "Mindful Morning Meditation",
    description:
      "Begin your day with a 0.5-minute guided meditation focusing on breath awareness and mindfulness.",
    estimatedTime: "0.5 minutes",
    difficulty: "Easy",
    category: "mindfulness",
    type: "Morning Meditation",
  },
];

const getTodayChallengeIndex = () => {
  // Use the day of year to rotate challenges
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % challenges.length;
};

export const Dashboard = () => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(
    getTodayChallengeIndex()
  );
  const [currentChallenge, setCurrentChallenge] = useState(
    challenges[getTodayChallengeIndex()]
  );
  const [streak, setStreak] = useState(() => {
    const stored = localStorage.getItem("challengely_streak");
    return stored ? parseInt(stored, 10) : 3;
  });
  const [totalSteps, setTotalSteps] = useState(10000);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Persist streak
  useEffect(() => {
    localStorage.setItem("challengely_streak", streak.toString());
  }, [streak]);

  // Pull-to-refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    if (
      touchStartY.current !== null &&
      touchEndY.current !== null &&
      touchEndY.current - touchStartY.current > 60
    ) {
      // Pull down detected
      handleRefresh();
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Rotate to next challenge
      const nextIndex = (currentChallengeIndex + 1) % challenges.length;
      setCurrentChallengeIndex(nextIndex);
      setChallengeState("revealed");
      setIsRefreshing(false);
    }, 1000);
  };

  // Determine challenge duration in seconds (default: 15 min)
  const getChallengeDuration = () => {
    const timeStr = currentChallenge.estimatedTime;
    if (!timeStr) return 900;
    if (timeStr.includes("minute")) {
      const min = parseInt(timeStr);
      return min * 60;
    }
    return 900;
  };

  // Timer persistence keys
  const getTimerStorageKey = () => `challengely_timer_${currentChallengeIndex}`;
  const getStateStorageKey = () => `challengely_state_${currentChallengeIndex}`;

  // Synchronously initialize challenge state and timer from localStorage
  const getInitialChallengeState = () => {
    const storedState = localStorage.getItem(getStateStorageKey());
    const storedTimer = localStorage.getItem(getTimerStorageKey());
    type ChallengeStateType =
      | "locked"
      | "revealed"
      | "in-progress"
      | "ready-to-complete"
      | "completed";
    if (storedState === "in-progress" && storedTimer) {
      const { start, duration } = JSON.parse(storedTimer);
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      if (elapsed < duration) {
        return {
          state: "in-progress" as ChallengeStateType,
          timer: duration - elapsed,
          timerActive: true,
        };
      } else {
        localStorage.removeItem(getTimerStorageKey());
        localStorage.removeItem(getStateStorageKey());
        return {
          state: "ready-to-complete" as ChallengeStateType,
          timer: 0,
          timerActive: false,
        };
      }
    } else if (storedState === "completed") {
      return {
        state: "completed" as ChallengeStateType,
        timer: null,
        timerActive: false,
      };
    } else if (storedState === "ready-to-complete") {
      return {
        state: "ready-to-complete" as ChallengeStateType,
        timer: 0,
        timerActive: false,
      };
    } else {
      return {
        state: "revealed" as ChallengeStateType,
        timer: null,
        timerActive: false,
      };
    }
  };
  const initial = getInitialChallengeState();
  const [challengeState, setChallengeState] = useState<
    "locked" | "revealed" | "in-progress" | "ready-to-complete" | "completed"
  >(initial.state);
  const [timer, setTimer] = useState<number | null>(initial.timer);
  const [timerActive, setTimerActive] = useState(initial.timerActive);

  // Restore timer and state on mount or challenge change
  useEffect(() => {
    setCurrentChallenge(challenges[currentChallengeIndex]);
  }, [currentChallengeIndex]);

  // Persist timer and state when timer starts or ticks
  useEffect(() => {
    if (timerActive && timer !== null) {
      // Get the original start time and duration from localStorage, or set if missing
      const stored = localStorage.getItem(getTimerStorageKey());
      let start = Date.now();
      let duration = getChallengeDuration();
      if (stored) {
        const parsed = JSON.parse(stored);
        start = parsed.start;
        duration = parsed.duration;
      } else {
        // If missing, set now
        localStorage.setItem(
          getTimerStorageKey(),
          JSON.stringify({ start, duration })
        );
      }
      // Update start time if timer changed (e.g., after navigation)
      const elapsed = duration - timer;
      const newStart = Date.now() - elapsed * 1000;
      localStorage.setItem(
        getTimerStorageKey(),
        JSON.stringify({ start: newStart, duration })
      );
      localStorage.setItem(getStateStorageKey(), "in-progress");
    }
  }, [timer, timerActive]);

  // Persist timer and state when timer starts
  const handleAcceptChallenge = () => {
    setChallengeState("in-progress");
    const duration = getChallengeDuration();
    setTimer(duration);
    setTimerActive(true);
    localStorage.setItem(getStateStorageKey(), "in-progress");
    localStorage.setItem(
      getTimerStorageKey(),
      JSON.stringify({ start: Date.now(), duration })
    );
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timer !== null && timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timerInterval.current!);
    } else if (timer === 0 && challengeState === "in-progress") {
      setTimerActive(false);
      setTimer(0);
      setChallengeState("ready-to-complete");
      localStorage.removeItem(getTimerStorageKey());
      localStorage.setItem(getStateStorageKey(), "ready-to-complete");
    }
    return () => clearInterval(timerInterval.current!);
  }, [timerActive, timer, challengeState]);

  // Format timer as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // On manual completion, clear timer state
  const handleCompleteChallenge = () => {
    setChallengeState("completed");
    setShowCelebration(true);
    setStreak((prev) => prev + 1);
    setTotalSteps((prev) => prev + 1000);
    setTimer(null);
    setTimerActive(false);
    localStorage.removeItem(getTimerStorageKey());
    localStorage.setItem(getStateStorageKey(), "completed");
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Challenge Completed!",
  //         text: `I just completed "${currentChallenge.title}" on Challengely! 🏆 Current streak: ${streak} days`,
  //         url: window.location.href,
  //       });
  //     } catch (err) {
  //       console.log("Error sharing:", err);
  //     }
  //   }
  // };

  const handleShareCard = async () => {
    if (!shareCardRef.current) return;
    const canvas = await html2canvas(shareCardRef.current, {
      backgroundColor: null,
    });
    const dataUrl = canvas.toDataURL("image/png");
    if (
      navigator.canShare &&
      navigator.canShare({
        files: [new File([dataUrl], "challenge.png", { type: "image/png" })],
      })
    ) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "challenge.png", { type: "image/png" });
      await navigator.share({
        files: [file],
        title: "Challenge Completed!",
        text: `I just completed "${currentChallenge.title}" on Challengely! 🏆 Current streak: ${streak} days`,
      });
    } else {
      // fallback: download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "challenge.png";
      link.click();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-blue-600 bg-blue-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <MobileLayout className="pb-20">
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        {isRefreshing && (
          <div className="w-full flex justify-center items-center py-2 text-primary">
            <svg
              className="w-6 h-6 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582M20 20v-5h-.581M5 19A9 9 0 105 5"
              />
            </svg>
            <span className="ml-2">Refreshing...</span>
          </div>
        )}
        {/* Celebration Overlay */}
        <Confetti show={showCelebration} duration={5000} pieceCount={60} />
        {showCelebration && (
          <div
            id="celebration-popup"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up"
          >
            <div className="bg-card rounded-3xl p-8 mx-6 text-center animate-bounce-in">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Challenge Completed!
              </h2>
              <p className="text-foreground-secondary mb-4">
                Amazing work! Keep up the momentum!
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{streak} day streak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span>{totalSteps.toLocaleString()} steps</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Daily Challenge
              </h1>
              <p className="text-foreground-secondary">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full">
              <Flame className="w-4 h-4" />
              <span className="font-bold">{streak}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="mobile-card text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {totalSteps.toLocaleString()}
              </div>
              <div className="text-sm text-foreground-secondary">
                Total Steps
              </div>
            </div>
            <div className="mobile-card text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {streak}
              </div>
              <div className="text-sm text-foreground-secondary">
                Day Streak
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="px-6 pb-[10px]">
          <div
            className={`mobile-card transition-all duration-300 transform translate-y-[-25px] ${
              challengeState === "revealed" ? "animate-slide-up" : ""
            }`}
          >
            {/* Challenge Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {currentChallenge.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(
                      currentChallenge.difficulty
                    )}`}
                  >
                    {currentChallenge.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-foreground-muted">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {currentChallenge.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Description */}
            <p className="text-foreground-secondary leading-relaxed mb-6">
              {currentChallenge.description}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {challengeState === "revealed" && (
                <MobileButton
                  variant="gradient"
                  size="full"
                  onClick={handleAcceptChallenge}
                  className="animate-pulse-glow"
                >
                  Accept Challenge
                </MobileButton>
              )}

              {challengeState === "in-progress" ||
              challengeState === "ready-to-complete" ? (
                <div className="space-y-3">
                  {/* Timer/Progress Bar */}
                  {timer !== null && challengeState === "in-progress" && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-primary font-medium">Timer</span>
                        <span className="text-primary font-mono text-sm">
                          {formatTime(timer)}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              timer !== null && getChallengeDuration()
                                ? ((getChallengeDuration() - timer) /
                                    getChallengeDuration()) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center animate-fade-in-up">
                    <div className="text-primary font-medium mb-2">
                      Challenge In Progress
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      Take your time and enjoy the process!
                    </div>
                  </div>
                  <MobileButton
                    variant="success"
                    size="full"
                    onClick={handleCompleteChallenge}
                    disabled={challengeState === "in-progress"}
                    className={
                      challengeState === "in-progress"
                        ? "opacity-60 cursor-not-allowed"
                        : "animate-bounce-in"
                    }
                  >
                    {challengeState === "in-progress"
                      ? "Complete (Wait for Timer)"
                      : "Mark as Complete"}
                  </MobileButton>
                </div>
              ) : null}

              {challengeState === "completed" && (
                <div className="space-y-3">
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                    <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-success font-medium mb-1">
                      Challenge Completed!
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      Current Streak: {streak} days
                    </div>
                  </div>
                  {/* <MobileButton
                    variant="outline"
                    size="full"
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share Your Achievement</span>
                  </MobileButton> */}
                  <MobileButton
                    variant="gradient"
                    size="full"
                    onClick={handleShareCard}
                    className="flex items-center justify-center space-x-2 animate-bounce-in"
                  >
                    <Share className="w-4 h-4" />
                    <span>Share Your Achievement</span>
                  </MobileButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
      {/* Hidden share card for html2canvas */}
      <div
        ref={shareCardRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 350,
          padding: 24,
          background: "white",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          zIndex: -1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Trophy
            style={{
              width: 48,
              height: 48,
              color: "#22c55e",
              margin: "0 auto",
            }}
          />
        </div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#16a34a",
            marginBottom: 8,
          }}
        >
          Challenge Completed!
        </h2>
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#334155",
            marginBottom: 12,
          }}
        >
          {currentChallenge.title}
        </div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
          {currentChallenge.description}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              background: "#fbbf24",
              color: "#fff",
              borderRadius: 12,
              padding: "4px 12px",
              fontWeight: 600,
            }}
          >
            Streak: {streak} days
          </span>
          <span
            style={{
              background: "#38bdf8",
              color: "#fff",
              borderRadius: 12,
              padding: "4px 12px",
              fontWeight: 600,
            }}
          >
            {currentChallenge.difficulty}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
          Shared from Challengely
        </div>
      </div>
    </MobileLayout>
  );
};
