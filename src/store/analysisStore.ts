import { create } from 'zustand';
import type { RepositoryAnalysis, AnalysisProgress, AnalysisHistory } from '@/types';

interface AnalysisState {
  currentAnalysis: RepositoryAnalysis | null;
  analysisProgress: AnalysisProgress | null;
  analysisHistory: AnalysisHistory[];
  isAnalyzing: boolean;
  error: string | null;
  
  setCurrentAnalysis: (analysis: RepositoryAnalysis | null) => void;
  setAnalysisProgress: (progress: AnalysisProgress | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (history: AnalysisHistory) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  analysisProgress: null,
  analysisHistory: [],
  isAnalyzing: false,
  error: null,
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error }),
  
  addToHistory: (history) => 
    set((state) => ({
      analysisHistory: [history, ...state.analysisHistory].slice(0, 50),
    })),
  
  clearHistory: () => set({ analysisHistory: [] }),
  
  removeFromHistory: (id) =>
    set((state) => ({
      analysisHistory: state.analysisHistory.filter((h) => h.id !== id),
    })),
  
  reset: () =>
    set({
      currentAnalysis: null,
      analysisProgress: null,
      isAnalyzing: false,
      error: null,
    }),
}));
