'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import Link from 'next/link';
import {
  Cog6ToothIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CurrencyEuroIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import ThemeSettings from '@/features/settings/components/ThemeSettings';
import { AllSettings } from '@/features/settings/types/settings.types';
import {
  GeneralTab,
  ContactTab,
  HomepageTab,
  FeaturesTab,
  EmailTab,
  SeoTab,
  PricingTab,
  SecurityTab,
  MapTab,
  SearchTab,
} from '@/features/settings/components/tabs';

const DEFAULT_SETTINGS: AllSettings = {
  general: {
    siteName: 'ImoPanorama',
    siteDescription: 'Votre partenaire immobilier de confiance à Madagascar',
    contactEmail: 'contact@imopanorama.mg',
    contactPhone: '+261 20 22 123 45',
    address: 'Antananarivo, Madagascar',
    logo: '',
    favicon: '',
    timezone: 'Indian/Antananarivo',
    language: 'fr',
    currency: 'MGA',
  },
  contact: {
    city: 'Antananarivo',
    country: 'Madagascar',
    phone: '+261 34 XX XX XX XX',
    email: 'contact@imopanorama.mg',
    workingHours: 'Lun-Ven: 8h-17h',
    responseTime: 'Réponse sous 24h',
    whatsapp: '',
    whatsappEnabled: false,
    facebook: '',
    facebookEnabled: false,
    instagram: '',
    instagramEnabled: false,
    linkedin: '',
    linkedinEnabled: false,
    twitter: '',
    twitterEnabled: false,
    youtube: '',
    youtubeEnabled: false,
    telegram: '',
    telegramEnabled: false,
  },
  features: {
    enableRegistration: true,
    enableComments: false,
    enableNotifications: true,
    maintenanceMode: false,
    enableFavorites: true,
    enableCompare: true,
    enablePropertyViews: true,
    enablePriceAlerts: false,
    enableVirtualTours: false,
    maxImagesPerProperty: 15,
    requireEmailVerification: false,
  },
  homepage: {
    showPropertySectionTitle: true,
    showPropertyPageBanner: false,
    featuredPropertiesCount: 6,
    showStats: true,
    showTestimonials: true,
    showPartners: false,
    heroTitle: 'Trouvez votre propriété idéale à Madagascar',
    heroSubtitle: 'Des biens d\'exception pour vos projets immobiliers',
  },
  email: {
    enableEmailNotifications: true,
    notifyOnNewContact: true,
    notifyOnNewProperty: true,
    notifyOnNewUser: false,
  },
  seo: {
    metaTitle: 'ImoPanorama - Immobilier Madagascar',
    metaDescription: 'Découvrez nos propriétés et services de construction à Madagascar. ImoPanorama, votre partenaire immobilier de confiance.',
    keywords: 'immobilier madagascar, propriété madagascar, terrain, villa, appartement, construction',
    sitemapEnabled: true,
    robotsTxtEnabled: true,
  },
  pricing: {
    currency: 'MGA',
    showPrices: true,
    showPriceOnRequest: true,
    minPrice: 0,
    maxPrice: 0,
    priceStep: 1000,
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    enableTwoFactor: false,
  },
  map: {
    provider: 'openstreetmap',
    defaultLat: -18.8792,
    defaultLng: 47.5079,
    defaultZoom: 12,
    showMap: true,
  },
};

const TABS = [
  { id: 'general', name: 'Général', icon: Cog6ToothIcon },
  { id: 'contact', name: 'Contact & Réseaux', icon: ChatBubbleLeftRightIcon },
  { id: 'homepage', name: 'Page d\'accueil', icon: HomeIcon },
  { id: 'features', name: 'Fonctionnalités', icon: WrenchScrewdriverIcon },
  { id: 'appearance', name: 'Apparence', icon: PaintBrushIcon },
  { id: 'email', name: 'Email', icon: EnvelopeIcon },
  { id: 'seo', name: 'SEO', icon: MagnifyingGlassIcon },
  { id: 'pricing', name: 'Tarification', icon: BanknotesIcon },
  { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
  { id: 'map', name: 'Carte', icon: MapPinIcon },
  { id: 'search', name: 'Recherche', icon: MagnifyingGlassIcon },
] as const;

type SettingsTabId = typeof TABS[number]['id'];
type SettingsChangeHandler = (section: string, field: string, value: string | boolean | number) => void;

function mergeSettings(settings?: Partial<AllSettings>): AllSettings {
  if (!settings) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    contact: {
      ...DEFAULT_SETTINGS.contact,
      ...settings.contact,
      whatsappEnabled: settings.contact?.whatsappEnabled ?? false,
      facebookEnabled: settings.contact?.facebookEnabled ?? false,
      instagramEnabled: settings.contact?.instagramEnabled ?? false,
      linkedinEnabled: settings.contact?.linkedinEnabled ?? false,
      twitterEnabled: settings.contact?.twitterEnabled ?? false,
      youtubeEnabled: settings.contact?.youtubeEnabled ?? false,
      telegramEnabled: settings.contact?.telegramEnabled ?? false,
    },
  };
}

function ActiveSettingsTab({
  activeTab,
  settings,
  isLoading,
  onChange,
}: {
  activeTab: SettingsTabId;
  settings: AllSettings;
  isLoading: boolean;
  onChange: SettingsChangeHandler;
}) {
  switch (activeTab) {
    case 'general':
      return <GeneralTab settings={settings.general} onChange={onChange} />;
    case 'contact':
      return <ContactTab settings={settings.contact} isLoading={isLoading} onChange={onChange} />;
    case 'homepage':
      return <HomepageTab settings={settings.homepage} onChange={onChange} />;
    case 'features':
      return <FeaturesTab settings={settings.features} onChange={onChange} />;
    case 'appearance':
      return (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Apparence</h3>
          <ThemeSettings />
        </div>
      );
    case 'email':
      return <EmailTab settings={settings.email} onChange={onChange} />;
    case 'seo':
      return <SeoTab settings={settings.seo} onChange={onChange} />;
    case 'pricing':
      return <PricingTab settings={settings.pricing} onChange={onChange} />;
    case 'security':
      return <SecurityTab settings={settings.security} onChange={onChange} />;
    case 'map':
      return <MapTab settings={settings.map} onChange={onChange} />;
    case 'search':
      return <SearchTab />;
    default:
      return null;
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('general');
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const { data: loadedSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      return data.success && data.settings ? mergeSettings(data.settings) : DEFAULT_SETTINGS;
    },
    staleTime: 60_000,
  });

  const handleInputChange = (section: string, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    if (loadedSettings) setSettings(loadedSettings);
  }, [loadedSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('✅ Paramètres sauvegardés avec succès dans la base de données !');
      } else {
        throw new Error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Cog6ToothIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">Paramètres</h1>
              <p className="text-muted-foreground font-medium mt-1 text-sm">Configurez les paramètres de votre site</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 text-foreground bg-card hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all border border-border shadow-sm shrink-0"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Retour
          </Link>
        </m.div>

        {/* Mobile: horizontal scrollable tabs */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-card text-muted-foreground border border-border hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-56 shrink-0"
          >
            <div className="bg-card rounded-2xl shadow-lg border border-border p-4 sticky top-8">
              <nav className="space-y-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </m.div>

          {/* Content */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-card rounded-2xl shadow-lg border border-border">
              <div className="p-4 sm:p-8">
                <ActiveSettingsTab
                  activeTab={activeTab}
                  settings={settings}
                  isLoading={isLoading}
                  onChange={handleInputChange}
                />

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex justify-end gap-3">
                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 text-foreground bg-muted hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all"
                    >
                      Annuler
                    </m.button>
                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sauvegarde en cours...
                        </>
                      ) : (
                        'Sauvegarder dans la base de données'
                      )}
                    </m.button>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}
