import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    onRecaptchaLoad?: () => void;
  }
}

/**
 * Hook pour gérer l'intégration de Google reCAPTCHA v3
 * @param action L'action à associer à la vérification
 * @returns Un objet contenant le token et les fonctions pour exécuter reCAPTCHA
 */
export function useRecaptcha(action: string = 'contact_form') {
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Charger le script reCAPTCHA
  useEffect(() => {
    // Ne pas charger si déjà chargé
    if (document.querySelector('script[src*="recaptcha"]')) {
      setLoaded(true);
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.warn('Clé de site reCAPTCHA non définie');
      return;
    }

    // Définir la fonction de callback
    window.onRecaptchaLoad = () => {
      setLoaded(true);
    };

    // Créer et ajouter le script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&onload=onRecaptchaLoad`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      setError('Impossible de charger reCAPTCHA');
    };
    
    document.head.appendChild(script);

    return () => {
      // Nettoyer
      if (window.onRecaptchaLoad) {
        window.onRecaptchaLoad = undefined;
      }
    };
  }, []);

  // Exécuter reCAPTCHA et obtenir un token
  const executeRecaptcha = useCallback(async (): Promise<string | null> => {
    if (!loaded) {
      console.warn('reCAPTCHA n\'est pas encore chargé');
      return null;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error('Clé de site reCAPTCHA non définie');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      setToken(token);
      return token;
    } catch (err) {
      console.error('Erreur lors de l\'exécution de reCAPTCHA:', err);
      setError('Erreur lors de la vérification reCAPTCHA');
      return null;
    }
  }, [loaded, action]);

  return {
    loaded,
    token,
    error,
    executeRecaptcha
  };
}
