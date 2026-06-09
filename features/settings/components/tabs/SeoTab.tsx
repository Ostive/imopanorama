'use client';

import { SeoSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';

interface SeoTabProps {
  settings: SeoSettings;
  onChange: SettingsChangeHandler;
}

export function SeoTab({ settings, onChange }: SeoTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO &amp; Analytics</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Meta Tags</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="seo-meta-title" className="block text-sm font-medium text-gray-700 mb-2">Titre Meta</label>
              <input
                id="seo-meta-title"
                type="text"
                value={settings.metaTitle}
                onChange={(e) => onChange('seo', 'metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="ImoPanorama - Immobilier Madagascar"
              />
              <p className="text-xs text-gray-500 mt-1">Idéal: 50-60 caractères</p>
            </div>
            <div>
              <label htmlFor="seo-meta-description" className="block text-sm font-medium text-gray-700 mb-2">Description Meta</label>
              <textarea
                id="seo-meta-description"
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => onChange('seo', 'metaDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Découvrez nos terrains et services de construction à Madagascar..."
              />
              <p className="text-xs text-gray-500 mt-1">Idéal: 150-160 caractères</p>
            </div>
            <div>
              <label htmlFor="seo-keywords" className="block text-sm font-medium text-gray-700 mb-2">Mots-clés</label>
              <input
                id="seo-keywords"
                type="text"
                value={settings.keywords}
                onChange={(e) => onChange('seo', 'keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="immobilier madagascar, terrain madagascar, construction"
              />
              <p className="text-xs text-gray-500 mt-1">Mots-clés séparés par des virgules</p>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Outils SEO</h4>
          <p className="text-sm text-gray-500 mb-4">Les IDs Analytics (GA, GTM, Pixel) se configurent via les variables d&apos;environnement (.env)</p>
          <div className="space-y-4">
            {[
              { key: 'sitemapEnabled', label: 'Sitemap activé', description: 'Génère automatiquement un sitemap.xml' },
              { key: 'robotsTxtEnabled', label: 'Robots.txt activé', description: 'Génère automatiquement un robots.txt' },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{toggle.label}</h5>
                  <p className="text-sm text-gray-500">{toggle.description}</p>
                </div>
                <label aria-label={toggle.label} className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settings[toggle.key as keyof SeoSettings])}
                    onChange={(e) => onChange('seo', toggle.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
