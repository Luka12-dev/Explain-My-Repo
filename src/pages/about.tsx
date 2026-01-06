import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Info, Github, Youtube, Code, Zap, Shield, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Comprehensive Code Analysis',
      description: 'Deep analysis of repository structure, code quality, and architecture patterns.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Optimized algorithms provide results in seconds with real-time progress tracking.',
    },
    {
      icon: Shield,
      title: 'Security & Vulnerability Detection',
      description: 'Identify security issues, secrets, and vulnerabilities before deployment.',
    },
    {
      icon: TrendingUp,
      title: 'Quality Metrics & Insights',
      description: 'Detailed metrics on complexity, maintainability, and best practices.',
    },
  ];

  return (
    <MainLayout title="About - Explain My Repo">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <Info size={64} className="mx-auto text-liquid-blue-500 dark:text-white" />
            <h1 className="text-5xl font-bold text-gradient-blue dark:text-gradient-dark">
              About Explain My Repo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              AI-powered repository analysis for modern development teams
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Explain My Repo is designed to help developers and teams understand, analyze, and improve
              their GitHub repositories. Using advanced AI models and comprehensive code analysis tools,
              we provide actionable insights that help you write better code, improve security, and
              maintain high-quality projects.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-liquid-blue-100 dark:bg-liquid-dark-200">
                        <Icon className="text-liquid-blue-600 dark:text-white" size={24} />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pl-14">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Technology Stack</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  React, TypeScript, Next.js, Tailwind CSS, Framer Motion
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Node.js, Express, GitHub API, AI Model Integration
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Models</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Multiple local and cloud-based AI models for code analysis
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-liquid-blue-50 to-liquid-blue-100 dark:from-liquid-dark-100 dark:to-liquid-dark-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect With Us</h2>
            <div className="space-y-4">
              <a
                href="https://github.com/Luka12-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-liquid-dark-100 hover:scale-105 smooth-transition group"
              >
                <Github className="text-gray-900 dark:text-white group-hover:scale-110 smooth-transition" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">GitHub Profile</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">@Luka12-dev</div>
                </div>
              </a>
              
              <a
                href="https://www.youtube.com/@LukaCyber-s4b7o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-liquid-dark-100 hover:scale-105 smooth-transition group"
              >
                <Youtube className="text-red-600 group-hover:scale-110 smooth-transition" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">YouTube Channel</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">@LukaCyber-s4b7o</div>
                </div>
              </a>

              <a
                href="https://github.com/Luka12-dev/Explain-My-Repo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl bg-white dark:bg-liquid-dark-100 hover:scale-105 smooth-transition group"
              >
                <Code className="text-liquid-blue-600 dark:text-white group-hover:scale-110 smooth-transition" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Project Repository</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Luka12-dev/Explain-My-Repo</div>
                </div>
              </a>
            </div>
          </div>

          <div className="card text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Created with passion by <span className="font-semibold text-liquid-blue-600 dark:text-white">Luka</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Version 2.0.0
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
