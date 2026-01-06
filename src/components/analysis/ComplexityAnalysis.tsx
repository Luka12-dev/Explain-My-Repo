import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ComplexityMetrics } from '@/types';

interface ComplexityAnalysisProps {
  complexity: ComplexityMetrics;
}

const ComplexityAnalysis: React.FC<ComplexityAnalysisProps> = ({ complexity }) => {
  const getComplexityLevel = (value: number) => {
    if (value <= 5) return { label: 'Low', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
    if (value <= 10) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (value <= 20) return { label: 'High', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
  };

  const avgLevel = getComplexityLevel(complexity.averageComplexity);
  const maxLevel = getComplexityLevel(complexity.maxComplexity);

  const getMaintainabilityColor = (index: number) => {
    if (index >= 80) return 'text-green-500';
    if (index >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="card">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Complexity Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`p-6 rounded-xl ${avgLevel.bg} border-2 border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center space-x-2 mb-2">
              <Info className={avgLevel.color} size={24} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Complexity
              </span>
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-4xl font-bold ${avgLevel.color}`}>
                {complexity.averageComplexity.toFixed(1)}
              </span>
            </div>
            <div className={`mt-2 text-sm font-semibold ${avgLevel.color}`}>
              {avgLevel.label}
            </div>
          </div>

          <div className={`p-6 rounded-xl ${maxLevel.bg} border-2 border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className={maxLevel.color} size={24} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Maximum Complexity
              </span>
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-4xl font-bold ${maxLevel.color}`}>
                {complexity.maxComplexity.toFixed(0)}
              </span>
            </div>
            <div className={`mt-2 text-sm font-semibold ${maxLevel.color}`}>
              {maxLevel.label}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className={getMaintainabilityColor(complexity.maintainabilityIndex)} size={24} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Maintainability
              </span>
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-4xl font-bold ${getMaintainabilityColor(complexity.maintainabilityIndex)}`}>
                {complexity.maintainabilityIndex}
              </span>
              <span className="text-gray-500 dark:text-gray-400 mb-1">/100</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  complexity.maintainabilityIndex >= 80 ? 'bg-green-500' :
                  complexity.maintainabilityIndex >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${complexity.maintainabilityIndex}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Understanding Complexity
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h5 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                Low Complexity (1-5)
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Easy to understand and maintain. Simple logic with minimal branching.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h5 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                Moderate Complexity (6-10)
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Acceptable complexity. May benefit from some refactoring.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h5 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                High Complexity (11-20)
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Difficult to maintain. Consider breaking into smaller functions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                Very High Complexity (20+)
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                High risk of bugs. Immediate refactoring recommended.
              </p>
            </div>
          </div>
        </div>
      </div>

      {complexity.complexFiles.length > 0 && (
        <div className="card">
          <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Most Complex Files
          </h4>
          <div className="space-y-3">
            {complexity.complexFiles.slice(0, 10).map((file, index) => {
              const level = getComplexityLevel(file.complexity);
              return (
                <motion.div
                  key={file.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl ${level.bg} border-2 border-gray-200 dark:border-gray-700`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-900 dark:text-white mb-1">
                        {file.path}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-semibold ${level.color}`}>
                          Complexity: {file.complexity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${level.color} ${level.bg}`}>
                          {level.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ComplexityAnalysis;
