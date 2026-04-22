'use client'

import { useState, useEffect } from 'react';
import { ContactFormData } from '@/features/contacts/types/contacts.types';
import { useRecaptcha } from '@/shared/hooks/useRecaptcha';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useContacts } from '../context/ContactsContext';
import { markContactFormAsSent, hasContactFormBeenSent } from '@/shared/utils/contactStorage';
import { logger } from '@/infrastructure/logger/logger';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface PropertyContactFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function PropertyContactForm({
  propertyId,
  propertyTitle,
  onSuccess,
  onClose
}: PropertyContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: `Bonjour,\n\nJe souhaite en savoir plus sur le bien "${propertyTitle}". Pouvez-vous me recontacter pour en discuter ?\n\nMerci.`,
    propertyId,
    // Champs honeypot (invisibles pour l'utilisateur)
    website: '',
    url: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionAttempts, setSubmissionAttempts] = useState(0);
  const [alreadySent, setAlreadySent] = useState(false);

  // Accès au contexte d'authentification
  const { user, isAuthenticated, hasRole } = useAuth();

  // Accès au contexte des contacts
  const { incrementContactsCount } = useContacts();

  // Intégration de reCAPTCHA
  const { loaded, executeRecaptcha, error: recaptchaError } = useRecaptcha('contact_form');

  // État pour suivre si le formulaire a été pré-rempli
  const [isAutofilled, setIsAutofilled] = useState(false);

  // Effet pour pré-remplir le formulaire si l'utilisateur est connecté en tant que client
  useEffect(() => {
    if (isAuthenticated && user && hasRole('client') && !isAutofilled) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
      setIsAutofilled(true);
    }
  }, [isAuthenticated, user, hasRole, isAutofilled]);

  // Effet pour vérifier si un formulaire a déjà été envoyé pour cette propriété
  useEffect(() => {
    if (propertyId) {
      const formAlreadySent = hasContactFormBeenSent(propertyId);
      setAlreadySent(formAlreadySent);

      if (formAlreadySent && isAuthenticated && user?.email) {
        const sentByCurrentUser = hasContactFormBeenSent(propertyId, user.email);
        setSuccess(sentByCurrentUser);
      }
    }
  }, [propertyId, isAuthenticated, user]);

  // Effet pour détecter les tentatives multiples de soumission
  useEffect(() => {
    if (submissionAttempts > 3) {
      setError('Trop de tentatives. Veuillez réessayer plus tard.');
    }
  }, [submissionAttempts]);

  // Réinitialiser l'erreur quand l'utilisateur modifie le formulaire
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification honeypot
    if (formData.website || formData.url) {
      logger.warn('Honeypot triggered - potential spam');
      setError('Une erreur est survenue. Veuillez réessayer.');
      return;
    }

    // Vérifier si déjà envoyé
    if (alreadySent && !isAuthenticated) {
      setError('Vous avez déjà envoyé une demande pour cette propriété.');
      return;
    }

    setLoading(true);
    setError(null);
    setSubmissionAttempts(prev => prev + 1);

    try {
      // Exécuter reCAPTCHA
      let recaptchaToken = '';
      if (loaded && executeRecaptcha) {
        try {
          const token = await executeRecaptcha();
          recaptchaToken = token || '';
        } catch (err) {
          logger.error('reCAPTCHA error:', err);
        }
      }

      // Envoyer la demande de contact
      const response = await fetch('/api/property-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      // Marquer comme envoyé dans le localStorage
      markContactFormAsSent(propertyId, formData.email);

      // Incrémenter le compteur de contacts
      incrementContactsCount();

      setSuccess(true);
      setAlreadySent(true);

      if (onSuccess) {
        onSuccess();
      }

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 3000);

    } catch (err: any) {
      logger.error('Error submitting contact form:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">Message envoyé !</h3>
        <p className="text-green-700">
          Nous avons bien reçu votre demande. Notre équipe revient vers vous rapidement avec les bonnes informations.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ce bien vous intéresse ?</h3>
        <p className="text-gray-600">Laissez-nous vos coordonnées, on vous recontacte pour en parler simplement.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || 'Une erreur est survenue'}</p>
        </div>
      )}

      {alreadySent && !success && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Vous avez déjà envoyé une demande pour ce bien. Notre équipe vous contactera bientôt.
          </p>
        </div>
      )}

      {/* Honeypot fields - hidden from users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      <input
        type="text"
        name="url"
        value={formData.url}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Jean"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Dupont"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="jean.dupont@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+261 34 00 000 00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <div className="relative">
          <ChatBubbleLeftRightIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Dites-nous ce que vous souhaitez savoir..."
          />
        </div>
      </div>

      {recaptchaError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            La vérification de sécurité n'a pas pu être chargée. Vous pouvez quand même envoyer le formulaire.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (submissionAttempts > 3)}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Envoi en cours...
          </span>
        ) : (
          'Envoyer la demande'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Vos informations servent uniquement à vous répondre au sujet de ce bien.
      </p>
    </form>
  );
}
