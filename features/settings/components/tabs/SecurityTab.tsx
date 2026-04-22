'use client';

import { SecuritySettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';

interface SecurityTabProps {
  settings: SecuritySettings;
  onChange: SettingsChangeHandler;
}

export function SecurityTab({ settings, onChange }: SecurityTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sécurité</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Sécurité d&apos;authentification</h4>
          <p className="text-sm text-gray-500 mb-4">Les clés CAPTCHA se configurent via les variables d&apos;environnement (.env)</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre max de tentatives de connexion</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => onChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Nombre de tentatives avant blocage temporaire</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée de session (heures)</label>
              <input
                type="number"
                min="1"
                max="720"
                value={settings.sessionTimeout}
                onChange={(e) => onChange('security', 'sessionTimeout', parseInt(e.target.value) || 24)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Durée avant déconnexion automatique (1-720 heures)</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Authentification à deux facteurs</h5>
                <p className="text-sm text-gray-500">Activer 2FA pour plus de sécurité</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTwoFactor}
                  onChange={(e) => onChange('security', 'enableTwoFactor', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
