'use client'

import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContextType, ThemeMode } from './types'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_MODE_STORAGE_KEY = 'imo_theme_mode'

function applyMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light')

  useEffect(() => {
    const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY) as ThemeMode | null
    if (saved === 'light' || saved === 'dark') {
      setThemeModeState(saved)
      applyMode(saved)
    }
  }, [])

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
    applyMode(mode)
  }, [])

  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }, [setThemeMode, themeMode])

  const value = useMemo(() => ({ themeMode, setThemeMode, toggleThemeMode }), [themeMode, setThemeMode, toggleThemeMode])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
