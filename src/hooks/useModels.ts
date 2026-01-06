import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useSettingsStore } from '@/store/settingsStore';
import type { AIModel, ModelDownloadProgress } from '@/types';

interface UseModelsResult {
  models: AIModel[];
  loading: boolean;
  error: string | null;
  downloadModel: (modelId: string) => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  getDownloadProgress: (taskId: string) => Promise<ModelDownloadProgress | null>;
  refreshModels: () => Promise<void>;
}

export function useModels(): UseModelsResult {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setModels: setStoreModels } = useSettingsStore();

  const refreshModels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getAvailableModels();
      if (response.success && response.data) {
        setModels(response.data);
        setStoreModels(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch models');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [setStoreModels]);

  const downloadModel = useCallback(async (modelId: string) => {
    setError(null);

    try {
      const response = await apiClient.downloadModel(modelId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to start download');
      }
      await refreshModels();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    }
  }, [refreshModels]);

  const deleteModel = useCallback(async (modelId: string) => {
    setError(null);

    try {
      const response = await apiClient.deleteModel(modelId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete model');
      }
      await refreshModels();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    }
  }, [refreshModels]);

  const getDownloadProgress = useCallback(async (taskId: string) => {
    try {
      const response = await apiClient.getDownloadProgress(taskId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to get download progress:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  return {
    models,
    loading,
    error,
    downloadModel,
    deleteModel,
    getDownloadProgress,
    refreshModels,
  };
}
