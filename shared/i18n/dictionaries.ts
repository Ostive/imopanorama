import { DEFAULT_LOCALE, SupportedLocale } from './config';

const dictionaries = {
  fr: {
    common: {
      buy: 'Acheter',
      rent: 'Louer',
      sell: 'Vendre',
      contact: 'Contact',
      properties: 'Proprietes',
      news: 'Actualites',
      verified: 'Verifie',
      legalTrust: 'Confiance juridique',
    },
    property: {
      legalStatus: 'Statut foncier',
      documentStatus: 'Etat des documents',
      titleDeed: 'Titre foncier',
      cadastre: 'Cadastre',
      ownerVerified: 'Proprietaire verifie',
      documentsAvailable: 'Documents disponibles',
    },
  },
  en: {
    common: {
      buy: 'Buy',
      rent: 'Rent',
      sell: 'Sell',
      contact: 'Contact',
      properties: 'Properties',
      news: 'News',
      verified: 'Verified',
      legalTrust: 'Legal trust',
    },
    property: {
      legalStatus: 'Land/legal status',
      documentStatus: 'Document status',
      titleDeed: 'Title deed',
      cadastre: 'Cadastre',
      ownerVerified: 'Verified owner',
      documentsAvailable: 'Available documents',
    },
  },
  mg: {
    common: {
      buy: 'Hividy',
      rent: 'Hanofa',
      sell: 'Hivarotra',
      contact: 'Hifandray',
      properties: 'Trano sy tany',
      news: 'Vaovao',
      verified: 'Voamarina',
      legalTrust: 'Fanaraha-maso ara-taratasy',
    },
    property: {
      legalStatus: 'Toetry ny taratasy/tany',
      documentStatus: 'Toetry ny antontan-taratasy',
      titleDeed: 'Titre foncier',
      cadastre: 'Cadastre',
      ownerVerified: 'Tompony voamarina',
      documentsAvailable: 'Taratasy misy',
    },
  },
} as const;

type Dictionary = (typeof dictionaries)[SupportedLocale];
type Namespace = keyof Dictionary;

export function getDictionary(locale: SupportedLocale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function translate(
  locale: SupportedLocale,
  namespace: Namespace,
  key: keyof Dictionary[Namespace],
) {
  return getDictionary(locale)[namespace][key] ?? dictionaries[DEFAULT_LOCALE][namespace][key];
}
