/**
 * Utilitaire de test pour le système de thèmes
 * Ce fichier contient des fonctions pour tester le bon fonctionnement du système de thèmes
 */

import { themes } from './themes';
import { ThemeMode } from './types';

/**
 * Vérifie que toutes les couleurs nécessaires sont définies dans chaque thème
 */
export function validateThemeColors(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredColors: (keyof import('./types').ColorPalette)[] = ['primary', 'secondary'];

  Object.entries(themes).forEach(([themeName, theme]) => {
    // Vérifier que les couleurs primaires et secondaires sont définies
    requiredColors.forEach(colorType => {
      if (!theme.colors[colorType]) {
        errors.push(`Le thème "${themeName}" n'a pas de couleur "${colorType}" définie`);
      }
    });

    // Vérifier que les couleurs définies existent dans globals.css (@theme)
    Object.values(theme.colors).forEach(colorName => {
      // Cette vérification est simplifiée car nous ne pouvons pas accéder directement
      // à la configuration Tailwind ici. Dans un test réel, on vérifierait le bloc @theme.
      if (!['blue', 'green', 'red', 'purple', 'orange', 'gray', 'yellow'].includes(colorName)) {
        errors.push(`La couleur "${colorName}" utilisée dans le thème "${themeName}" n'est peut-être pas définie dans le bloc @theme de globals.css`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Vérifie que les variables CSS sont correctement injectées dans le document
 */
export function checkCssVariables(): { valid: boolean; missing: string[] } {
  if (typeof document === 'undefined') {
    return { valid: false, missing: ['Test non exécuté: document non disponible (côté serveur)'] };
  }
  
  const missing: string[] = [];
  const styles = getComputedStyle(document.documentElement);
  const requiredShades = ['500']; // On vérifie au moins la teinte principale
  
  // Vérifier les variables pour le thème actuel
  const currentTheme = localStorage.getItem('theme') || 'blue';
  
  requiredShades.forEach(shade => {
    const primaryVar = `--color-${currentTheme}-${shade}`;
    if (!styles.getPropertyValue(primaryVar)) {
      missing.push(primaryVar);
    }
  });
  
  // Vérifier aussi quelques couleurs de base qui devraient toujours être disponibles
  ['blue', 'green', 'red'].forEach(color => {
    const baseVar = `--color-${color}-500`;
    if (!styles.getPropertyValue(baseVar)) {
      missing.push(baseVar);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Vérifie que le mode sombre fonctionne correctement
 */
export function testDarkMode(currentMode: ThemeMode): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  
  const isDarkMode = currentMode === 'dark';
  const htmlHasDarkClass = document.documentElement.classList.contains('dark');
  
  return isDarkMode === htmlHasDarkClass;
}

/**
 * Exécute tous les tests et retourne un rapport
 */
export function runAllThemeTests(currentThemeMode: ThemeMode): {
  allValid: boolean;
  colorValidation: ReturnType<typeof validateThemeColors>;
  cssVariables: ReturnType<typeof checkCssVariables>;
  darkModeWorking: boolean;
} {
  const colorValidation = validateThemeColors();
  const cssVariables = checkCssVariables();
  const darkModeWorking = testDarkMode(currentThemeMode);
  
  return {
    allValid: colorValidation.valid && cssVariables.valid && darkModeWorking,
    colorValidation,
    cssVariables,
    darkModeWorking
  };
}
