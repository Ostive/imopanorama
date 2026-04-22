'use client'

import { useState } from 'react';
import { PasswordChangeData } from '@/features/auth/schemas/auth.schema';

interface PasswordFormProps {
  onSubmit: (data: PasswordChangeData) => Promise<void>;
  loading?: boolean;
}

export default function PasswordForm({ onSubmit, loading = false }: PasswordFormProps) {
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Une erreur est survenue lors du changement de mot de passe');
      console.error('Erreur changement mot de passe:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Changer le mot de passe
      </h3>
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          Mot de passe modifié avec succès !
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Modification en cours...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
}
