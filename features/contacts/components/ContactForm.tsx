'use client'

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ContactFormData } from '@/features/contacts/schemas/contacts.schema';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export default function ContactForm({ propertyId, propertyTitle, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: propertyTitle 
      ? `Bonjour, je souhaite en savoir plus sur le bien "${propertyTitle}". Pouvez-vous me recontacter quand vous êtes disponible ?`
      : '',
    propertyId: propertyId
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Envoi direct vers l'API contacts
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Erreur lors de l\'envoi');
        }

        toast.success('Message envoyé, merci !');
      }
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi du message';
      setError(message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Merci, votre message est bien parti.</h3>
        <p className="text-green-700">Notre équipe revient vers vous rapidement avec une réponse claire.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Parlez-nous de votre projet</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input
              id="contact-first-name"
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              id="contact-last-name"
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="+261 34 XX XX XX XX"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea
            id="contact-message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          Nous utilisons vos informations uniquement pour vous répondre au sujet de votre demande.
        </p>
      </form>
    </div>
  );
}
