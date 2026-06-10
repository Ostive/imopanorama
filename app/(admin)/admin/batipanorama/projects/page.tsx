'use client'

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { CheckboxDropdown } from '../../components/CheckboxDropdown';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  surface?: number;
  duration?: string;
  budget?: string;
  images: string[];
  coverImage?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED';
  isPublished: boolean;
  order: number;
  createdAt: string;
}

const statusOptions = [
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'PLANNED', label: 'Planifié' }
];

function BatiProjectsPageContent() {
  const urlParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const s = urlParams.get('status');
    return s ? [s] : [];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = urlParams.get('category');
    return c ? [c] : [];
  });
  const [searchInput, setSearchInput] = useState(() => urlParams.get('search') || '');
  const [page, setPage] = useState(() => parseInt(urlParams.get('page') || '1'));
  const [limit, setLimit] = useState(() => parseInt(urlParams.get('limit') || '10'));
  const [goToInput, setGoToInput] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean, projectId: string | null, projectTitle: string }>({ show: false, projectId: null, projectTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const searchParams = useMemo(() => ({
    page,
    limit,
    status: selectedStatuses.length >= 1 ? selectedStatuses[0] : '',
    category: selectedCategories.length >= 1 ? selectedCategories[0] : '',
    search: searchInput,
  }), [page, limit, selectedStatuses, selectedCategories, searchInput]);

  // Sync searchParams → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.page > 1) params.set('page', searchParams.page.toString());
    if (searchParams.limit !== 10) params.set('limit', searchParams.limit.toString());
    if (searchParams.status) params.set('status', searchParams.status);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.search) params.set('search', searchParams.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    if (newUrl !== window.location.search) {
      window.history.replaceState(null, '', `/admin/batipanorama/projects${newUrl}`);
    }
  }, [searchParams]);

  const projectsQueryKey = ['bati-projects', searchParams] as const;
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: projectsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', searchParams.page.toString());
      params.set('limit', searchParams.limit.toString());
      if (searchParams.status) params.set('status', searchParams.status);
      if (searchParams.category) params.set('category', searchParams.category);
      if (searchParams.search) params.set('search', searchParams.search);
      
      const response = await fetch(`/api/bati-projects?${params.toString()}`);
      const data = await response.json();
      if (!data.success) throw new Error('Erreur lors du chargement des projets');
      return data.projects;
    },
  });

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setLimit(limit);
    setPage(1);
  }, []);

  const handleGoToChange = useCallback((value: string) => {
    setGoToInput(value);
  }, []);

  const handleGoToSubmit = useCallback((value: string) => {
    const page = parseInt(value);
    if (!isNaN(page) && page > 0) {
      handlePageChange(page);
      setGoToInput('');
    }
  }, [handlePageChange]);

  const openDeleteModal = (project: Project) => {
    setDeleteModal({ show: true, projectId: project.id, projectTitle: project.title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, projectId: null, projectTitle: '' });
  };

  const confirmDelete = async () => {
    if (!deleteModal.projectId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/bati-projects/${deleteModal.projectId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        queryClient.setQueryData<Project[]>(projectsQueryKey, (prev = []) =>
          prev.filter(p => p.id !== deleteModal.projectId)
        );
        showNotification('success', 'Projet supprimé avec succès');
        closeDeleteModal();
      } else {
        showNotification('error', data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification('error', 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const badges = {
      COMPLETED: { label: 'Terminé', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', icon: CheckCircleIcon },
      IN_PROGRESS: { label: 'En cours', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', icon: ClockIcon },
      PLANNED: { label: 'Planifié', color: 'bg-muted text-gray-800 dark:text-gray-300', icon: ClockIcon },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    );
  };

  const getPublicationBadge = (isPublished: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-muted text-gray-800 dark:text-gray-300'
      }`}>
        {isPublished ? 'Publié' : 'Brouillon'}
      </span>
    );
  };

  // Filter data based on current filters
  const filteredProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return [];
    return projects.filter((project) => {
      const matchesStatus = !searchParams.status || project.status === searchParams.status;
      const matchesCategory = !searchParams.category || project.category === searchParams.category;
      const matchesSearch = !searchParams.search || 
        project.title.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        project.description.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        project.location.toLowerCase().includes(searchParams.search.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, searchParams]);


  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    if (!projects || !Array.isArray(projects)) return [];
    const cats = [...new Set(projects.map(p => p.category))];
    return cats.sort();
  }, [projects]);

  // Category options for filter
  const categoryOptions = uniqueCategories.map(cat => ({ value: cat, label: cat }));

  // Mock pagination data (should come from API)
  const totalProjects = filteredProjects?.length || 0; // This should come from API response
  const totalPages = Math.ceil(totalProjects / searchParams.limit);

  // Get paginated data for display
  const paginatedProjects = useMemo(() => {
    if (!filteredProjects || !Array.isArray(filteredProjects)) return [];
    const startIndex = (searchParams.page - 1) * searchParams.limit;
    const endIndex = startIndex + searchParams.limit;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, searchParams.page, searchParams.limit]);

  // Clear filters handler
  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setPage(1);
    setLimit(10);
  }, []);

  const hasActiveFilters = searchParams.search || searchParams.status || searchParams.category;


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      {/* Notification Toast */}
      {notification && (
        <m.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-semibold">{notification.message}</span>
        </m.div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeDeleteModal}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Supprimer le projet</h3>
                <p className="text-sm text-gray-600 mt-1">Cette action est irréversible</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                Êtes-vous sûr de vouloir supprimer le projet <span className="font-bold text-gray-900">&quot;{deleteModal.projectTitle}&quot;</span> ?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Toutes les données associées seront définitivement perdues.
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-5 h-5" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </m.div>
        </m.div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminPageHeader
          icon={<BuildingOffice2Icon className="w-6 h-6 text-white" />}
          title="Nos Réalisations"
          subtitle="Découvrez quelques-uns de nos projets récents qui témoignent de notre expertise"
          showBackButton
          backHref="/admin/batipanorama"
          actions={
            <Link
              href="/admin/batipanorama/projects/new"
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Nouveau projet
            </Link>
          }
        />

        {/* Filters */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                placeholder="Rechercher un projet..."
                aria-label="Rechercher un projet"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <CheckboxDropdown
              label="Statut"
              options={statusOptions}
              selected={selectedStatuses}
              onChange={(values) => { setSelectedStatuses(values); setPage(1); }}
            />

            {/* Category Filter */}
            <CheckboxDropdown
              label="Catégorie"
              options={categoryOptions}
              selected={selectedCategories}
              onChange={(values) => { setSelectedCategories(values); setPage(1); }}
            />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {totalProjects} projet{totalProjects !== 1 ? 's' : ''} trouvé{totalProjects !== 1 ? 's' : ''}
          </div>
        </m.div>

        {/* Data Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <table className="w-full" aria-hidden="true">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <th key={i} className="px-6 py-3" aria-label="Chargement">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" aria-label="Chargement"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse" aria-label="Chargement">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg" aria-label="Chargement"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" aria-label="Chargement"></div>
                      <div className="h-3 bg-gray-200 rounded w-48" aria-label="Chargement"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20" aria-label="Chargement"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 rounded w-24" aria-label="Chargement"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2" aria-label="Chargement">
                        <div className="h-8 w-8 bg-gray-200 rounded" aria-label="Chargement"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded" aria-label="Chargement"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded" aria-label="Chargement"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : projects.length === 0 ? (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
          >
            <BuildingOffice2Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre premier projet</p>
            <Link
              href="/admin/batipanorama/projects/new"
              className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Créer un projet
            </Link>
          </m.div>
        ) : (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Localisation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Publication</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {project.coverImage ? (
                              <Image
                                src={project.coverImage}
                                alt={project.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <BuildingOffice2Icon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 line-clamp-1">{project.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getPublicationBadge(project.isPublished)}
                      </td>
                      <td className="px-6 py-4">
                        {/* Desktop - show all buttons */}
                        <div className="hidden md:flex items-center gap-2">
                          <Link
                            href={`/admin/batipanorama/projects/${project.id}`}
                            aria-label={`Voir ${project.title}`}
                            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/batipanorama/projects/${project.id}/edit`}
                            aria-label={`Modifier ${project.title}`}
                            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button type="button"
                            onClick={() => openDeleteModal(project)}
                            aria-label={`Supprimer ${project.title}`}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Mobile - show dropdown menu */}
                        <div className="md:hidden flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger aria-label={`Actions pour ${project.title}`} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/batipanorama/projects/${project.id}`}
                                  className="flex items-center gap-2 text-primary-600"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/batipanorama/projects/${project.id}/edit`}
                                  className="flex items-center gap-2 text-primary-600"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(project)}
                                className="flex items-center gap-2 text-red-600"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advanced Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Afficher</span>
                <Select value={searchParams.limit.toString()} onValueChange={(v) => handleLimitChange(Number(v))}>
                  <SelectTrigger className="w-20 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">sur {totalProjects} résultat{totalProjects > 1 ? 's' : ''}</span>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handlePageChange(Math.max(1, searchParams.page - 1))} disabled={searchParams.page === 1} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = searchParams.page <= 3 ? i + 1 : searchParams.page - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <button type="button"
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === searchParams.page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button type="button" onClick={() => handlePageChange(Math.min(totalPages, searchParams.page + 1))} disabled={searchParams.page === totalPages} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Suivant
                  </button>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-700">Aller à:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={goToInput}
                      onChange={(e) => handleGoToChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGoToSubmit(goToInput)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={searchParams.page.toString()}
                      aria-label="Aller à la page"
                    />
                    <button type="button"
                      onClick={() => handleGoToSubmit(goToInput)}
                      className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700 transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        )}
      </div>
    </div>
  );
}

export default function BatiProjectsPage() {
  return (
    <Suspense fallback={null}>
      <BatiProjectsPageContent />
    </Suspense>
  );
}
