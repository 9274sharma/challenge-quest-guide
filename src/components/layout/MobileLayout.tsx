import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showSafeArea?: boolean;
}

export const MobileLayout = ({ 
  children, 
  className, 
  showSafeArea = true 
}: MobileLayoutProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen bg-background flex flex-col w-full max-w-sm mx-auto",
        showSafeArea && "pt-safe-top pb-safe-bottom",
        className
      )}
    >
      {children}
    </div>
  );
};