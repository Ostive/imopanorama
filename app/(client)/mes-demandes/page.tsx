'use client'

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useContacts } from '@/features/contacts/context/ContactsContext';
import { useRouter } from 'next/navigation';
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
import { formatPrice } from '@/shared/utils';

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
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  const { data: contactsData, isLoading: loading, error: contactsError } = useQuery({
    queryKey: ['user-contacts'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/contacts/user');
      if (!response.ok) throw new Error('Erreur lors du chargement des demandes');
      return response.json();
    },
  });

  useEffect(() => {
    if (contactsData) setContacts(contactsData.contacts || []);
    if (contactsError) setError('Erreur lors du chargement des demandes');
  }, [contactsData, contactsError]);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-muted rounded-2xl mr-4"></div>
                <div>
                  <div className="h-10 bg-muted rounded w-64 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-80"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Cards Skeleton */}
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded w-48 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-muted rounded-full w-24"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="h-4 bg-muted rounded w-40"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div
                className="bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl p-4 mr-4 shadow-lg"
              >
                <EnvelopeSolidIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                  Mes Demandes
                </h1>
                <p className="text-muted-foreground mt-1">
                  Historique de vos demandes de contact
                </p>
              </div>
            </div>

            {contacts.length > 0 && (
              <div
                className="bg-card rounded-2xl shadow-lg px-6 py-3 border-2 border-primary-200 dark:border-primary-800"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{contacts.length}</div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {contacts.length === 1 ? 'Demande' : 'Demandes'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Card */}
        <div
          className="bg-linear-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 rounded-3xl shadow-xl p-8 mb-12 border border-primary-100 dark:border-primary-900/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-card rounded-2xl p-4 mr-6 shadow-md">
                <EnvelopeSolidIcon className="h-10 w-10 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Bonjour {user?.firstName} ! 👋
                </h2>
                <p className="text-foreground text-lg">
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
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-card hover:bg-muted rounded-xl transition-colors font-semibold text-foreground shadow-md"
              >
                <SparklesIcon className="w-5 h-5" />
                Découvrir plus
              </Link>
            )}
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                className="bg-card rounded-3xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow"
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
                              className="text-xl font-bold text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {contact.property.title}
                            </Link>
                          )}
                          {!contact.property && (
                            <h3 className="text-xl font-bold text-foreground">Demande générale</h3>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
                                <div className="font-semibold text-primary-600 dark:text-primary-400">
                                  {formatPrice(contact.property.price)}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            contact.isRead
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
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
                      <div className="bg-muted/50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-foreground mb-2">Votre message :</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {contact.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {contact.property && (
                          <Link
                            href={`/proprietes/${contact.propertyId}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-300 rounded-xl transition-colors font-medium text-sm"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Voir la propriété
                          </Link>
                        )}

                        <button type="button"
                          onClick={() => openDeleteModal(contact.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors font-medium text-sm"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="bg-card rounded-3xl shadow-xl p-16 text-center"
          >
            <div
              className="mb-8"
            >
              <div className="bg-linear-to-br from-primary-100 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/30 rounded-full p-8 inline-block mb-6">
                <EnvelopeIcon className="h-20 w-20 text-primary-400 dark:text-primary-300" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-foreground mb-4">
              Aucune demande pour le moment
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Vous n'avez pas encore contacté de propriétaires. 
              Parcourez nos propriétés et envoyez une demande d'information !
            </p>
            
            <Link
              href="/proprietes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <SparklesIcon className="w-6 h-6" />
              Découvrir nos propriétés
            </Link>
            
            <div className="bg-linear-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-6 text-left mt-12 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="bg-primary-500 rounded-xl p-3 mr-4">
                  <ExclamationCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-primary-900 dark:text-primary-200 mb-2 text-lg">Comment contacter un propriétaire ?</p>
                  <p className="text-primary-700 dark:text-primary-300">
                    Sur chaque fiche propriété, utilisez le formulaire de contact pour envoyer votre demande. 
                    Vous pourrez ensuite suivre toutes vos demandes ici.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action */}
        {contacts.length > 0 && (
          <div
            className="mt-16 flex justify-center"
          >
            <Link
              href="/proprietes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card border-2 border-border shadow-lg text-base font-semibold rounded-xl text-foreground hover:bg-muted hover:shadow-xl transition-all"
            >
              <SparklesIcon className="h-5 w-5" />
              Découvrir nos propriétés
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        
          {deleteModalOpen && (
            <div aria-hidden="true" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeDeleteModal}>
              <div
                className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden max-w-md w-full"
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
                    <button type="button"
                      onClick={closeDeleteModal}
                      className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-foreground text-lg mb-6">
                    Êtes-vous sûr de vouloir supprimer cette demande ? Vous ne pourrez pas récupérer cette information.
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button type="button"
                      onClick={closeDeleteModal}
                      className="flex-1 px-4 py-3 bg-muted hover:bg-muted-foreground/10 text-foreground rounded-xl transition-colors font-semibold"
                    >
                      Annuler
                    </button>
                    <button type="button"
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}
