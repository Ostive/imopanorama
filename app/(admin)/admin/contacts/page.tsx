'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  HomeModernIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon,
  BuildingOffice2Icon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AdminPageHeader, StatsCard, ConfirmDeleteModal, AdminTablePagination, CheckboxDropdown } from '../components';

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  propertyId?: string;
  property?: {
    id: string;
    title: string;
    city: string;
    price: number;
  } | null;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
};

export default function ContactsPage() {
  const router = useRouter();
  const urlParams = useSearchParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => urlParams.get('search') || '');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const s = urlParams.get('status'); return s ? [s] : [];
  });
  const [limit, setLimit] = useState(() => parseInt(urlParams.get('limit') || '15'));
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => parseInt(urlParams.get('page') || '1'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    fetch('/api/contacts')
      .then((r) => r.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setFilteredContacts(data.contacts || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let filtered = contacts;
    const status = selectedStatuses.length === 1 ? selectedStatuses[0] : 'all';
    if (status !== 'all') {
      filtered = filtered.filter((c) => (status === 'read' ? c.isRead : !c.isRead));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.property?.title.toLowerCase().includes(q) ||
          c.property?.city.toLowerCase().includes(q)
      );
    }
    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [contacts, selectedStatuses, searchTerm]);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedStatuses.length === 1) params.set('status', selectedStatuses[0]);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (limit !== 15) params.set('limit', String(limit));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }, [searchTerm, selectedStatuses, currentPage, limit, router]);

  const totalPages = Math.ceil(filteredContacts.length / limit);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const markAsRead = async (contactId: string) => {
    if (markingAsRead.has(contactId)) return;
    setMarkingAsRead((prev) => new Set(prev).add(contactId));
    try {
      const res = await fetch(`/api/contacts/${contactId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, isRead: true } : c)));
        if (selectedContact?.id === contactId) {
          setSelectedContact((prev) => (prev ? { ...prev, isRead: true } : null));
        }
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
    } finally {
      setTimeout(() => {
        setMarkingAsRead((prev) => { const n = new Set(prev); n.delete(contactId); return n; });
      }, 1000);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      const res = await fetch(`/api/contacts/${contactToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
        if (selectedContact?.id === contactToDelete) {
          setSelectedContact(null);
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  const stats = {
    total: contacts.length,
    unread: contacts.filter((c) => !c.isRead).length,
    read: contacts.filter((c) => c.isRead).length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />}
          title="Messages des Clients"
          subtitle="Gérez les demandes d'information sur les terrains"
          showBackButton
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-14"></div>
                  </div>
                  <div className="w-14 h-14 bg-gray-100 rounded-xl"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <StatsCard title="Total Messages" value={stats.total} icon={<ChatBubbleLeftRightIcon className="w-7 h-7" />} color="blue" />
              <StatsCard title="Non lus" value={stats.unread} subtitle={stats.unread > 0 ? 'Nécessite une action' : undefined} icon={<EnvelopeIcon className="w-7 h-7" />} color="amber" delay={0.05} />
              <StatsCard title="Traités" value={stats.read} icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.1} />
            </>
          )}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              {(searchTerm || selectedStatuses.length > 0) && <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">Actifs</span>}
            </div>
            {(searchTerm || selectedStatuses.length > 0) && (
              <button onClick={() => { setSearchTerm(''); setSelectedStatuses([]); }}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
                <XMarkIcon className="h-4 w-4" />Réinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nom, email, terrain..."
                className="w-full pl-10 pr-10 h-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <CheckboxDropdown
              label="Statut"
              selected={selectedStatuses}
              onChange={setSelectedStatuses}
              options={[
                { value: 'unread', label: 'Non lus' },
                { value: 'read', label: 'Lus' },
              ]}
            />
          </div>
        </motion.div>

        {/* Contacts List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun message trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  onClick={() => {
                    setSelectedContact(contact);
                    setIsModalOpen(true);
                    if (!contact.isRead) markAsRead(contact.id);
                  }}
                  className={`group p-4 sm:p-6 cursor-pointer transition-all border-l-4 ${
                    !contact.isRead ? 'border-l-blue-500 bg-blue-50/10' : 'border-l-transparent hover:border-l-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm transition-transform group-hover:scale-105 ${
                      !contact.isRead ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {contact.firstName[0]}{contact.lastName[0]}
                      {!contact.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      <div className="lg:col-span-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-base font-bold truncate ${!contact.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {contact.firstName} {contact.lastName}
                          </h3>
                          {!contact.isRead && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Nouveau</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className={contact.isRead ? '' : 'text-blue-600 font-medium'}>{contact.email}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-6 hidden sm:block">
                        <p className={`text-sm truncate ${!contact.isRead ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {contact.message}
                        </p>
                        {contact.property && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                            <BuildingOffice2Icon className="w-3.5 h-3.5 text-gray-400" />
                            <span>Intéressé par : <span className="font-medium text-gray-700">{contact.property.title}</span></span>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-2 flex justify-end">
                        <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AdminTablePagination
            page={currentPage}
            limit={limit}
            total={filteredContacts.length}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onLimitChange={(l) => { setLimit(l); setCurrentPage(1); }}
          />
        </div>

        {/* Contact Detail Modal */}
        {isModalOpen && selectedContact && (() => {
          const c = contacts.find((x) => x.id === selectedContact.id) || selectedContact;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-linear-to-r from-primary-600 to-indigo-700 px-6 py-6 sm:px-8 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg border-2 border-white/20 ${
                        !c.isRead ? 'bg-white text-primary-600' : 'bg-indigo-800 text-white'
                      }`}>
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white leading-tight">{c.firstName} {c.lastName}</h2>
                        <p className="text-indigo-100 text-sm mt-0.5 font-medium">{c.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition-colors focus:outline-none"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <span className="sr-only">Fermer</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Statut du message</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full shadow-sm ${c.isRead ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
                        <span className={`font-bold text-sm ${c.isRead ? 'text-green-700' : 'text-blue-700'}`}>
                          {c.isRead ? 'Lu & Traité' : 'Nouveau message'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date de réception</p>
                      <p className="font-semibold text-gray-900 mt-1 text-sm flex items-center gap-1.5 justify-end">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        {new Date(c.createdAt).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-primary-600" /> Coordonnées
                      </h4>
                      <div className="space-y-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <a href={`mailto:${c.email}`} className="text-sm font-semibold text-primary-600 hover:underline truncate block">{c.email}</a>
                          </div>
                        </div>
                        {c.phone && (
                          <div className="flex items-start pt-3 border-t border-gray-50">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-3" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                              <a href={`tel:${c.phone}`} className="text-sm font-semibold text-gray-700 hover:text-gray-900">{c.phone}</a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BuildingOffice2Icon className="w-4 h-4 text-primary-600" /> Contexte
                      </h4>
                      {c.property ? (
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                          <div className="p-4 flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Intéressé par</p>
                            <h5 className="font-bold text-gray-900 mt-1 line-clamp-2">{c.property.title}</h5>
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1.5">
                              <MapPinIcon className="w-3.5 h-3.5" /> {c.property.city}
                            </p>
                          </div>
                          <a
                            href={`/proprietes/${c.property.id}`}
                            target="_blank"
                            className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 text-xs font-bold text-primary-600 hover:text-primary-700 hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
                          >
                            Voir la fiche <EyeIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-[100px] text-gray-400 text-sm">
                          <HomeModernIcon className="w-6 h-6 mb-1 opacity-50" />
                          <span>Aucun bien associé</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary-600" />
                      <h4 className="text-sm font-bold text-gray-900">Message complet</h4>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl text-gray-700 leading-relaxed border border-gray-100 text-sm shadow-inner min-h-[100px]">
                      {c.message}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-5 bg-gray-50 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={() => { setContactToDelete(c.id); setDeleteModalOpen(true); }}
                      className="inline-flex items-center justify-center rounded-xl bg-white border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" /> Supprimer
                    </button>
                    {!c.isRead && (
                      <button
                        onClick={() => markAsRead(c.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-white border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" /> Marquer comme lu
                      </button>
                    )}
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" /> Répondre
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          title="Supprimer le message ?"
          description="Cette action est irréversible. Le message sera définitivement effacé de la base de données."
          onConfirm={handleDelete}
          onCancel={() => { setDeleteModalOpen(false); setContactToDelete(null); }}
        />
      </div>
    </div>
  );
}
