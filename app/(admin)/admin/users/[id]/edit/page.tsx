'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import toast from 'react-hot-toast';
import { FormSkeleton } from '@/shared/components/loading';

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true,
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/${id}`);

        if (!response.ok) {
          throw new Error('Utilisateur introuvable');
        }

        const data = await response.json();
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        setFormData({
          name: fullName || data.email || '',
          email: data.email || '',
          phone: data.phone || '',
          role: (data.role || 'USER').toLowerCase(),
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      toast.success('Utilisateur mis à jour avec succès');
      router.push('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormSkeleton fields={6} />
        </div>
      </div>
    );
  }

  if (error && !formData.email) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Erreur: {error}
          </div>
          <Link
            href="/admin/users"
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-primary-600 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                Modifier l'utilisateur
              </h1>
              <p className="mt-1 text-gray-600 font-medium">
                Mettez à jour les informations de l'utilisateur
              </p>
            </div>
          </div>

          <Link
            href="/admin/users"
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour à la liste
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
                placeholder="Jean Dupont"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
                placeholder="jean.dupont@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <PhoneIcon className="w-4 h-4 inline mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="+261 34 XX XX XX XX"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                Rôle <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Compte actif
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/admin/users"
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
