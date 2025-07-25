import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { MobileButton } from '@/components/ui/mobile-button';
import { Trophy, Clock, Target, Share, Calendar, Flame } from 'lucide-react';

// Mock challenges data
const challenges = [
  {
    id: 1,
    title: 'Learn a New Language',
    description: 'Start your language learning journey today! Choose a language that excites you and dive into a beginner lesson to learn basic greetings and common phrases.',
    estimatedTime: '30 minutes',
    difficulty: 'Easy',
    category: 'learning',
    type: 'Learn a New Language'
  },
  {
    id: 2,
    title: '30-Minute Creative Writing',
    description: 'Write a short story, poem, or journal entry for 30 minutes. Let your creativity flow without judgment.',
    estimatedTime: '30 minutes',
    difficulty: 'Medium',
    category: 'creativity',
    type: 'Creative Writing Session'
  },
  {
    id: 3,
    title: 'Mindful Morning Meditation',
    description: 'Begin your day with a 15-minute guided meditation focusing on breath awareness and mindfulness.',
    estimatedTime: '15 minutes',
    difficulty: 'Easy',
    category: 'mindfulness',
    type: 'Morning Meditation'
  }
];

export const Dashboard = () => {
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [challengeState, setChallengeState] = useState<'locked' | 'revealed' | 'in-progress' | 'completed'>('revealed');
  const [streak, setStreak] = useState(3);
  const [totalSteps, setTotalSteps] = useState(10000);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAcceptChallenge = () => {
    setChallengeState('in-progress');
  };

  const handleCompleteChallenge = () => {
    setChallengeState('completed');
    setShowCelebration(true);
    setStreak(prev => prev + 1);
    setTotalSteps(prev => prev + 1000);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Challenge Completed!',
          text: `I just completed "${currentChallenge.title}" on Challengely! 🏆 Current streak: ${streak} days`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MobileLayout className="pb-20">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-card rounded-3xl p-8 mx-6 text-center animate-bounce-in">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Challenge Completed!</h2>
            <p className="text-foreground-secondary mb-4">Amazing work! Keep up the momentum!</p>
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
            <h1 className="text-2xl font-bold text-foreground">Daily Challenge</h1>
            <p className="text-foreground-secondary">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
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
            <div className="text-2xl font-bold text-primary mb-1">{totalSteps.toLocaleString()}</div>
            <div className="text-sm text-foreground-secondary">Total Steps</div>
          </div>
          <div className="mobile-card text-center">
            <div className="text-2xl font-bold text-primary mb-1">{streak}</div>
            <div className="text-sm text-foreground-secondary">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="px-6 mb-8">
        <div className={`mobile-card transition-all duration-300 ${
          challengeState === 'revealed' ? 'animate-slide-up' : ''
        }`}>
          {/* Challenge Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {currentChallenge.title}
              </h2>
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-foreground-muted">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{currentChallenge.estimatedTime}</span>
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
            {challengeState === 'revealed' && (
              <MobileButton
                variant="gradient"
                size="full"
                onClick={handleAcceptChallenge}
                className="animate-pulse-glow"
              >
                Accept Challenge
              </MobileButton>
            )}

            {challengeState === 'in-progress' && (
              <div className="space-y-3">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                  <div className="text-primary font-medium mb-2">Challenge In Progress</div>
                  <div className="text-sm text-foreground-secondary">
                    Take your time and enjoy the process!
                  </div>
                </div>
                <MobileButton
                  variant="success"
                  size="full"
                  onClick={handleCompleteChallenge}
                >
                  Mark as Complete
                </MobileButton>
              </div>
            )}

            {challengeState === 'completed' && (
              <div className="space-y-3">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                  <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-success font-medium mb-1">Challenge Completed!</div>
                  <div className="text-sm text-foreground-secondary">
                    Current Streak: {streak} days
                  </div>
                </div>
                <MobileButton
                  variant="outline"
                  size="full"
                  onClick={handleShare}
                  className="flex items-center justify-center space-x-2"
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
    </MobileLayout>
  );
};