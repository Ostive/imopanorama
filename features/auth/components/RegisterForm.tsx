'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RegisterFormData } from '@/features/auth/schemas/auth.schema';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  error?: string | null;
  clearError?: () => void;
}

export default function RegisterForm({ onSubmit, error, clearError }: RegisterFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    acceptTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (clearError) clearError();
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return; // La validation sera gérée par Zod
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      router.push('/login?registered=true');
    } catch (err) {
      // L'erreur est gérée par le contexte
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            placeholder="+261 34 XX XX XX XX"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Entreprise, si vous en avez une
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={formData.company || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmez le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
          {formData.password !== formData.confirmPassword && formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Les deux mots de passe ne sont pas identiques.</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            required
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
            J'accepte les{' '}
            <Link href="/cgu" className="text-primary-600 hover:text-primary-500">
              conditions d'utilisation
            </Link>{' '}
            et la{' '}
            <Link href="/politique-confidentialite" className="text-primary-600 hover:text-primary-500">
              politique de confidentialité
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un espace ?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}
