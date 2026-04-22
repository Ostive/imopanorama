'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeContextType, ThemeMode } from './types';
import { themes, defaultTheme } from './themes';

// Création du contexte
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Clé pour le stockage local
const THEME_STORAGE_KEY = 'imo_theme';
const THEME_MODE_STORAGE_KEY = 'imo_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // État pour le thème actuel
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  // État pour le mode (clair/sombre)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Charger le thème depuis le stockage local au chargement
  useEffect(() => {
    const loadTheme = () => {
      if (typeof window !== 'undefined') {
        // Charger le thème
        const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeId) {
          const theme = themes.find(t => t.id === savedThemeId);
          if (theme) {
            setCurrentTheme(theme);
          }
        }

        // Charger le mode
        const savedThemeMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) as ThemeMode;
        if (savedThemeMode && (savedThemeMode === 'light' || savedThemeMode === 'dark')) {
          setThemeMode(savedThemeMode);
          // Appliquer la classe au document pour le mode sombre
          if (savedThemeMode === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    };

    loadTheme();
  }, []);

  // Fonction pour changer de thème
  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  // Fonction pour basculer entre les modes clair et sombre
  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
    
    // Appliquer la classe au document pour le mode sombre
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Valeur du contexte
  const value: ThemeContextType = {
    currentTheme,
    themes,
    setTheme,
    themeMode,
    setThemeMode,
    toggleThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
