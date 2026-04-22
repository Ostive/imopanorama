/**
 * Utilitaire pour gérer le stockage local des formulaires de contact envoyés
 */

const STORAGE_KEY = 'imo_sent_contact_forms';

interface SentContactForm {
  propertyId: string;
  email: string;
  timestamp: number;
}

/**
 * Enregistre un formulaire de contact comme envoyé dans le localStorage
 */
export function markContactFormAsSent(propertyId: string, email: string): void {
  try {
    const sentForms = getSentContactForms();
    sentForms.push({
      propertyId,
      email,
      timestamp: Date.now()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sentForms));
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du formulaire envoyé:', error);
  }
}

/**
 * Vérifie si un formulaire de contact a déjà été envoyé pour une propriété donnée
 */
export function hasContactFormBeenSent(propertyId: string, email?: string): boolean {
  try {
    const sentForms = getSentContactForms();

    if (email) {
      // Si un email est fourni, vérifier la correspondance exacte
      return sentForms.some(form => form.propertyId === propertyId && form.email === email);
    } else {
      // Sinon, vérifier juste si la propriété a déjà été contactée
      return sentForms.some(form => form.propertyId === propertyId);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du formulaire envoyé:', error);
    return false;
  }
}

/**
 * Récupère tous les formulaires de contact envoyés
 */
export function getSentContactForms(): SentContactForm[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];

    return JSON.parse(storedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des formulaires envoyés:', error);
    return [];
  }
}

/**
 * Supprime un formulaire de contact envoyé
 */
export function removeSentContactForm(propertyId: string, email?: string): void {
  try {
    let sentForms = getSentContactForms();

    if (email) {
      // Supprimer le formulaire spécifique
      sentForms = sentForms.filter(form => !(form.propertyId === propertyId && form.email === email));
    } else {
      // Supprimer tous les formulaires pour cette propriété
      sentForms = sentForms.filter(form => form.propertyId !== propertyId);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sentForms));
  } catch (error) {
    console.error('Erreur lors de la suppression du formulaire envoyé:', error);
  }
}
