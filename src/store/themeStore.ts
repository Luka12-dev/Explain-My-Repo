import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeState {
  theme: 'liquid-blue' | 'liquid-dark';
  setTheme: (theme: 'liquid-blue' | 'liquid-dark') => void;
  toggleTheme: () => void;
  getThemeColors: () => Theme;
}

const liquidBlueTheme: Theme = {
  name: 'liquid-blue',
  primary: '#1a80ff',
  secondary: '#4d9cff',
  background: '#ffffff',
  surface: '#f5f8ff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e7ff',
  accent: '#0066e6',
  success: '#00c853',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

const liquidDarkTheme: Theme = {
  name: 'liquid-dark',
  primary: '#1a1a1a',
  secondary: '#2a2a2a',
  background: '#000000',
  surface: '#0a0a0a',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#1a1a1a',
  accent: '#333333',
  success: '#00c853',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'liquid-blue',
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          if (theme === 'liquid-dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'liquid-blue' ? 'liquid-dark' : 'liquid-blue';
        get().setTheme(newTheme);
      },
      getThemeColors: () => {
        return get().theme === 'liquid-blue' ? liquidBlueTheme : liquidDarkTheme;
      },
    }),
    {
      name: 'theme-storage',
      skipHydration: true,
    }
  )
);
