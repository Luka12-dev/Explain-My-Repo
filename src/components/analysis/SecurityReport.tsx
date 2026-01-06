import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import type { SecurityAnalysis, Vulnerability } from '@/types';

interface SecurityReportProps {
  security: SecurityAnalysis;
}

const SecurityReport: React.FC<SecurityReportProps> = ({ security }) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-orange-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="text-red-500" size={20} />;
      case 'high':
        return <AlertCircle className="text-orange-500" size={20} />;
      case 'moderate':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'low':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <CheckCircle2 className="text-green-500" size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <Shield className={getRatingColor(security.overallRating)} size={32} />
            <span className={`text-xl font-bold ${getRatingColor(security.overallRating)}`}>
              {security.overallRating.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(security.scoreBreakdown).map(([key, score]) => (
            <div key={key} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                    className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{score}</span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {key}
              </div>
            </div>
          ))}
        </div>

        {security.vulnerabilities.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vulnerabilities Found ({security.vulnerabilities.length})
            </h4>
            <div className="space-y-3">
              {security.vulnerabilities.map((vuln, index) => (
                <motion.div
                  key={vuln.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(vuln.severity)}
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {vuln.title}
                        </h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                              vuln.severity
                            )}`}
                          >
                            {vuln.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {vuln.package}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {vuln.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Vulnerable: {vuln.vulnerable}</span>
                    <span>Patched: {vuln.patched}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {security.secrets.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertTriangle size={20} />
              <span>Potential Secrets Detected ({security.secrets.length})</span>
            </h4>
            <div className="space-y-3">
              {security.secrets.map((secret, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
                >
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(secret.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-red-900 dark:text-red-400">
                          {secret.type}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                            secret.severity
                          )}`}
                        >
                          {secret.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-300 mb-1">
                        {secret.description}
                      </p>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        File: {secret.file} (Line {secret.line})
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {security.vulnerabilities.length === 0 && security.secrets.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="mx-auto text-green-500 mb-3" size={48} />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Security Issues Found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Your repository appears to be secure with no detected vulnerabilities or secrets.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SecurityReport;
