export type SupportedCountry = 'MG' | 'FR' | 'GB' | 'US' | 'MU' | 'RE';

export type SupportedCurrency = 'MGA' | 'EUR' | 'GBP' | 'USD' | 'MUR';

export interface MarketConfig {
  country: SupportedCountry;
  label: string;
  locale: string;
  currency: SupportedCurrency;
  phonePrefix: string;
}

export const DEFAULT_MARKET: SupportedCountry =
  (process.env.NEXT_PUBLIC_DEFAULT_MARKET as SupportedCountry | undefined) || 'MG';

export const MARKET_CONFIGS: Record<SupportedCountry, MarketConfig> = {
  MG: {
    country: 'MG',
    label: 'Madagascar',
    locale: 'fr-MG',
    currency: 'MGA',
    phonePrefix: '+261',
  },
  FR: {
    country: 'FR',
    label: 'France',
    locale: 'fr-FR',
    currency: 'EUR',
    phonePrefix: '+33',
  },
  GB: {
    country: 'GB',
    label: 'United Kingdom',
    locale: 'en-GB',
    currency: 'GBP',
    phonePrefix: '+44',
  },
  US: {
    country: 'US',
    label: 'United States',
    locale: 'en-US',
    currency: 'USD',
    phonePrefix: '+1',
  },
  MU: {
    country: 'MU',
    label: 'Maurice',
    locale: 'fr-MU',
    currency: 'MUR',
    phonePrefix: '+230',
  },
  RE: {
    country: 'RE',
    label: 'La Reunion',
    locale: 'fr-RE',
    currency: 'EUR',
    phonePrefix: '+262',
  },
};

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = ['MGA', 'EUR', 'GBP', 'USD', 'MUR'];

export function getMarketConfig(country?: string): MarketConfig {
  const key = (country || DEFAULT_MARKET).toUpperCase() as SupportedCountry;
  return MARKET_CONFIGS[key] || MARKET_CONFIGS[DEFAULT_MARKET];
}

export function getCurrencyLocale(currency?: string, country?: string): string {
  if (country) return getMarketConfig(country).locale;

  const market = Object.values(MARKET_CONFIGS).find(config => config.currency === currency);
  return market?.locale || MARKET_CONFIGS[DEFAULT_MARKET].locale;
}
