// Utilitaires partagés
import { getCurrencyLocale } from '@/shared/config/markets';

export const formatPrice = (price: number, currency = 'MGA', country?: string): string => {
  return new Intl.NumberFormat(getCurrencyLocale(currency, country), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: Date | string | null): string => {
  if (!date) return 'Date non disponible';
  
  try {
    const dateObject = date instanceof Date ? date : new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(dateObject.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObject);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

export const formatDateShort = (date: Date | string | null): string => {
  if (!date) return 'Date non disponible';
  
  try {
    const dateObject = date instanceof Date ? date : new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(dateObject.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObject);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplace les espaces par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Format Madagascar: +261 XX XX XX XX XX
  const phoneRegex = /^(\+261|261)?[0-9\s]{8,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Classes utilitaires
export const LocalStorage = {
  set<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (e) {
      return null;
    }
  },

  remove(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}
