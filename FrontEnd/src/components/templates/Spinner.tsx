import React from 'react';
import { Bug,Code2,Terminal } from 'lucide-react';

type SpinnerSize = 'small' | 'medium' | 'large' | 'xlarge';
type SpinnerVariant = 'theme' | 'white' | 'tech';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  fullScreen?: boolean;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'theme',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const gradientClasses: Record<SpinnerVariant, string> = {
    theme: 'from-blue-500 via-purple-500 to-blue-600',
    white: 'from-white via-gray-100 to-white',
    tech: 'from-blue-400 via-indigo-500 to-purple-600'
  };


  const spinnerElement = (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full border-4 rounded-full animate-spin"
        style={{
          borderColor: variant === 'theme' 
            ? '#e5e7eb' 
            : variant === 'white'
            ? 'rgba(255,255,255,0.3)'
            : '#e5e7eb',
          borderTopColor: variant === 'theme' 
            ? '#3b82f6' 
            : variant === 'white'
            ? '#ffffff'
            : '#60a5fa',
          animationDuration: '1s'
        }}
      />
    </div>
  );

  // Full screen wrapper
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div className="text-center">
          <div className="mb-4">
            {React.cloneElement(spinnerElement, { 
              size: 'large',
              className: 'mx-auto'
            })}
          </div>
          <div className="text-white font-medium">Loading...</div>
        </div>
        <div className="fixed top-20 left-20 opacity-50 animate-bounce" style={{ animationDelay: '0s' }}>
          <Bug size={24} className="text-purple-600" />
        </div>
        <div className="fixed top-40 right-32 opacity-50 animate-bounce" style={{ animationDelay: '1s' }}>
          <Code2 size={32} className="text-blue-600" />
        </div>
        <div className="fixed bottom-32 left-32 opacity-50 animate-bounce" style={{ animationDelay: '2s' }}>
          <Terminal size={28} className="text-pink-600" />
        </div>
      </div>
    );
  }

  return spinnerElement;
};