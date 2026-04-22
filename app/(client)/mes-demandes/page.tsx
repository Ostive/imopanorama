'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useContacts } from '@/features/contacts/context/ContactsContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  EnvelopeIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  isRead: boolean;
  propertyId: string | null;
  property: {
    id: string;
    title: string;
    city: string;
    price: number;
    images: string[];
  } | null;
}

export default function MesDemandesPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { refreshContactsCount } = useContacts();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch('/api/contacts/user');
        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts || []);
        } else {
          setError('Erreur lors du chargement des demandes');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Erreur lors du chargement des demandes');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [isAuthenticated]);

  const openDeleteModal = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      const response = await fetch(`/api/contacts/${contactToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== contactToDelete));
        toast.success('Demande supprimée');
        // Refresh contacts count in navbar
        await refreshContactsCount();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      closeDeleteModal();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mr-4"></div>
                <div>
                  <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-80"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Cards Skeleton */}
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 mr-4 shadow-lg"
              >
                <EnvelopeSolidIcon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mes Demandes
                </h1>
                <p className="text-gray-600 mt-1">
                  Historique de vos demandes de contact
                </p>
              </div>
            </div>
            
            {contacts.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl shadow-lg px-6 py-3 border-2 border-blue-200"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{contacts.length}</div>
                  <div className="text-xs text-gray-600 font-medium">
                    {contacts.length === 1 ? 'Demande' : 'Demandes'}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 mb-12 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white rounded-2xl p-4 mr-6 shadow-md">
                <EnvelopeSolidIcon className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Bonjour {user?.firstName} ! 👋
                </h2>
                <p className="text-gray-700 text-lg">
                  {contacts.length === 0 
                    ? "Vous n'avez pas encore fait de demande"
                    : `Vous avez ${contacts.length} demande${contacts.length !== 1 ? 's' : ''} enregistrée${contacts.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            
            {contacts.length > 0 && (
              <Link
                href="/proprietes"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors font-semibold text-gray-700 shadow-md"
              >
                <SparklesIcon className="w-5 h-5" />
                Découvrir plus
              </Link>
            )}
          </div>
        </motion.div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Property Image */}
                    {contact.property && (
                      <Link 
                        href={`/proprietes/${contact.propertyId}`}
                        className="lg:w-64 h-48 relative rounded-2xl overflow-hidden group flex-shrink-0"
                      >
                        <Image
                          src={contact.property.images[0] || 'https://via.placeholder.com/400x300'}
                          alt={contact.property.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-semibold text-sm">Voir la propriété</p>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Contact Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          {contact.property && (
                            <Link 
                              href={`/proprietes/${contact.propertyId}`}
                              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {contact.property.title}
                            </Link>
                          )}
                          {!contact.property && (
                            <h3 className="text-xl font-bold text-gray-900">Demande générale</h3>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {formatDate(contact.createdAt)}
                            </div>
                            {contact.property && (
                              <>
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  {contact.property.city}
                                </div>
                                <div className="font-semibold text-primary-600">
                                  {formatPrice(contact.property.price)}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            contact.isRead 
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {contact.isRead ? (
                              <>
                                <CheckCircleIcon className="h-4 w-4" />
                                Lue
                              </>
                            ) : (
                              <>
                                <ClockIcon className="h-4 w-4" />
                                En attente
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Votre message :</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {contact.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {contact.property && (
                          <Link
                            href={`/proprietes/${contact.propertyId}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors font-medium text-sm"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Voir la propriété
                          </Link>
                        )}
                        
                        <button
                          onClick={() => openDeleteModal(contact.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium text-sm"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-16 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-full p-8 inline-block mb-6">
                <EnvelopeIcon className="h-20 w-20 text-blue-400" />
              </div>
            </motion.div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Aucune demande pour le moment
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Vous n'avez pas encore contacté de propriétaires. 
              Parcourez nos propriétés et envoyez une demande d'information !
            </p>
            
            <Link
              href="/proprietes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <SparklesIcon className="w-6 h-6" />
              Découvrir nos propriétés
            </Link>
            
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 text-left mt-12 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="bg-blue-500 rounded-xl p-3 mr-4">
                  <ExclamationCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-900 mb-2 text-lg">Comment contacter un propriétaire ?</p>
                  <p className="text-blue-700">
                    Sur chaque fiche propriété, utilisez le formulaire de contact pour envoyer votre demande. 
                    Vous pourrez ensuite suivre toutes vos demandes ici.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Action */}
        {contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex justify-center"
          >
            <Link
              href="/proprietes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 shadow-lg text-base font-semibold rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all"
            >
              <SparklesIcon className="h-5 w-5" />
              Découvrir nos propriétés
            </Link>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeDeleteModal}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-red-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <ExclamationCircleIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Confirmer la suppression</h2>
                        <p className="text-red-100 text-sm">Cette action est irréversible</p>
                      </div>
                    </div>
                    <button
                      onClick={closeDeleteModal}
                      className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 text-lg mb-6">
                    Êtes-vous sûr de vouloir supprimer cette demande ? Vous ne pourrez pas récupérer cette information.
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={closeDeleteModal}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
