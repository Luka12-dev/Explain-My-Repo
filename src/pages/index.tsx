import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Search, Sparkles, Zap, Shield, TrendingUp, Github } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { githubService } from '@/lib/github';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const { setIsAnalyzing } = useAnalysisStore();

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    setError('');
    setIsValidating(true);

    try {
      const parsed = githubService.parseRepoUrl(repoUrl);
      if (!parsed) {
        throw new Error('Invalid GitHub repository URL');
      }

      await githubService.getRepository(parsed.owner, parsed.repo);
      
      setIsAnalyzing(true);
      router.push(`/analyze?repo=${encodeURIComponent(repoUrl)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to validate repository');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI models analyze your repository structure, code quality, and best practices.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized algorithms provide comprehensive analysis in seconds, not minutes.',
    },
    {
      icon: Shield,
      title: 'Security Scanning',
      description: 'Detect vulnerabilities, secrets, and security issues before they become problems.',
    },
    {
      icon: TrendingUp,
      title: 'Quality Metrics',
      description: 'Get detailed insights on code complexity, maintainability, and documentation.',
    },
  ];

  return (
    <MainLayout title="Explain My Repo - AI Repository Analysis" variant="intense">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 pt-12 pb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gradient-blue dark:text-gradient-dark">
              Explain My Repo
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Unlock deep insights into any GitHub repository with AI-powered analysis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-liquid-blue-400 to-liquid-blue-500 dark:from-liquid-dark-200 dark:to-liquid-dark-300 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative flex items-center bg-white dark:bg-liquid-dark-100 rounded-2xl shadow-2xl border-2 border-liquid-blue-200 dark:border-liquid-dark-200 overflow-hidden">
                <Github className="ml-6 text-gray-400 dark:text-gray-500" size={24} />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
                  className="flex-1 px-6 py-6 bg-transparent text-lg focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isValidating}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isValidating}
                  className="m-2 px-8 py-4 bg-gradient-to-r from-liquid-blue-400 to-liquid-blue-500 dark:from-liquid-dark-200 dark:to-liquid-dark-300 text-white font-semibold rounded-xl hover:scale-105 active:scale-95 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Search size={20} />
                  <span>{isValidating ? 'Validating...' : 'Analyze'}</span>
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 dark:text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Try:</span>
              {['facebook/react', 'microsoft/vscode', 'vercel/next.js'].map((example) => (
                <button
                  key={example}
                  onClick={() => setRepoUrl(`https://github.com/${example}`)}
                  className="px-3 py-1 rounded-lg bg-liquid-blue-100 dark:bg-liquid-dark-200 text-liquid-blue-600 dark:text-white hover:scale-105 smooth-transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="card smooth-hover group"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-liquid-blue-100 to-liquid-blue-200 dark:from-liquid-dark-200 dark:to-liquid-dark-300 group-hover:scale-110 smooth-transition">
                      <Icon className="text-liquid-blue-600 dark:text-white" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="pt-12"
          >
            <div className="card-glass max-w-4xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-liquid-blue-500 dark:bg-liquid-dark-300 text-white flex items-center justify-center mx-auto font-bold text-xl">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Enter URL</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Paste any GitHub repository URL
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-liquid-blue-500 dark:bg-liquid-dark-300 text-white flex items-center justify-center mx-auto font-bold text-xl">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our AI models scan and analyze the code
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-liquid-blue-500 dark:bg-liquid-dark-300 text-white flex items-center justify-center mx-auto font-bold text-xl">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Get Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive detailed analysis and recommendations
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
