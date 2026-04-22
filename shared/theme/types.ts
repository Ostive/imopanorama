export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ColorPalette;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}
