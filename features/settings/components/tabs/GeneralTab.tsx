'use client';

import { GeneralSettings, SettingsChangeHandler } from '@/features/settings/types/settings.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

interface GeneralTabProps {
  settings: GeneralSettings;
  onChange: SettingsChangeHandler;
}

export function GeneralTab({ settings, onChange }: GeneralTabProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres généraux</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="general-site-name" className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
          <input
            id="general-site-name"
            type="text"
            value={settings.siteName}
            onChange={(e) => onChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="general-site-description" className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
          <textarea
            id="general-site-description"
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => onChange('general', 'siteDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="general-contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
            <input
              id="general-contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => onChange('general', 'contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="general-contact-phone" className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              id="general-contact-phone"
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => onChange('general', 'contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="general-address" className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input
            id="general-address"
            type="text"
            value={settings.address}
            onChange={(e) => onChange('general', 'address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="general-logo" className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              id="general-logo"
              type="text"
              value={settings.logo}
              onChange={(e) => onChange('general', 'logo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="/images/brand/logo.png"
            />
          </div>
          <div>
            <label htmlFor="general-favicon" className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
            <input
              id="general-favicon"
              type="text"
              value={settings.favicon}
              onChange={(e) => onChange('general', 'favicon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="/favicon.ico"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</p>
            <Select value={settings.timezone} onValueChange={(v) => onChange('general', 'timezone', v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Fuseau horaire" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Indian/Antananarivo">Indian/Antananarivo (UTC+3)</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1/+2)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Langue</p>
            <Select value={settings.language} onValueChange={(v) => onChange('general', 'language', v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Langue" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="mg">Malagasy</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Devise</p>
            <Select value={settings.currency} onValueChange={(v) => onChange('general', 'currency', v)}>
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
        </div>
      </div>
    </div>
  );
}
