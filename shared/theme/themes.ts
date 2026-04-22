import { Theme } from './types';

// Thèmes prédéfinis
export const themes: Theme[] = [
  {
    id: 'sky',
    name: 'Sky Blue',
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      accent: 'accent',
      text: 'gray',
      background: 'white'
    }
  },
  {
    id: 'blue',
    name: 'Bleu',
    colors: {
      primary: 'blue',
      secondary: 'sky',
      accent: 'indigo',
      text: 'gray',
      background: 'white'
    }
  },
  {
    id: 'green',
    name: 'Vert',
    colors: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'lime',
      text: 'gray',
      background: 'white'
    }
  },
  {
    id: 'purple',
    name: 'Violet',
    colors: {
      primary: 'purple',
      secondary: 'violet',
      accent: 'fuchsia',
      text: 'gray',
      background: 'white'
    }
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: 'orange',
      secondary: 'amber',
      accent: 'red',
      text: 'gray',
      background: 'white'
    }
  }
];

// Thème par défaut
export const defaultTheme = themes[0];
