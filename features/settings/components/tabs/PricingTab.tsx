'use client';

import { PricingSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

interface PricingTabProps {
  settings: PricingSettings;
  onChange: SettingsChangeHandler;
}

export function PricingTab({ settings, onChange }: PricingTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarification</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Paramètres de prix</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
              <Select value={settings.currency} onValueChange={(v) => onChange('pricing', 'currency', v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Devise" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar ($)</SelectItem>
                    <SelectItem value="MGA">Ariary (Ar)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {[
              { key: 'showPrices', label: 'Afficher les prix', description: 'Affiche les prix publiquement sur le site' },
              { key: 'showPriceOnRequest', label: 'Prix sur demande', description: 'Permettre "Prix sur demande" pour certaines propriétés' },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{toggle.label}</h5>
                  <p className="text-sm text-gray-500">{toggle.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settings[toggle.key as keyof PricingSettings])}
                    onChange={(e) => onChange('pricing', toggle.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix minimum (filtre)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.minPrice}
                  onChange={(e) => onChange('pricing', 'minPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum (filtre)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.maxPrice}
                  onChange={(e) => onChange('pricing', 'maxPrice', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0 (illimité)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pas de prix (filtre)</label>
              <input
                type="number"
                min="100"
                step="100"
                value={settings.priceStep}
                onChange={(e) => onChange('pricing', 'priceStep', parseInt(e.target.value) || 1000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Incrément pour le slider de prix dans les filtres</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
