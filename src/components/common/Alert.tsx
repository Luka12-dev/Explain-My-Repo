import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-700 dark:text-green-400',
      iconColor: 'text-green-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      iconColor: 'text-yellow-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-400',
      iconColor: 'text-red-500',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${bgColor} ${borderColor} border-2 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start">
        <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 ${textColor} hover:opacity-70 smooth-transition`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;
