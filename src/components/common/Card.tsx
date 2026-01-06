import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `rounded-2xl smooth-transition ${paddingClasses[padding]}`;
  const interactiveClasses = hover || onClick ? 'cursor-pointer' : '';
  const cardClass = glass ? 'card-glass' : 'card';

  const Component = hover || onClick ? motion.div : 'div';

  const motionProps = hover || onClick ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: onClick ? { scale: 0.98 } : undefined,
  } : {};

  return (
    <Component
      className={`${cardClass} ${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;
