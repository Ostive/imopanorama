'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/shared/theme/ThemeContext'

export default function ThemeSettings() {
  const { themeMode, setThemeMode } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Mode d&apos;affichage</h3>
        <p className="text-sm text-muted-foreground mb-4">
          La palette de marque est fixée sur le bleu ciel. Choisis le mode clair ou sombre.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              themeMode === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary-300'
            }`}
          >
            <SunIcon className="w-5 h-5" />
            <span className="font-medium">Clair</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              themeMode === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary-300'
            }`}
          >
            <MoonIcon className="w-5 h-5" />
            <span className="font-medium">Sombre</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Aperçu de la palette</h4>
        <div className="grid grid-cols-5 gap-2 max-w-md">
          {(['50', '100', '300', '500', '700', '900'] as const).map(shade => (
            <div key={shade} className="text-center">
              <div className={`h-10 rounded-lg bg-primary-${shade} border border-border`} />
              <p className="text-xs text-muted-foreground mt-1">{shade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
