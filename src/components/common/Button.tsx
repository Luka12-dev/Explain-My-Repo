import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl smooth-transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-liquid-blue-400 to-liquid-blue-500 dark:from-liquid-dark-200 dark:to-liquid-dark-300 text-white hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-liquid-blue-400',
    secondary: 'bg-white dark:bg-liquid-dark-100 text-liquid-blue-500 dark:text-white border-2 border-liquid-blue-200 dark:border-liquid-dark-200 hover:border-liquid-blue-400 dark:hover:border-liquid-dark-300 hover:scale-105 active:scale-95 focus:ring-liquid-blue-400',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-xl hover:scale-105 active:scale-95 focus:ring-red-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
