export const SUPPORTED_LOCALES = ['fr', 'en', 'mg'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'fr';

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  fr: 'Francais',
  en: 'English',
  mg: 'Malagasy',
};

export function isSupportedLocale(locale: string | null | undefined): locale is SupportedLocale {
  return !!locale && SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
