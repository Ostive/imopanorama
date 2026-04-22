'use client';

import { EmailSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';

interface EmailTabProps {
  settings: EmailSettings;
  onChange: SettingsChangeHandler;
}

const NOTIFICATION_TOGGLES = [
  { key: 'enableEmailNotifications', label: 'Notifications activées', description: 'Activer l\'envoi de notifications par email' },
  { key: 'notifyOnNewContact', label: 'Nouveau contact', description: 'Recevoir un email à chaque nouveau message de contact' },
  { key: 'notifyOnNewProperty', label: 'Nouvelle propriété', description: 'Recevoir un email à chaque ajout de propriété' },
  { key: 'notifyOnNewUser', label: 'Nouvel utilisateur', description: 'Recevoir un email à chaque inscription d\'utilisateur' },
] as const;

export function EmailTab({ settings, onChange }: EmailTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Email</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Notifications par Email</h4>
          <p className="text-sm text-gray-500 mb-4">La configuration SMTP se fait via les variables d&apos;environnement (.env)</p>
          <div className="space-y-4">
            {NOTIFICATION_TOGGLES.map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{toggle.label}</h5>
                  <p className="text-sm text-gray-500">{toggle.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(settings[toggle.key as keyof EmailSettings])}
                    onChange={(e) => onChange('email', toggle.key, e.target.checked)}
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
