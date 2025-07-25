import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MobileButton } from '@/components/ui/mobile-button';
import { ChevronLeft, Dumbbell, Lightbulb, Brain, BookOpen, Users } from 'lucide-react';

const interests = [
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'from-red-500 to-pink-500' },
  { id: 'creativity', label: 'Creativity', icon: Lightbulb, color: 'from-yellow-500 to-orange-500' },
  { id: 'mindfulness', label: 'Mindfulness', icon: Brain, color: 'from-green-500 to-emerald-500' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  { id: 'social', label: 'Social', icon: Users, color: 'from-purple-500 to-pink-500' },
];

export const Interests = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) return;
    
    // Store selections in localStorage
    localStorage.setItem('challengely_interests', JSON.stringify(selectedInterests));
    
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/difficulty');
    }, 300);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <MobileLayout className="px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={handleBack} className="touch-target p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground-secondary" />
        </button>
        <div className="flex-1 bg-secondary rounded-full h-2 mx-4">
          <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-500"></div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in-up'}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Choose your interests
          </h1>
          <p className="text-foreground-secondary">
            Select at least 3 to personalize your challenges.
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {interests.map((interest) => {
            const Icon = interest.icon;
            const isSelected = selectedInterests.includes(interest.id);
            
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`
                  mobile-card p-6 text-center transition-all duration-200 transform hover:scale-105 touch-target
                  ${isSelected 
                    ? 'ring-2 ring-primary bg-primary/5 shadow-lg' 
                    : 'hover:shadow-md'
                  }
                `}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${interest.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-foreground">{interest.label}</h3>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="sticky bottom-8">
          <MobileButton
            variant="gradient"
            size="full"
            onClick={handleContinue}
            disabled={selectedInterests.length === 0}
            className={selectedInterests.length > 0 ? 'animate-bounce-in' : ''}
          >
            Continue
          </MobileButton>
        </div>
      </div>
    </MobileLayout>
  );
};