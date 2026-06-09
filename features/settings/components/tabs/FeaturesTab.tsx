'use client';

import { FeaturesSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';

interface FeaturesTabProps {
  settings: FeaturesSettings;
  onChange: SettingsChangeHandler;
}

const FEATURE_TOGGLES = [
  { key: 'enableRegistration', label: 'Permettre les inscriptions', description: 'Les utilisateurs peuvent créer un compte' },
  { key: 'requireEmailVerification', label: 'Vérification email obligatoire', description: 'Les utilisateurs doivent vérifier leur email' },
  { key: 'enableComments', label: 'Commentaires', description: 'Permettre les commentaires sur les propriétés' },
  { key: 'enableNotifications', label: 'Notifications', description: 'Activer le système de notifications' },
  { key: 'enableFavorites', label: 'Favoris', description: 'Permettre aux utilisateurs de sauvegarder des favoris' },
  { key: 'enableCompare', label: 'Comparaison', description: 'Permettre la comparaison de propriétés' },
  { key: 'enablePropertyViews', label: 'Compteur de vues', description: 'Afficher le nombre de vues par propriété' },
  { key: 'enablePriceAlerts', label: 'Alertes prix', description: 'Notifications de changement de prix' },
  { key: 'enableVirtualTours', label: 'Visites virtuelles', description: 'Activer les visites virtuelles 360°' },
  { key: 'maintenanceMode', label: 'Mode maintenance', description: 'Désactiver temporairement le site public' },
] as const;

export function FeaturesTab({ settings, onChange }: FeaturesTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités</h3>
      <div className="space-y-4">
        {FEATURE_TOGGLES.map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{feature.label}</h4>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
            <label aria-label={feature.label} className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings[feature.key as keyof FeaturesSettings])}
                onChange={(e) => onChange('features', feature.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
        <div className="p-4 bg-gray-50 rounded-lg">
          <label htmlFor="features-max-images" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre maximum d&apos;images par propriété
          </label>
          <input
            id="features-max-images"
            type="number"
            min="1"
            max="50"
            value={settings.maxImagesPerProperty}
            onChange={(e) => onChange('features', 'maxImagesPerProperty', parseInt(e.target.value) || 15)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Limite d&apos;images uploadables par propriété (1-50)</p>
        </div>
      </div>
    </div>
  );
}
