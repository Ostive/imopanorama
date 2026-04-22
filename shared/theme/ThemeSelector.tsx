'use client'

import React from 'react';
import { useTheme } from './ThemeContext';

interface ThemeSelectorProps {
  className?: string;
  showLabel?: boolean;
  showModeToggle?: boolean;
}

export default function ThemeSelector({ 
  className = '', 
  showLabel = true,
  showModeToggle = true
}: ThemeSelectorProps) {
  const { currentTheme, themes, setTheme, themeMode, toggleThemeMode } = useTheme();

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Thème du site
        </label>
      )}
      
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${currentTheme.id === theme.id 
                ? 'scale-110' 
                : 'border-gray-200 hover:scale-105'
              }
            `}
            style={{
              background: `linear-gradient(135deg, var(--color-${theme.colors.primary}-500), var(--color-${theme.colors.secondary}-500))`,
              ...(currentTheme.id === theme.id ? {
                borderColor: `var(--color-${theme.colors.primary}-600)`,
                boxShadow: `0 0 0 2px var(--color-${theme.colors.primary}-300)`
              } : {})
            }}
            title={theme.name}
            aria-label={`Sélectionner le thème ${theme.name}`}
          />
        ))}
      </div>

      {showModeToggle && (
        <div className="flex items-center mt-2">
          <button
            onClick={toggleThemeMode}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label={themeMode === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          >
            {themeMode === 'light' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Mode sombre</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <span>Mode clair</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
