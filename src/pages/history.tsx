import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Clock, Trash2, ExternalLink, Search, Filter, Eye } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getHistory();
      if (response.success) {
        setAnalysisHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (id: string) => {
    try {
      await apiClient.deleteHistory(id);
      setAnalysisHistory(analysisHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete history:', error);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    try {
      await apiClient.clearHistory();
      setAnalysisHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleViewAnalysis = async (id: string) => {
    try {
      const response = await apiClient.getHistoryById(id);
      if (response.success && response.data.data) {
        // Store the analysis data in localStorage temporarily
        localStorage.setItem('currentAnalysis', JSON.stringify(response.data.data));
        router.push('/results');
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
  };

  const filteredHistory = analysisHistory.filter((item) => {
    const matchesSearch = item.repositoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.repositoryUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <MainLayout title="Analysis History - Explain My Repo">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Analysis History
            </h1>
            {analysisHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="btn-secondary flex items-center space-x-2 text-red-600 dark:text-red-400"
              >
                <Trash2 size={20} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="card text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liquid-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
          ) : analysisHistory.length > 0 ? (
            <>
              <div className="card">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search repositories..."
                      className="input-field pl-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {filteredHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="card smooth-hover"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {item.repositoryName}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'completed'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          
                          <a
                            href={item.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-liquid-blue-600 dark:text-liquid-blue-400 hover:underline flex items-center space-x-1"
                          >
                            <span>{item.repositoryUrl}</span>
                            <ExternalLink size={14} />
                          </a>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.summary}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{formatDate(item.timestamp)}</span>
                            </div>
                            <div>
                              Duration: {formatDuration(item.duration)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewAnalysis(item.id)}
                            className="p-2 rounded-lg hover:bg-liquid-blue-50 dark:hover:bg-liquid-dark-200 text-liquid-blue-600 dark:text-liquid-blue-400 smooth-transition"
                            aria-label="View Analysis"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => handleRemoveFromHistory(item.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 smooth-transition"
                            aria-label="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredHistory.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No results found for your search
                  </p>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-16"
            >
              <Clock size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                No Analysis History
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start analyzing repositories to see your history here
              </p>
              <button onClick={() => router.push('/')} className="btn-primary">
                Analyze Repository
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
