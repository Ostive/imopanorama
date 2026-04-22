'use client';

import { MapSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

interface MapTabProps {
  settings: MapSettings;
  onChange: SettingsChangeHandler;
}

export function MapTab({ settings, onChange }: MapTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Carte</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Configuration de la carte</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Afficher la carte</h5>
                <p className="text-sm text-gray-500">Activer l&apos;affichage des cartes sur le site</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showMap}
                  onChange={(e) => onChange('map', 'showMap', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur de carte</label>
              <Select value={settings.provider} onValueChange={(v) => onChange('map', 'provider', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Fournisseur de carte" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="openstreetmap">OpenStreetMap (gratuit)</SelectItem>
                    <SelectItem value="google">Google Maps</SelectItem>
                    <SelectItem value="mapbox">Mapbox</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {settings.provider === 'google' && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                La clé API Google Maps se configure via les variables d&apos;environnement (.env)
              </p>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude par défaut</label>
                <input
                  type="number"
                  step="0.0001"
                  value={settings.defaultLat}
                  onChange={(e) => onChange('map', 'defaultLat', parseFloat(e.target.value) || -18.8792)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude par défaut</label>
                <input
                  type="number"
                  step="0.0001"
                  value={settings.defaultLng}
                  onChange={(e) => onChange('map', 'defaultLng', parseFloat(e.target.value) || 47.5079)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zoom par défaut</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.defaultZoom}
                  onChange={(e) => onChange('map', 'defaultZoom', parseInt(e.target.value) || 12)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
              ℹ️ Coordonnées par défaut: Antananarivo, Madagascar (-18.8792, 47.5079)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
