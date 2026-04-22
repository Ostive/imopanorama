import { Theme, ThemeMode } from './types';

/**
 * Met à jour les variables CSS en fonction du thème sélectionné
 * @param theme Le thème à appliquer
 */
export const applyThemeVariables = (theme: Theme): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  // Appliquer les couleurs primaires
  const primaryColor = theme.colors.primary;
  const primaryColorPalette = getColorPalette(primaryColor);
  Object.entries(primaryColorPalette).forEach(([shade, value]) => {
    root.style.setProperty(`--color-primary-${shade}`, value);
  });
  
  // Appliquer les couleurs secondaires
  const secondaryColor = theme.colors.secondary;
  const secondaryColorPalette = getColorPalette(secondaryColor);
  Object.entries(secondaryColorPalette).forEach(([shade, value]) => {
    root.style.setProperty(`--color-secondary-${shade}`, value);
  });
  
  // Appliquer les couleurs d'accent
  const accentColor = theme.colors.accent;
  const accentColorPalette = getColorPalette(accentColor);
  Object.entries(accentColorPalette).forEach(([shade, value]) => {
    root.style.setProperty(`--color-accent-${shade}`, value);
  });
};

/**
 * Applique le mode clair ou sombre
 * @param mode Le mode à appliquer ('light' ou 'dark')
 */
export const applyThemeMode = (mode: ThemeMode): void => {
  if (typeof document === 'undefined') return;
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Récupère la palette de couleurs pour une couleur donnée
 * @param colorName Nom de la couleur
 * @returns Palette de couleurs avec les différentes nuances
 */
const getColorPalette = (colorName: string): Record<string, string> => {
  // Cette fonction est une simulation, dans un cas réel, 
  // vous pourriez récupérer ces valeurs depuis votre configuration Tailwind
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const palette: Record<string, string> = {};
  
  shades.forEach(shade => {
    const cssVarValue = typeof document !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorName}-${shade}`).trim()
      : '';
    
    palette[shade] = cssVarValue || `var(--color-${colorName}-${shade})`;
  });
  
  return palette;
};
