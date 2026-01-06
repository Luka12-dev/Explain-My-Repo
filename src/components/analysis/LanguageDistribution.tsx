import React from 'react';
import { motion } from 'framer-motion';
import type { LanguageStatistics } from '@/types';

interface LanguageDistributionProps {
  languages: LanguageStatistics[];
}

const LanguageDistribution: React.FC<LanguageDistributionProps> = ({ languages }) => {
  const colors = [
    '#1a80ff',
    '#4ade80',
    '#f59e0b',
    '#ec4899',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#10b981',
    '#6366f1',
    '#ef4444',
  ];

  const topLanguages = languages.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Language Distribution
      </h3>
      <div className="space-y-4">
        {topLanguages.map((lang, index) => (
          <div key={lang.language} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {lang.language}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {lang.files} files
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{lang.lines.toLocaleString()} lines</span>
              <span>{(lang.bytes / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageDistribution;
