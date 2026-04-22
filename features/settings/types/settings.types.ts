export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: string;
  favicon: string;
  timezone: string;
  language: string;
  currency: string;
}

export interface ContactSettings {
  city: string;
  country: string;
  phone: string;
  email: string;
  workingHours: string;
  responseTime: string;
  whatsapp: string;
  whatsappEnabled: boolean;
  facebook: string;
  facebookEnabled: boolean;
  instagram: string;
  instagramEnabled: boolean;
  linkedin: string;
  linkedinEnabled: boolean;
  twitter: string;
  twitterEnabled: boolean;
  youtube: string;
  youtubeEnabled: boolean;
  telegram: string;
  telegramEnabled: boolean;
}

export interface FeaturesSettings {
  enableRegistration: boolean;
  enableComments: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  enableFavorites: boolean;
  enableCompare: boolean;
  enablePropertyViews: boolean;
  enablePriceAlerts: boolean;
  enableVirtualTours: boolean;
  maxImagesPerProperty: number;
  requireEmailVerification: boolean;
}

export interface HomepageSettings {
  showPropertySectionTitle: boolean;
  showPropertyPageBanner: boolean;
  featuredPropertiesCount: number;
  showStats: boolean;
  showTestimonials: boolean;
  showPartners: boolean;
  heroTitle: string;
  heroSubtitle: string;
}

export interface EmailSettings {
  enableEmailNotifications: boolean;
  notifyOnNewContact: boolean;
  notifyOnNewProperty: boolean;
  notifyOnNewUser: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  sitemapEnabled: boolean;
  robotsTxtEnabled: boolean;
}

export interface PricingSettings {
  currency: string;
  showPrices: boolean;
  showPriceOnRequest: boolean;
  minPrice: number;
  maxPrice: number;
  priceStep: number;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
}

export interface MapSettings {
  provider: string;
  defaultLat: number;
  defaultLng: number;
  defaultZoom: number;
  showMap: boolean;
}

export interface AllSettings {
  general: GeneralSettings;
  contact: ContactSettings;
  features: FeaturesSettings;
  homepage: HomepageSettings;
  email: EmailSettings;
  seo: SeoSettings;
  pricing: PricingSettings;
  security: SecuritySettings;
  map: MapSettings;
}

export type SettingsSection = keyof AllSettings;

export type SettingsChangeHandler = (
  section: string,
  field: string,
  value: string | boolean | number
) => void;
