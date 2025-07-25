import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('challengely_difficulty');
    
    if (hasCompletedOnboarding) {
      navigate('/dashboard');
    } else {
      navigate('/welcome');
    }
  }, [navigate]);

  return null; // This component just redirects
};

export default Index;
