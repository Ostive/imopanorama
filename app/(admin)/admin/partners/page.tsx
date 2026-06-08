'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageSkeleton } from '@/shared/components/loading';
import Image from 'next/image';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { ImageUploader } from '@/features/upload/components/ImageUploader';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

type Partner = {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    order: 0,
    isActive: true
  });

  // Charger les partenaires
  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/partners', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des partenaires');
      }
      
      const data = await response.json();
      setPartners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Ouvrir le modal pour ajouter/éditer
  const openModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        logo: partner.logo,
        website: partner.website || '',
        description: partner.description || '',
        order: partner.order,
        isActive: partner.isActive
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        logo: '',
        website: '',
        description: '',
        order: partners.length,
        isActive: true
      });
    }
    setShowModal(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setEditingPartner(null);
    setFormData({
      name: '',
      logo: '',
      website: '',
      description: '',
      order: 0,
      isActive: true
    });
  };

  // Sauvegarder le partenaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPartner 
        ? `/api/admin/partners/${editingPartner.id}`
        : '/api/admin/partners';
      
      const method = editingPartner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      await fetchPartners();
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Supprimer un partenaire
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">Gestion des Partenaires</h1>
              <p className="text-gray-600 font-medium mt-1">Gérez les logos des partenaires affichés sur le site</p>
            </div>
          </div>
          <button type="button"
            onClick={() => openModal()}
            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un partenaire
          </button>
        </motion.div>

        {/* Liste des partenaires */}
        {isLoading ? (
          <PageSkeleton />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="relative h-32 mb-4 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">{partner.name}</h3>
                
                {partner.website && (
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-2"
                  >
                    <GlobeAltIcon className="h-4 w-4" />
                    Site web
                  </a>
                )}
                
                {partner.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{partner.description}</p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {partner.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircleIcon className="h-3 w-3" />
                        Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <XCircleIcon className="h-3 w-3" />
                        Inactif
                      </span>
                    )}
                    <span className="text-xs text-gray-500">Ordre: {partner.order}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => openModal(partner)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button type="button"
                      onClick={() => handleDelete(partner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPartner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du partenaire <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo <span className="text-red-500">*</span>
                  </label>
                  <ImageUploader
                    onImageUploaded={(url) => setFormData({ ...formData, logo: url })}
                    initialImage={formData.logo}
                    directory="/partners/"
                    label="Télécharger le logo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Description courte du partenaire"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre d&apos;affichage
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <Select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg"
                  >
                    {editingPartner ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
