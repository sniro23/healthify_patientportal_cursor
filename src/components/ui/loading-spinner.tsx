
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  const sizeClass = sizeClasses[size];
  
  return (
    <div className="flex justify-center items-center py-4">
      <div className={`animate-spin rounded-full border-t-transparent border-4 border-health-primary ${sizeClass} ${className}`} />
    </div>
  );
};

export default LoadingSpinner;
