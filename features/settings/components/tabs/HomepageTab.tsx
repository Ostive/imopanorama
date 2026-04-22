'use client';

import { HomepageSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';

interface HomepageTabProps {
  settings: HomepageSettings;
  onChange: SettingsChangeHandler;
}

const HOMEPAGE_TOGGLES = [
  { key: 'showPropertySectionTitle', label: 'Afficher le titre sur la page d\'accueil', description: 'Affiche "Biens d\'Exception à Madagascar" sur la page d\'accueil' },
  { key: 'showPropertyPageBanner', label: 'Afficher la bannière sur /proprietes', description: 'Affiche "Propriétés Premium à Madagascar" sur la page /proprietes' },
  { key: 'showStats', label: 'Afficher les statistiques', description: 'Affiche les compteurs de propriétés, clients, etc.' },
  { key: 'showTestimonials', label: 'Afficher les témoignages', description: 'Affiche la section des avis clients' },
  { key: 'showPartners', label: 'Afficher les partenaires', description: 'Affiche le logo des partenaires' },
] as const;

export function HomepageTab({ settings, onChange }: HomepageTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Page d&apos;accueil &amp; Propriétés</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Section Héro</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre principal</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => onChange('homepage', 'heroTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Trouvez votre propriété idéale à Madagascar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => onChange('homepage', 'heroSubtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Des biens d'exception pour vos projets immobiliers"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {HOMEPAGE_TOGGLES.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{toggle.label}</h4>
                <p className="text-sm text-gray-500">{toggle.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings[toggle.key as keyof HomepageSettings])}
                  onChange={(e) => onChange('homepage', toggle.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de propriétés en vedette</label>
            <input
              type="number"
              min="3"
              max="12"
              value={settings.featuredPropertiesCount}
              onChange={(e) => onChange('homepage', 'featuredPropertiesCount', parseInt(e.target.value) || 6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">Nombre de propriétés à afficher sur la page d&apos;accueil (3-12)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
