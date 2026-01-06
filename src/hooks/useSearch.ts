import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { SearchResult } from '@/types';

interface UseSearchResult {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (repoUrl: string, query: string, type?: string) => Promise<void>;
  clearResults: () => void;
}

export function useSearch(): UseSearchResult {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (repoUrl: string, query: string, type?: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.searchRepository(repoUrl, query, type);
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        throw new Error(response.error || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}
