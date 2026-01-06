import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { 
  Repository, 
  RepositoryAnalysis, 
  APIResponse, 
  SearchResult,
  AIModel,
  ModelDownloadProgress 
} from '@/types';

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async analyzeRepository(repoUrl: string, modelId?: string): Promise<APIResponse<RepositoryAnalysis>> {
    try {
      const response = await this.client.post<APIResponse<RepositoryAnalysis>>('/api/analyze', {
        repoUrl,
        modelId,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getRepositoryInfo(repoUrl: string): Promise<APIResponse<Repository>> {
    try {
      const response = await this.client.get<APIResponse<Repository>>('/api/repository/info', {
        params: { repoUrl },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async searchRepository(repoUrl: string, query: string, type?: string): Promise<APIResponse<SearchResult[]>> {
    try {
      const response = await this.client.post<APIResponse<SearchResult[]>>('/api/search', {
        repoUrl,
        query,
        type,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAvailableModels(): Promise<APIResponse<AIModel[]>> {
    try {
      const response = await this.client.get<APIResponse<AIModel[]>>('/api/models');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async downloadModel(modelId: string): Promise<APIResponse<{ taskId: string }>> {
    try {
      const response = await this.client.post<APIResponse<{ taskId: string }>>('/api/models/download', {
        modelId,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getDownloadProgress(taskId: string): Promise<APIResponse<ModelDownloadProgress>> {
    try {
      const response = await this.client.get<APIResponse<ModelDownloadProgress>>(
        `/api/models/download/${taskId}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async cancelDownload(taskId: string): Promise<APIResponse<void>> {
    try {
      const response = await this.client.delete<APIResponse<void>>(`/api/models/download/${taskId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteModel(modelId: string): Promise<APIResponse<void>> {
    try {
      const response = await this.client.delete<APIResponse<void>>(`/api/models/${modelId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async healthCheck(): Promise<APIResponse<{ status: string; uptime: number }>> {
    try {
      const response = await this.client.get<APIResponse<{ status: string; uptime: number }>>('/api/health');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getHistory(): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get<APIResponse<any[]>>('/api/history');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getHistoryById(id: string): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get<APIResponse<any>>(`/api/history/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteHistory(id: string): Promise<APIResponse<any>> {
    try {
      const response = await this.client.delete<APIResponse<any>>(`/api/history/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async clearHistory(): Promise<APIResponse<any>> {
    try {
      const response = await this.client.delete<APIResponse<any>>('/api/history');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || error.message;
      return new Error(message);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const apiClient = new APIClient();

export default APIClient;
