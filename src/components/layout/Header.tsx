import React from 'react';
import { useRouter } from 'next/router';
import { useThemeStore } from '@/store/themeStore';
import { Moon, Sun, Settings, History, Home } from 'lucide-react';

const Header: React.FC = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'liquid-dark';

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-liquid-blue-200 dark:border-liquid-dark-200 backdrop-blur-md bg-white/70 dark:bg-black/70">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-gradient-blue dark:text-gradient-dark smooth-transition hover:scale-105"
            >
              Explain My Repo
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg smooth-transition ${
                    isActive
                      ? 'bg-liquid-blue-100 dark:bg-liquid-dark-200 text-liquid-blue-600 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-liquid-blue-50 dark:hover:bg-liquid-dark-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl smooth-transition bg-liquid-blue-100 dark:bg-liquid-dark-200 hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} className="text-white" />
              ) : (
                <Moon size={20} className="text-liquid-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
