import { MobileLayout } from '@/components/layout/MobileLayout';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { MobileButton } from '@/components/ui/mobile-button';
import { User, Settings, Trophy, Target } from 'lucide-react';

export const Profile = () => {
  const interests = JSON.parse(localStorage.getItem('challengely_interests') || '[]');
  const difficulty = localStorage.getItem('challengely_difficulty') || 'medium';

  return (
    <MobileLayout className="pb-20">
      <div className="px-6 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-foreground-secondary">Track your progress and settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="mobile-card text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">3</div>
            <div className="text-sm text-foreground-secondary">Day Streak</div>
          </div>
          <div className="mobile-card text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">12</div>
            <div className="text-sm text-foreground-secondary">Completed</div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="mobile-card">
            <h3 className="font-semibold text-foreground mb-3">Preferences</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Difficulty:</span>
                <span className="text-foreground capitalize">{difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Interests:</span>
                <span className="text-foreground">{interests.length} selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </MobileLayout>
  );
};