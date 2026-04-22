'use client'

import { useState } from 'react'
import { useTheme } from '@/shared/theme/ThemeContext'
import ThemeSelector from '@/shared/theme/ThemeSelector'
// Utiliser des div à la place des composants Button et Card qui n'existent pas
// import { Button } from '@/shared/components/ui/Button'
// import { Card } from '@/shared/components/ui/Card'

export default function ThemeDemoPage() {
  const { currentTheme, themeMode, setThemeMode } = useTheme()
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Démonstration du système de thèmes</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Sélection du thème</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <h3 className="text-xl font-medium mb-4">Thème actuel: {currentTheme.name}</h3>
              <div className="mb-6">
                <p className="mb-2 text-gray-700 dark:text-gray-300">Couleur primaire: {currentTheme.colors.primary}</p>
                <p className="mb-2 text-gray-700 dark:text-gray-300">Couleur secondaire: {currentTheme.colors.secondary}</p>
                <p className="mb-2 text-gray-700 dark:text-gray-300">Mode: {themeMode}</p>
              </div>
              <ThemeSelector />
              
              <div className="mt-6 flex gap-4">
                <button 
                  className="border rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ borderColor: `var(--color-${currentTheme.colors.primary}-500)`, color: `var(--color-${currentTheme.colors.primary}-500)` }}
                  onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                >
                  Basculer en mode {themeMode === 'light' ? 'sombre' : 'clair'}
                </button>
                <button 
                  className="border rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  style={{ borderColor: `var(--color-${currentTheme.colors.primary}-500)`, color: `var(--color-${currentTheme.colors.primary}-500)` }}
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? 'Masquer' : 'Afficher'} le code
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <h3 className="text-xl font-medium mb-4">Aperçu des couleurs</h3>
              <div className="grid grid-cols-2 gap-4">
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
                  <div key={`primary-${shade}`} className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: `var(--color-${currentTheme.colors.primary}-${shade})` }}
                      title={`${currentTheme.colors.primary}-${shade}`}
                    />
                    <span className="text-sm">{currentTheme.colors.primary}-{shade}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => (
                  <div key={`secondary-${shade}`} className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: `var(--color-${currentTheme.colors.secondary}-${shade})` }}
                      title={`${currentTheme.colors.secondary}-${shade}`}
                    />
                    <span className="text-sm">{currentTheme.colors.secondary}-{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showCode && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Comment utiliser le système de thèmes</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">1. Importer le contexte de thème</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code>{`import { useTheme } from '@/shared/theme/ThemeContext'`}</code>
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">2. Utiliser le hook dans votre composant</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code>{`const { currentTheme, themeMode, setThemeMode, setTheme } = useTheme()`}</code>
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">3. Utiliser les variables CSS du thème</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code>{`<button 
  style={{ 
    backgroundColor: "var(--color-" + currentTheme.colors.primary + "-500)",
    color: "white"
  }}
  className="px-4 py-2 rounded-lg hover:opacity-90"
>
  Mon bouton
</button>`}</code>
              </pre>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">4. Supporter le mode sombre</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code>{`<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenu avec support du mode sombre
</div>`}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Exemples de composants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-medium mb-4">Boutons</h3>
            <div className="space-y-4">
              <div>
                <button 
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                  style={{ 
                    backgroundColor: `var(--color-${currentTheme.colors.primary}-500)`,
                    color: 'white'
                  }}
                >
                  Bouton Primaire
                </button>
              </div>
              <div>
                <button 
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                  style={{ 
                    backgroundColor: `var(--color-${currentTheme.colors.secondary}-500)`,
                    color: 'white'
                  }}
                >
                  Bouton Secondaire
                </button>
              </div>
              <div>
                <button 
                  className="px-4 py-2 rounded-lg border hover:bg-opacity-10 transition-colors"
                  style={{ 
                    borderColor: `var(--color-${currentTheme.colors.primary}-500)`,
                    color: `var(--color-${currentTheme.colors.primary}-500)`
                  }}
                >
                  Bouton Outline
                </button>
              </div>
              <div>
                <button 
                  className="px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors"
                  style={{ 
                    color: `var(--color-${currentTheme.colors.primary}-500)`
                  }}
                >
                  Bouton Ghost
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-medium mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <span 
                className="text-white px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: `var(--color-${currentTheme.colors.primary}-500)` }}
              >
                Badge primaire
              </span>
              <span 
                className="text-white px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: `var(--color-${currentTheme.colors.secondary}-500)` }}
              >
                Badge secondaire
              </span>
              <span 
                className="text-white px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-green-500)' }}
              >
                Disponible
              </span>
              <span 
                className="text-white px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-orange-500)' }}
              >
                Réservé
              </span>
              <span 
                className="text-white px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-red-500)' }}
              >
                Vendu
              </span>
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-medium mb-4">Alertes</h3>
            <div className="space-y-4">
              <div 
                className="p-4"
                style={{ 
                  backgroundColor: `var(--color-${currentTheme.colors.primary}-100)`,
                  borderLeftWidth: '4px',
                  borderLeftColor: `var(--color-${currentTheme.colors.primary}-500)`,
                  color: `var(--color-${currentTheme.colors.primary}-700)`
                }}
              >
                Alerte d'information
              </div>
              <div 
                className="p-4"
                style={{ 
                  backgroundColor: 'var(--color-green-100)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-green-500)',
                  color: 'var(--color-green-700)'
                }}
              >
                Alerte de succès
              </div>
              <div 
                className="p-4"
                style={{ 
                  backgroundColor: 'var(--color-yellow-100)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-yellow-500)',
                  color: 'var(--color-yellow-700)'
                }}
              >
                Alerte d'avertissement
              </div>
              <div 
                className="p-4"
                style={{ 
                  backgroundColor: 'var(--color-red-100)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-red-500)',
                  color: 'var(--color-red-700)'
                }}
              >
                Alerte d'erreur
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
