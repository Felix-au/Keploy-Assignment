'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      const isDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  if (!mounted) {
    return (
      <div className="w-24 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 animate-pulse" />
    );
  }

  const currentTheme = theme || 'system';

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className="flex items-center rounded-full p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 shadow-sm transition-colors"
    >
      <button
        type="button"
        aria-label="Light theme"
        onClick={() => handleSelectTheme('light')}
        className={`p-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${
          currentTheme === 'light'
            ? 'bg-white text-orange-600 shadow-sm scale-105 font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        aria-label="System theme"
        onClick={() => handleSelectTheme('system')}
        className={`p-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${
          currentTheme === 'system'
            ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm scale-105 font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }`}
        title={`System Preference (Currently ${resolvedTheme})`}
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        aria-label="Dark theme"
        onClick={() => handleSelectTheme('dark')}
        className={`p-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${
          currentTheme === 'dark'
            ? 'bg-slate-900 text-orange-400 shadow-sm scale-105 font-bold ring-1 ring-orange-500/30'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
