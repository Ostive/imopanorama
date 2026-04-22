'use client'

import { useState } from 'react';
import { ProfileUpdateData } from '@/features/auth/schemas/auth.schema';

interface ProfileFormProps {
  initialData: ProfileUpdateData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
  loading?: boolean;
}

export default function ProfileForm({ initialData, onSubmit, loading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    phone: initialData.phone || '',
    company: initialData.company || ''
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
    
    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du profil');
      console.error('Erreur mise à jour profil:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations personnelles
      </h3>
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          Profil mis à jour avec succès !
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+261 34 XX XX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise
          </label>
          <input
            type="text"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </div>
      </form>
    </div>
  );
}
