import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle2, 
  Code, 
  FileText, 
  Shield, 
  TrendingUp,
  GitBranch,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { useSettingsStore } from '@/store/settingsStore';
import { apiClient } from '@/lib/api';
import type { RepositoryAnalysis } from '@/types';

const AnalyzePage: React.FC = () => {
  const router = useRouter();
  const { repo } = router.query;
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Initializing');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentAnalysis, addToHistory } = useAnalysisStore();
  const { selectedModel } = useSettingsStore();

  const stages = [
    { name: 'Fetching repository', progress: 15 },
    { name: 'Analyzing code structure', progress: 30 },
    { name: 'Scanning dependencies', progress: 45 },
    { name: 'Running security checks', progress: 60 },
    { name: 'Calculating metrics', progress: 75 },
    { name: 'Generating AI insights', progress: 90 },
    { name: 'Finalizing report', progress: 100 },
  ];

  useEffect(() => {
    if (!repo) return;

    const analyzeRepo = async () => {
      try {
        const startTime = Date.now();
        
        for (let i = 0; i < stages.length; i++) {
          setCurrentStage(stages[i].name);
          setProgress(stages[i].progress);
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
        }

        const response = await apiClient.analyzeRepository(repo as string, selectedModel);

        if (response.success && response.data) {
          const duration = Date.now() - startTime;
          setAnalysis(response.data);
          setCurrentAnalysis(response.data);
          
          addToHistory({
            id: Date.now().toString(),
            repositoryUrl: repo as string,
            repositoryName: response.data.repository.fullName,
            timestamp: new Date().toISOString(),
            duration,
            summary: response.data.aiInsights.summary,
            status: 'completed',
          });

          setTimeout(() => {
            router.push('/results');
          }, 1500);
        } else {
          throw new Error(response.error || 'Analysis failed');
        }
      } catch (err: any) {
        console.error('Analysis error:', err);
        setError(err.message || 'Failed to analyze repository');
      }
    };

    analyzeRepo();
  }, [repo, selectedModel]);

  const progressPercentage = Math.min(progress, 100);

  return (
    <MainLayout title="Analyzing Repository - Explain My Repo" variant="subtle">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!error && !analysis && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Loader2 size={64} className="text-liquid-blue-500 dark:text-white" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analyzing Repository
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {currentStage}
                </p>
              </div>

              <div className="card space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-liquid-blue-600 dark:text-white">
                      {progressPercentage}%
                    </span>
                  </div>
                  
                  <div className="h-3 bg-gray-200 dark:bg-liquid-dark-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-liquid-blue-400 to-liquid-blue-500 dark:from-liquid-dark-200 dark:to-liquid-dark-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {stages.map((stage, index) => {
                    const isCompleted = progress >= stage.progress;
                    const isCurrent = currentStage === stage.name;

                    return (
                      <motion.div
                        key={stage.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-3 p-3 rounded-lg smooth-transition ${
                          isCurrent
                            ? 'bg-liquid-blue-100 dark:bg-liquid-dark-200'
                            : isCompleted
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : 'bg-gray-50 dark:bg-liquid-dark-100'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : isCurrent ? (
                          <Loader2 className="text-liquid-blue-500 dark:text-white animate-spin" size={20} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                        <span
                          className={`text-sm ${
                            isCurrent
                              ? 'text-liquid-blue-700 dark:text-white font-semibold'
                              : isCompleted
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {stage.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                This may take a few moments depending on repository size
              </div>
            </motion.div>
          )}

          {analysis && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircle2 size={80} className="text-green-500 mx-auto" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analysis Complete!
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Redirecting to results...
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <div className="text-center space-y-4">
                <div className="text-red-500 text-5xl">✕</div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                  Analysis Failed
                </h2>
                <p className="text-red-600 dark:text-red-300">{error}</p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary mt-4"
                >
                  Try Another Repository
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default AnalyzePage;
