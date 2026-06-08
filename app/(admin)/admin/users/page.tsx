'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUsers } from '@/features/users/hooks/useUsers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { useReactTable, getCoreRowModel, getSortedRowModel, createColumnHelper, flexRender, SortingState } from '@tanstack/react-table';
import {
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, UserGroupIcon,
  CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, FunnelIcon,
  XMarkIcon, EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { AdminPageHeader, StatsCard, ErrorAlert, AdminTablePagination, CheckboxDropdown } from '../components';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const columnHelper = createColumnHelper<User>();

const ROLE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  ADMIN: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Admin' },
  SUPER_ADMIN: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', label: 'Super Admin' },
  AGENT: { bg: 'bg-primary-100 dark:bg-primary-900/30', text: 'text-primary-800 dark:text-primary-300', label: 'Agent' },
  CLIENT: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Client' },
};

export default function AdminUsersPage() {
  const router = useRouter();
  const urlParams = useSearchParams();

  const [selectedRoles, setSelectedRoles] = useState<string[]>(() => {
    const r = urlParams.get('role'); return r ? [r] : [];
  });
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const s = urlParams.get('isActive'); return s !== null ? [s] : [];
  });
  const [searchInput, setSearchInput] = useState(() => urlParams.get('search') || '');
  const [searchParams, setSearchParams] = useState({
    page: parseInt(urlParams.get('page') || '1'),
    limit: parseInt(urlParams.get('limit') || '10'),
    role: urlParams.get('role') || '',
    isActive: urlParams.get('isActive') !== null ? urlParams.get('isActive') === 'true' : undefined as boolean | undefined,
    search: urlParams.get('search') || '',
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { users: fetchedUsers, loading, isFetching, total, error, refetch } = useUsers(searchParams);

  const users: User[] = fetchedUsers.map((user: any) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
  }));

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchParams(prev => ({ ...prev, search: searchInput, page: 1 })), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Sync checkbox filters
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      role: selectedRoles.length >= 1 ? selectedRoles[0] : '',
      isActive: selectedStatuses.length === 1 ? selectedStatuses[0] === 'true' : undefined,
      page: 1,
    }));
  }, [selectedRoles, selectedStatuses]);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.role) params.set('role', searchParams.role);
    if (searchParams.isActive !== undefined) params.set('isActive', String(searchParams.isActive));
    if (searchParams.page > 1) params.set('page', String(searchParams.page));
    if (searchParams.limit !== 10) params.set('limit', String(searchParams.limit));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }, [searchParams, router]);

  const handleToggleStatus = useCallback(async (userId: string, currentStatus: boolean) => {
    setDeleteError(null);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || `Erreur HTTP ${response.status}`);
      }
      await refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur lors de la modification du statut');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [refetch]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    setDeleteError(null);
    try {
      const response = await fetch(`/api/admin/users?userId=${id}`, {
        method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || `Erreur HTTP ${response.status}`);
      }
      await refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [refetch]);

  const columns = useMemo(() => [
    columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
      id: 'name',
      header: 'Nom',
      cell: info => (
        <div>
          <p className="font-medium text-foreground">{info.getValue()}</p>
          <p className="text-sm text-muted-foreground">{info.row.original.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Rôle',
      cell: info => {
        const cfg = ROLE_CONFIG[info.getValue()] || { bg: 'bg-muted', text: 'text-foreground', label: info.getValue() };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>;
      },
    }),
    columnHelper.accessor('company', { header: 'Entreprise', cell: info => info.getValue() || '-' }),
    columnHelper.accessor('phone', { header: 'Téléphone', cell: info => info.getValue() || '-' }),
    columnHelper.accessor('isActive', {
      header: 'Statut',
      cell: ({ row }) => (
        <button type="button"
          onClick={() => handleToggleStatus(row.original.id, row.original.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${row.original.isActive ? 'bg-green-600 focus:ring-green-500' : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'}`}
          title={row.original.isActive ? 'Cliquez pour désactiver' : 'Cliquez pour activer'}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${row.original.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ),
    }),
    columnHelper.accessor('lastLoginAt', {
      header: 'Dernière connexion',
      cell: info => info.getValue() ? new Date(info.getValue()!).toLocaleDateString('fr-FR') : 'Jamais',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <div className="hidden md:flex items-center gap-2">
            <Link href={`/admin/users/${row.original.id}`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Voir">
              <EyeIcon className="h-5 w-5" />
            </Link>
            <Link href={`/admin/users/${row.original.id}/edit`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Modifier">
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button type="button" onClick={() => handleDelete(row.original.id)} className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="md:hidden flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 hover:bg-muted rounded-lg transition-colors">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${row.original.id}`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                    <EyeIcon className="h-4 w-4" />Voir
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${row.original.id}/edit`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
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
  ], [handleDelete, handleToggleStatus]);

  const table = useReactTable({
    data: users, columns, state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / searchParams.limit),
  });

  const totalPages = Math.ceil(total / searchParams.limit);
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;
  const hasActiveFilters = searchInput || selectedRoles.length > 0 || selectedStatuses.length > 0;

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl"></div>
              <div><div className="h-8 bg-muted rounded w-64 mb-2"></div><div className="h-4 bg-muted rounded w-48"></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="bg-card rounded-2xl p-6 shadow-lg h-24"></div>)}
            </div>
            <div className="bg-card rounded-2xl shadow-lg p-6 h-20"></div>
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden h-64"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

          <AdminPageHeader
            icon={<UserGroupIcon className="w-6 h-6 text-white" />}
            title="Gestion des Utilisateurs"
            subtitle="Gérez les utilisateurs de votre plateforme"
            showBackButton
            loading={isFetching}
            actions={
              <Link href="/admin/users/new">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center px-6 py-2 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                  <PlusIcon className="h-5 w-5 mr-2" /> Nouvel utilisateur
                </motion.div>
              </Link>
            }
          />

          {(error || deleteError) && (
            <div className="mb-6 space-y-4">
              {error && <ErrorAlert title="Erreur de chargement" message={error} onClose={() => window.location.reload()} onRetry={refetch} />}
              {deleteError && <ErrorAlert title="Erreur" message={deleteError} onClose={() => setDeleteError(null)} />}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard title="Total" value={total} subtitle="Utilisateurs" icon={<UserGroupIcon className="w-7 h-7" />} color="blue" />
            <StatsCard title="Actifs" value={activeUsers} subtitle="En ligne" icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.05} />
            <StatsCard title="Inactifs" value={inactiveUsers} subtitle="Désactivés" icon={<XCircleIcon className="w-7 h-7" />} color="red" delay={0.1} />
          </div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-lg p-6 mb-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
                {hasActiveFilters && <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">Actifs</span>}
              </div>
              {hasActiveFilters && (
                <button type="button" onClick={() => { setSearchInput(''); setSelectedRoles([]); setSelectedStatuses([]); }}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
                  <XMarkIcon className="h-4 w-4" />Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Nom, email, entreprise..."
                  className="w-full pl-10 pr-10 h-10 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                {searchInput && (
                  <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <CheckboxDropdown
                label="Rôle"
                selected={selectedRoles}
                onChange={setSelectedRoles}
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'SUPER_ADMIN', label: 'Super Admin' },
                  { value: 'AGENT', label: 'Agent' },
                  { value: 'CLIENT', label: 'Client' },
                ]}
              />
              <CheckboxDropdown
                label="Statut"
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                options={[
                  { value: 'true', label: 'Actif' },
                  { value: 'false', label: 'Inactif' },
                ]}
              />
            </div>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-lg overflow-hidden">
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
                <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-muted/50">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
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
          </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
