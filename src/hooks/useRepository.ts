import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { Repository, RepositoryAnalysis } from '@/types';

interface UseRepositoryResult {
  repository: Repository | null;
  analysis: RepositoryAnalysis | null;
  loading: boolean;
  error: string | null;
  fetchRepository: (url: string) => Promise<void>;
  analyzeRepository: (url: string, modelId?: string) => Promise<void>;
  reset: () => void;
}

export function useRepository(): UseRepositoryResult {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepository = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getRepositoryInfo(url);
      if (response.success && response.data) {
        setRepository(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch repository');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setRepository(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeRepository = useCallback(async (url: string, modelId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.analyzeRepository(url, modelId);
      if (response.success && response.data) {
        setAnalysis(response.data);
        setRepository(response.data.repository);
      } else {
        throw new Error(response.error || 'Failed to analyze repository');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRepository(null);
    setAnalysis(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    repository,
    analysis,
    loading,
    error,
    fetchRepository,
    analyzeRepository,
    reset,
  };
}
