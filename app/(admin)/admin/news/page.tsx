'use client';

import { Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { m } from 'framer-motion';
import Link from 'next/link';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useNews } from '@/features/news/hooks/useNews';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  NewspaperIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { StatsCard } from '../components/StatsCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { AdminTablePagination } from '../components/AdminTablePagination';
import { CheckboxDropdown } from '../components/CheckboxDropdown';

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const columnHelper = createColumnHelper<NewsItem>();

const CATEGORY_COLORS: Record<string, string> = {
  IMMOBILIER: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300',
  CONSTRUCTION: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  EVENEMENT: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  ENTREPRISE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
};

function NewsAdminPageContent() {
  const urlParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = urlParams.get('category');
    return c ? [c] : [];
  });
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const s = urlParams.get('isPublished');
    return s !== null ? [s] : [];
  });
  const [searchInput, setSearchInput] = useState(() => urlParams.get('search') || '');
  const [searchParams, setSearchParams] = useState({
    page: parseInt(urlParams.get('page') || '1'),
    limit: parseInt(urlParams.get('limit') || '10'),
    category: urlParams.get('category') || '',
    isPublished: urlParams.get('isPublished') !== null
      ? urlParams.get('isPublished') === 'true'
      : undefined as boolean | undefined,
    search: urlParams.get('search') || '',
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync URL → searchParams (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      category: selectedCategories.length >= 1 ? selectedCategories[0] : '',
      isPublished: selectedStatuses.length === 1
        ? selectedStatuses[0] === 'true'
        : undefined,
      page: 1,
    }));
  }, [selectedCategories, selectedStatuses]);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.isPublished !== undefined) params.set('isPublished', String(searchParams.isPublished));
    if (searchParams.page > 1) params.set('page', String(searchParams.page));
    if (searchParams.limit !== 10) params.set('limit', String(searchParams.limit));
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [searchParams]);

  const { news, loading, isFetching, total, error, refetch } = useNews(searchParams);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/news/${id}`, { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
      await refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  }, [refetch]);

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Titre',
      cell: info => (
        <div className="max-w-md">
          <p className="font-medium text-foreground truncate">{info.getValue()}</p>
          <p className="text-sm text-muted-foreground truncate">{info.row.original.slug}</p>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Catégorie',
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[info.getValue()] || 'bg-muted text-foreground'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('isPublished', {
      header: 'Statut',
      cell: info => info.getValue() ? (
        <span className="flex items-center text-green-600 dark:text-green-400"><CheckCircleIcon className="w-4 h-4 mr-1" />Publié</span>
      ) : (
        <span className="flex items-center text-amber-600 dark:text-amber-400"><ClockIcon className="w-4 h-4 mr-1" />Brouillon</span>
      ),
    }),
    columnHelper.accessor('publishedAt', {
      header: 'Date de publication',
      cell: info => info.getValue() ? new Date(info.getValue()!).toLocaleDateString('fr-FR') : '-',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <div className="hidden md:flex items-center gap-2">
            <Link href={`/actualites/${row.original.slug}`} target="_blank" aria-label={`Voir ${row.original.title}`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Voir">
              <EyeIcon className="h-5 w-5" />
            </Link>
            <Link href={`/admin/news/${row.original.id}/edit`} aria-label={`Modifier ${row.original.title}`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Modifier">
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button type="button" onClick={() => handleDelete(row.original.id)} aria-label={`Supprimer ${row.original.title}`} className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="md:hidden flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger aria-label={`Actions pour ${row.original.title}`} className="p-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/actualites/${row.original.slug}`} target="_blank" className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <EyeIcon className="h-4 w-4" />Voir
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/news/${row.original.id}/edit`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <PencilIcon className="h-4 w-4" />Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <TrashIcon className="h-4 w-4" />Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ),
    }),
  ], [handleDelete]);

  const table = useReactTable({
    data: news,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / searchParams.limit),
  });

  const totalPages = Math.ceil(total / searchParams.limit);
  const hasActiveFilters = searchInput || selectedCategories.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <NewspaperIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
                  Gestion des Actualités
                </h1>
                {isFetching && <Skeleton className="h-4 w-24" />}
              </div>
              <p className="text-muted-foreground font-medium mt-1">Gérez les actualités de votre site web</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="inline-flex items-center px-4 py-2 text-foreground bg-card hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all border border-border shadow-sm">
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Retour
            </Link>
            <Link href="/admin/news/new">
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center px-6 py-2 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                <PlusIcon className="h-5 w-5 mr-2" /> Nouvelle actualité
              </m.div>
            </Link>
          </div>
        </m.div>

        {/* Error Banners */}
        {(error || deleteError) && (
          <div className="mb-6 space-y-4">
            {error && <ErrorAlert title="Erreur de chargement" message={error} onClose={() => window.location.reload()} onRetry={refetch} />}
            {deleteError && <ErrorAlert title="Erreur de suppression" message={deleteError} onClose={() => setDeleteError(null)} />}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total" value={total} subtitle="Actualités" icon={<NewspaperIcon className="w-7 h-7" />} color="blue" />
          <StatsCard title="Publiées" value={news.filter(n => n.isPublished).length} subtitle="En ligne" icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.05} />
          <StatsCard title="Brouillons" value={news.filter(n => !n.isPublished).length} subtitle="En attente" icon={<ClockIcon className="w-7 h-7" />} color="amber" delay={0.1} />
        </div>

        {/* Filters */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
              {hasActiveFilters && <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">Actifs</span>}
            </div>
            {hasActiveFilters && (
              <button type="button" onClick={() => { setSearchInput(''); setSelectedCategories([]); setSelectedStatuses([]); }}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
                <XMarkIcon className="h-4 w-4" />Réinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Titre, slug..." aria-label="Rechercher une actualité"
                className="w-full pl-10 pr-10 h-10 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} aria-label="Effacer la recherche" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <CheckboxDropdown
              label="Catégorie"
              selected={selectedCategories}
              onChange={setSelectedCategories}
              options={[
                { value: 'IMMOBILIER', label: 'Immobilier' },
                { value: 'CONSTRUCTION', label: 'Construction' },
                { value: 'EVENEMENT', label: 'Événement' },
                { value: 'ENTREPRISE', label: 'Entreprise' },
              ]}
            />
            <CheckboxDropdown
              label="Statut"
              selected={selectedStatuses}
              onChange={setSelectedStatuses}
              options={[
                { value: 'true', label: 'Publié' },
                { value: 'false', label: 'Brouillon' },
              ]}
            />
          </div>
        </m.div>

        {/* Table */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {loading ? (
                <tbody aria-hidden="true" className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="animate-pulse" aria-label="Chargement">
                      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48 mb-2" aria-label="Chargement"></div><div className="h-3 bg-muted rounded w-32" aria-label="Chargement"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-muted rounded-full w-24" aria-label="Chargement"></div></td>
                      <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-20" aria-label="Chargement"></div></td>
                      <td className="px-6 py-4"><div className="h-3 bg-muted rounded w-28" aria-label="Chargement"></div></td>
                      <td className="px-6 py-4"><div className="flex items-center space-x-2" aria-label="Chargement"><div className="h-8 w-8 bg-muted rounded" aria-label="Chargement"></div><div className="h-8 w-8 bg-muted rounded" aria-label="Chargement"></div><div className="h-8 w-8 bg-muted rounded" aria-label="Chargement"></div></div></td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">Aucune actualité trouvée</td></tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>
          <AdminTablePagination
            page={searchParams.page}
            limit={searchParams.limit}
            total={total}
            totalPages={totalPages}
            onPageChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
            onLimitChange={(limit) => setSearchParams(prev => ({ ...prev, limit, page: 1 }))}
          />
        </m.div>

      </div>
    </div>
  );
}

export default function NewsAdminPage() {
  return (
    <Suspense fallback={null}>
      <NewsAdminPageContent />
    </Suspense>
  );
}
