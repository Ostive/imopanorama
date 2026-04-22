'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeContextType, ThemeMode } from './types';
import { themes, defaultTheme } from './themes';
import { applyThemeVariables, applyThemeMode } from './themeUtils';

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Clé pour le stockage local
const THEME_STORAGE_KEY = 'imo_theme';
const THEME_MODE_STORAGE_KEY = 'imo_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // État pour le thème actuel
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  // État pour le mode (clair/sombre)
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

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
            applyThemeVariables(theme);
          }
        } else {
          // Appliquer le thème par défaut si aucun thème n'est sauvegardé
          applyThemeVariables(defaultTheme);
        }

        // Charger le mode
        const savedThemeMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) as ThemeMode;
        if (savedThemeMode && (savedThemeMode === 'light' || savedThemeMode === 'dark')) {
          applyThemeMode(savedThemeMode);
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
      if (typeof window !== 'undefined') localStorage.setItem(THEME_STORAGE_KEY, themeId);
      applyThemeVariables(theme);
    }
  };

  // Fonction pour définir directement le mode
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
    applyThemeMode(mode);
  };
  
  // Fonction pour basculer entre les modes clair et sombre
  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
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

// Hook personnalisé pour utiliser le thème
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
