import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <Loader2
      size={sizeClasses[size]}
      className={`animate-spin text-liquid-blue-500 dark:text-white ${className}`}
    />
  );
};

export default Spinner;
