import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, AIModel } from '@/types';

interface SettingsState extends AppSettings {
  models: AIModel[];
  selectedModel: string;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  setModels: (models: AIModel[]) => void;
  updateModel: (modelId: string, updates: Partial<AIModel>) => void;
  setSelectedModel: (modelId: string) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'liquid-blue',
  animations: true,
  autoSave: true,
  defaultModel: 'codellama-7b',
  apiEndpoint: 'http://localhost:5000',
  maxConcurrentAnalyses: 3,
  cacheResults: true,
  cacheDuration: 3600000,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      models: [],
      selectedModel: 'codellama-7b',
      
      updateSettings: (settings) =>
        set((state) => ({
          ...state,
          ...settings,
        })),
      
      setModels: (models) => set({ models }),
      
      updateModel: (modelId, updates) =>
        set((state) => ({
          models: state.models.map((m) =>
            m.id === modelId ? { ...m, ...updates } : m
          ),
        })),
      
      setSelectedModel: (modelId) =>
        set({ selectedModel: modelId, defaultModel: modelId }),
      
      resetSettings: () =>
        set({
          ...defaultSettings,
        }),
    }),
    {
      name: 'settings-storage',
      skipHydration: true,
    }
  )
);
