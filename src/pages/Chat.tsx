import { useState, useEffect, useRef } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageBubble, Message } from '@/components/chat/MessageBubble';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hardcoded responses for different scenarios
const responses = {
  greeting: [
    "Hi there! I'm your Challenge Assistant. Ready to tackle today's challenge? 💪",
    "Hello! How can I help you with your challenge today?",
    "Hey! Great to see you back. What's on your mind?"
  ],
  challenge_info: [
    "Today's challenge is to learn a new language! Start with basic greetings and common phrases. It's estimated to take about 30 minutes.",
    "Your current challenge focuses on language learning. Pick a language that excites you and dive into a beginner lesson!"
  ],
  motivation: [
    "You've got this! Every expert was once a beginner. Take it one step at a time! 🌟",
    "Amazing streak! 🔥 Keep up the momentum - you're doing incredible!",
    "Remember, the goal isn't perfection, it's progress. You're already winning by trying!"
  ],
  tips: [
    "Start with just 5 minutes if you're feeling overwhelmed. Small steps lead to big changes!",
    "Try using a language learning app like Duolingo or Babbel for structured lessons.",
    "Focus on pronunciation - don't worry about perfect grammar at first!"
  ],
  reflection: [
    "How did that feel? What was the most challenging part?",
    "What surprised you most about today's challenge?",
    "On a scale of 1-10, how confident do you feel about continuing tomorrow?"
  ],
  fallback: [
    "That's interesting! Can you tell me more about what you're thinking?",
    "I want to make sure I understand correctly. Could you rephrase that?",
    "Let me help you with that. What specific aspect would you like to explore?"
  ]
};

const quickSuggestions = {
  initial: ["What's today's challenge?", "I need motivation", "Give me tips", "I'm nervous"],
  during: ["This is hard!", "I'm making progress", "Need a break", "Almost done!"],
  completed: ["I finished!", "It was easier than expected", "That was tough", "Ready for tomorrow"]
};

export const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your Challenge Assistant. Ready to tackle today's challenge? 💪",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(quickSuggestions.initial);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getRandomResponse = (category: keyof typeof responses): string => {
    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const getResponseCategory = (message: string): keyof typeof responses => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    if (lowerMessage.includes('challenge') && (lowerMessage.includes('what') || lowerMessage.includes('today'))) {
      return 'challenge_info';
    }
    if (lowerMessage.includes('nervous') || lowerMessage.includes('scared') || lowerMessage.includes('help') || lowerMessage.includes('motivation')) {
      return 'motivation';
    }
    if (lowerMessage.includes('tip') || lowerMessage.includes('how') || lowerMessage.includes('start')) {
      return 'tips';
    }
    if (lowerMessage.includes('finished') || lowerMessage.includes('done') || lowerMessage.includes('completed')) {
      return 'reflection';
    }
    
    return 'fallback';
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      const responseCategory = getResponseCategory(content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getRandomResponse(responseCategory),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update suggestions based on conversation flow
      if (responseCategory === 'challenge_info') {
        setCurrentSuggestions(quickSuggestions.during);
      } else if (responseCategory === 'reflection') {
        setCurrentSuggestions(quickSuggestions.completed);
      }
    }, Math.random() * 2000 + 1000); // 1-3 second delay
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <MobileLayout className="pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="touch-target p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5 text-foreground-secondary" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground">Challenge Assistant</h1>
              <p className="text-sm text-foreground-secondary">Always here to help</p>
            </div>
          </div>
          <button className="touch-target p-2 text-foreground-secondary">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 pb-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <MessageBubble 
            message={{
              id: 'typing',
              content: '',
              sender: 'ai',
              timestamp: new Date(),
              typing: true
            }} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <QuickReplies 
        suggestions={currentSuggestions}
        onSelect={handleSuggestionSelect}
      />

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        placeholder="Ask me anything about your challenge..."
      />

      <BottomNavigation />
    </MobileLayout>
  );
};