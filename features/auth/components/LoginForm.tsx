'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginFormData } from '@/features/auth/schemas/auth.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  error?: string | null;
  clearError?: () => void;
}

export default function LoginForm({ onSubmit, error, clearError }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
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
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      router.push(redirectTo);
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Garder ma session ouverte
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion en cours...' : 'Me connecter'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}
