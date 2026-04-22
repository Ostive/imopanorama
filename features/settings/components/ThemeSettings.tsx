'use client'

import React from 'react';
import ThemeSelector from '@/shared/theme/ThemeSelector';
import { useTheme } from '@/shared/theme/ThemeContext';

export default function ThemeSettings() {
  const { currentTheme } = useTheme();
  
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 text-${currentTheme.colors.primary}-700 dark:text-${currentTheme.colors.primary}-300`}>
        Paramètres d&apos;affichage
      </h2>
      
      <div className="space-y-6">
        <div>
          <ThemeSelector showLabel={true} showModeToggle={true} />
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Personnalisez l&apos;apparence de l&apos;application en choisissant un thème de couleur et un mode d&apos;affichage.
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-medium mb-3 text-${currentTheme.colors.primary}-600 dark:text-${currentTheme.colors.primary}-400`}>
            Aperçu du thème actuel
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-md bg-${currentTheme.colors.primary}-100 dark:bg-${currentTheme.colors.primary}-900 text-${currentTheme.colors.primary}-800 dark:text-${currentTheme.colors.primary}-200`}>
              Couleur primaire
            </div>
            <div className={`p-4 rounded-md bg-${currentTheme.colors.secondary}-100 dark:bg-${currentTheme.colors.secondary}-900 text-${currentTheme.colors.secondary}-800 dark:text-${currentTheme.colors.secondary}-200`}>
              Couleur secondaire
            </div>
            <div className={`p-4 rounded-md bg-${currentTheme.colors.accent}-100 dark:bg-${currentTheme.colors.accent}-900 text-${currentTheme.colors.accent}-800 dark:text-${currentTheme.colors.accent}-200`}>
              Couleur d&apos;accent
            </div>
            <div className="p-4 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              Fond et texte
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <button className={`bg-${currentTheme.colors.primary}-600 hover:bg-${currentTheme.colors.primary}-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}>
              Bouton primaire
            </button>
            
            <button className={`bg-${currentTheme.colors.secondary}-600 hover:bg-${currentTheme.colors.secondary}-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ml-2`}>
              Bouton secondaire
            </button>
            
            <button className={`bg-${currentTheme.colors.accent}-600 hover:bg-${currentTheme.colors.accent}-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ml-2`}>
              Bouton accent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
