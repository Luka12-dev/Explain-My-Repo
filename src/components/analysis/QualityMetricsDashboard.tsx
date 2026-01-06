import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { QualityMetrics } from '@/types';

interface QualityMetricsDashboardProps {
  metrics: QualityMetrics;
}

const QualityMetricsDashboard: React.FC<QualityMetricsDashboardProps> = ({ metrics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp size={20} className="text-green-500" />;
    if (score >= 60) return <Minus size={20} className="text-yellow-500" />;
    return <TrendingDown size={20} className="text-red-500" />;
  };

  const qualityCategories = [
    { name: 'Code Quality', score: metrics.codeQuality, icon: '💻' },
    { name: 'Documentation', score: metrics.documentation, icon: '📚' },
    { name: 'Testing', score: metrics.testing, icon: '🧪' },
    { name: 'Maintainability', score: metrics.maintainability, icon: '🔧' },
    { name: 'Security', score: metrics.security, icon: '🔒' },
    { name: 'Performance', score: metrics.performance, icon: '⚡' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className={`card ${getScoreBackground(metrics.overallScore)}`}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">
            <span className={getScoreColor(metrics.overallScore)}>{metrics.overallScore}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Overall Quality Score
          </h3>
          <div className="flex items-center justify-center space-x-2">
            {getTrendIcon(metrics.overallScore)}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {metrics.overallScore >= 80 ? 'Excellent' : metrics.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qualityCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`card ${getScoreBackground(category.score)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{category.icon}</span>
              {getTrendIcon(category.score)}
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {category.name}
            </h4>
            <div className="flex items-end space-x-2">
              <span className={`text-4xl font-bold ${getScoreColor(category.score)}`}>
                {category.score}
              </span>
              <span className="text-gray-500 dark:text-gray-400 mb-1">/100</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.score}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full ${
                  category.score >= 80 ? 'bg-green-500' : category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {metrics.recommendations.length > 0 && (
        <div className="card">
          <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Recommendations
          </h4>
          <div className="space-y-4">
            {metrics.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-blue-900 dark:text-blue-400">
                    {rec.title}
                  </h5>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    rec.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  {rec.description}
                </p>
                <div className="space-y-1">
                  {rec.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                  Estimated effort: {rec.estimatedEffort}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QualityMetricsDashboard;
