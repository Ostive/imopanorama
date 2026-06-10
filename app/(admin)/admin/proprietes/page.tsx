'use client'

import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { formatPrice, formatDate } from '@/shared/utils'
import Link from 'next/link'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  Squares2X2Icon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AdminPageHeader } from '../components/AdminPageHeader'
import { StatsCard } from '../components/StatsCard'
import { ErrorAlert } from '../components/ErrorAlert'
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal'
import { CheckboxDropdown } from '../components/CheckboxDropdown'
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/features/properties/types'
import { TableSkeleton } from '@/shared/components/loading'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Checkbox } from '@/shared/components/ui/checkbox'

/* ─── PropertyPagination ─── */
function PropertyPagination({
  page, limit, total, totalPages, goToInput,
  onPageChange, onLimitChange, onGoToChange, onGoToSubmit,
  className = '',
}: {
  page: number
  limit: number
  total: number
  totalPages: number
  goToInput: string
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
  onGoToChange: (v: string) => void
  onGoToSubmit: (v: string) => void
  className?: string
}) {
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (page > 3) pages.push('...')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className={`px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Afficher</span>
        <Select value={limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
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
        <span className="text-sm text-foreground">sur {total} résultat{total > 1 ? 's' : ''}</span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">
            Précédent
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-2 py-2 text-sm text-muted-foreground">...</span>
              ) : (
                <button type="button"
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    page === p ? 'bg-primary-600 text-white shadow-sm' : 'text-foreground bg-card border border-border hover:bg-muted/50'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <span className="sm:hidden px-2 py-2 text-sm text-foreground">{page}/{totalPages}</span>
          <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant
          </button>
        </div>
      )}

      {totalPages > 7 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">Aller à</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={goToInput}
            onChange={(e) => onGoToChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onGoToSubmit(goToInput)
            }}
            placeholder={`1-${totalPages}`}
            aria-label="Aller à la page"
            className="w-20 h-9 text-sm text-center border border-border dark:bg-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  )
}

/* ─── Status color helper ─── */
const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  RESERVED:  'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  SOLD:      'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
  RENTED:    'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
  DRAFT:     'bg-muted text-foreground border border-border',
}
const getStatusColor = (status: string) => STATUS_COLORS[status.toUpperCase()] ?? 'bg-muted text-foreground border border-border'

/* ─── Main Page ─── */
function AdminPropertiesPageContent() {
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState<Record<string, number> | null>(null)
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'))
  const [limit, setLimit] = useState(() => parseInt(searchParams.get('limit') || '10'))
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') || '')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(() => searchParams.get('propertyType') || '')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState(() => searchParams.get('transactionType') || '')
  const [successMessage, setSuccessMessage] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('property_success_message') : null
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => (searchParams.get('view') as 'table' | 'grid') || 'table')
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'date_desc')
  const [goToInput, setGoToInput] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (successMessage) {
      localStorage.removeItem('property_success_message')
      const t = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(t)
    }
  }, [successMessage])

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1) }, 400)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [searchQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (statusFilter) params.set('status', statusFilter)
    if (propertyTypeFilter) params.set('propertyType', propertyTypeFilter)
    if (transactionTypeFilter) params.set('transactionType', transactionTypeFilter)
    if (page > 1) params.set('page', page.toString())
    if (limit !== 10) params.set('limit', limit.toString())
    if (viewMode !== 'table') params.set('view', viewMode)
    if (sortBy !== 'date_desc') params.set('sort', sortBy)
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [debouncedSearch, statusFilter, propertyTypeFilter, transactionTypeFilter, page, limit, viewMode, sortBy])

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), view: 'full', sort: sortBy })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (statusFilter) params.set('status', statusFilter)
      if (propertyTypeFilter) params.set('propertyType', propertyTypeFilter)
      if (transactionTypeFilter) params.set('transactionType', transactionTypeFilter)
      const res = await fetch(`/api/properties?${params}`)
      if (!res.ok) throw new Error('Failed to fetch properties')
      const data = await res.json()
      setProperties(data.data || [])
      setTotal(data.total || 0)
      if (data.statusCounts) setStatusCounts(data.statusCounts)
    } catch {
      setErrorMessage('Erreur lors du chargement des propriétés. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, statusFilter, propertyTypeFilter, transactionTypeFilter, sortBy])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const confirmDelete = async () => {
    if (!propertyToDelete) return
    try {
      const res = await fetch(`/api/properties/${propertyToDelete}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setSuccessMessage('Propriété supprimée avec succès')
      setTimeout(() => setSuccessMessage(null), 5000)
      fetchProperties()
    } catch {
      setErrorMessage('Erreur lors de la suppression de la propriété')
      setTimeout(() => setErrorMessage(null), 5000)
    } finally {
      setDeleteModalOpen(false)
      setPropertyToDelete(null)
    }
  }

  const openDelete = (id: string) => { setPropertyToDelete(id); setDeleteModalOpen(true) }

  const totalPages = Math.ceil(total / limit)
  const stats = {
    total,
    available: statusCounts?.available ?? 0,
    reserved: statusCounts?.reserved ?? 0,
    sold: (statusCounts?.sold ?? 0) + (statusCounts?.rented ?? 0),
  }
  const hasActiveFilters = debouncedSearch || statusFilter || propertyTypeFilter || transactionTypeFilter

  const toggleSort = (column: string) => {
    const asc = `${column}_asc`, desc = `${column}_desc`
    setSortBy(sortBy === desc ? asc : sortBy === asc ? 'date_desc' : desc)
    setPage(1)
  }
  const getSortIcon = (column: string) => {
    if (sortBy === `${column}_desc`) return <ChevronDownIcon className="h-4 w-4" />
    if (sortBy === `${column}_asc`) return <ChevronUpIcon className="h-4 w-4" />
    return <ChevronUpDownIcon className="h-4 w-4 text-gray-300" />
  }

  const paginationProps = {
    page, limit, total, totalPages, goToInput,
    onPageChange: (p: number) => setPage(p),
    onLimitChange: (l: number) => { setLimit(l); setPage(1) },
    onGoToChange: setGoToInput,
    onGoToSubmit: (v: string) => {
      const t = parseInt(v)
      if (t >= 1 && t <= totalPages) { setPage(t); setGoToInput('') }
    },
  }

  return (
    <ProtectedRoute requiredRole={['admin', 'super_admin']}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success banner */}
          <AnimatePresence>
            {successMessage && (
              <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 shrink-0" />
                    <p className="text-green-800 dark:text-green-300">{successMessage}</p>
                  </div>
                  <button type="button" onClick={() => setSuccessMessage(null)} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          {errorMessage && (
            <ErrorAlert
              title="Erreur"
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              onRetry={fetchProperties}
              className="mb-6"
            />
          )}

          <AdminPageHeader
            icon={<BuildingOfficeIcon className="w-6 h-6 text-white" />}
            title="Gestion des Propriétés"
            subtitle={`${total} propriété${total > 1 ? 's' : ''} au total`}
            showBackButton
            actions={
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button type="button" onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100'}`} title="Vue tableau">
                    <TableCellsIcon className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100'}`} title="Vue grille">
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Créer
                      <ChevronDownIcon className="h-4 w-4 ml-2 opacity-80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-muted/50">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg text-primary-600 dark:text-primary-400"><PlusIcon className="h-5 w-5" /></div>
                        <div className="flex flex-col"><span className="font-semibold text-foreground">Vide</span><span className="text-xs text-muted-foreground">Partir de zéro</span></div>
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px bg-muted my-2" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=HOUSE" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 group">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300"><HomeIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-foreground group-hover:text-green-700 dark:group-hover:text-green-300">Maison / Villa</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=APARTMENT" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 group">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300"><BuildingOfficeIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300">Appartement</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=TERRAIN_RESIDENTIAL" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 group">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300"><MapPinIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">Terrain</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total" value={stats.total} icon={<BuildingOfficeIcon className="w-7 h-7" />} color="blue" />
            <StatsCard title="Disponibles" value={stats.available} icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.05} />
            <StatsCard title="Réservées" value={stats.reserved} icon={<ClockIcon className="w-7 h-7" />} color="amber" delay={0.1} />
            <StatsCard title="Vendues/Louées" value={stats.sold} icon={<NoSymbolIcon className="w-7 h-7" />} color="purple" delay={0.15} />
          </div>

          {/* Filters */}
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-lg p-6 mb-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FunnelIcon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
              </div>
              {hasActiveFilters && (
                <button type="button"
                  onClick={() => { setSearchQuery(''); setDebouncedSearch(''); setStatusFilter(''); setPropertyTypeFilter(''); setTransactionTypeFilter(''); setPage(1) }}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" /> Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." aria-label="Rechercher une propriété" className="w-full pl-10 pr-4 h-10 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <CheckboxDropdown
                label="Statut"
                selected={statusFilter ? statusFilter.split(',') : []}
                onChange={(v) => { setStatusFilter(v.join(',')); setPage(1) }}
                options={[
                  { value: 'AVAILABLE', label: 'Disponible' },
                  { value: 'RESERVED', label: 'Réservé' },
                  { value: 'SOLD', label: 'Vendu' },
                  { value: 'RENTED', label: 'Loué' },
                  { value: 'DRAFT', label: 'Brouillon' },
                ]}
              />
              <CheckboxDropdown
                label="Transaction"
                selected={transactionTypeFilter ? transactionTypeFilter.split(',') : []}
                onChange={(v) => { setTransactionTypeFilter(v.join(',')); setPage(1) }}
                options={[
                  { value: 'SALE', label: 'Vente' },
                  { value: 'RENT', label: 'Location' },
                  { value: 'SEASONAL_RENT', label: 'Saisonnière' },
                ]}
              />
              <CheckboxDropdown
                label="Type de bien"
                selected={propertyTypeFilter ? propertyTypeFilter.split(',') : []}
                onChange={(v) => { setPropertyTypeFilter(v.join(',')); setPage(1) }}
                groups={[
                  { label: 'Terrains', options: [
                    { value: 'TERRAIN_RESIDENTIAL', label: 'Résidentiel' },
                    { value: 'TERRAIN_COMMERCIAL', label: 'Commercial' },
                    { value: 'TERRAIN_AGRICULTURAL', label: 'Agricole' },
                    { value: 'TERRAIN_INDUSTRIAL', label: 'Industriel' },
                  ]},
                  { label: 'Maisons & Villas', options: [
                    { value: 'VILLA', label: 'Villa' },
                    { value: 'HOUSE', label: 'Maison' },
                    { value: 'TOWNHOUSE', label: 'Maison de ville' },
                    { value: 'COUNTRY_HOUSE', label: 'Campagne' },
                  ]},
                  { label: 'Appartements', options: [
                    { value: 'APARTMENT', label: 'Appartement' },
                    { value: 'STUDIO', label: 'Studio' },
                    { value: 'PENTHOUSE', label: 'Penthouse' },
                    { value: 'DUPLEX', label: 'Duplex' },
                    { value: 'LOFT', label: 'Loft' },
                  ]},
                  { label: 'Commercial', options: [
                    { value: 'OFFICE', label: 'Bureau' },
                    { value: 'SHOP', label: 'Boutique' },
                    { value: 'WAREHOUSE', label: 'Entrepôt' },
                  ]},
                ]}
              />
            </div>
          </m.div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('title')}>
                        <div className="flex items-center gap-1">Propriété {getSortIcon('title')}</div>
                      </th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('city')}>
                        <div className="flex items-center gap-1">Localisation {getSortIcon('city')}</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('price')}>
                        <div className="flex items-center gap-1">Prix {getSortIcon('price')}</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                      <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none" onClick={() => toggleSort('date')}>
                        <div className="flex items-center gap-1">Créé le {getSortIcon('date')}</div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr><td colSpan={8} className="px-6 py-4"><TableSkeleton rows={5} columns={7} /></td></tr>
                    ) : properties.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-20">
                          <div className="text-center">
                            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                              <HomeModernIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune propriété trouvée</h3>
                            <p className="text-muted-foreground mb-6">{hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre première propriété'}</p>
                            {!hasActiveFilters && (
                              <Link href="/admin/proprietes/new" className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                                <PlusIcon className="h-5 w-5 mr-2" /> Créer une propriété
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      properties.map((property) => (
                        <tr key={property.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {property.coverImage || property.images?.[0] ? (
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                                  <Image src={property.coverImage || property.images[0]} alt={property.title} fill sizes="48px" className="object-cover" />
                                </div>
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0"><HomeModernIcon className="h-6 w-6 text-muted-foreground" /></div>
                              )}
                              <div className="ml-4 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">{property.title}</div>
                                <div className="text-sm text-muted-foreground">{property.totalSize} m²</div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 text-sm text-foreground">{PROPERTY_TYPE_LABELS[property.propertyType as keyof typeof PROPERTY_TYPE_LABELS]}</td>
                          <td className="hidden lg:table-cell px-6 py-4 text-sm text-foreground">{TRANSACTION_TYPE_LABELS[property.transactionType as keyof typeof TRANSACTION_TYPE_LABELS]}</td>
                          <td className="hidden md:table-cell px-6 py-4">
                            <div className="text-sm text-foreground">{property.city}</div>
                            <div className="text-sm text-muted-foreground">{property.location}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-foreground">{formatPrice(property.price)}</div>
                            {property.pricePerM2 && <div className="text-xs text-muted-foreground">{formatPrice(property.pricePerM2)}/m²</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                              {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                            </span>
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4 text-sm text-muted-foreground">{formatDate(property.createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="hidden md:flex items-center justify-end gap-2">
                              <Link href={`/proprietes/${property.id}`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Voir"><EyeIcon className="h-5 w-5" /></Link>
                              <Link href={`/admin/proprietes/edit/${property.id}`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Modifier"><PencilSquareIcon className="h-5 w-5" /></Link>
                              <button type="button" onClick={() => openDelete(property.id)} className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                            <div className="md:hidden flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 hover:bg-muted rounded-lg transition-colors"><EllipsisVerticalIcon className="h-5 w-5" /></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild><Link href={`/proprietes/${property.id}`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400"><EyeIcon className="h-4 w-4" />Voir</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link href={`/admin/proprietes/edit/${property.id}`} className="flex items-center gap-2 text-primary-600 dark:text-primary-400"><PencilSquareIcon className="h-4 w-4" />Modifier</Link></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openDelete(property.id)} className="flex items-center gap-2 text-red-600 dark:text-red-400"><TrashIcon className="h-4 w-4" />Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <PropertyPagination {...paginationProps} className="bg-card" />
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border animate-pulse">
                      <div className="h-48 bg-muted" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-5 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-lg p-20 text-center border border-border">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"><HomeModernIcon className="h-12 w-12 text-muted-foreground" /></div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune propriété trouvée</h3>
                  <p className="text-muted-foreground mb-6">{hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre première propriété'}</p>
                  {!hasActiveFilters && (
                    <Link href="/admin/proprietes/new" className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-primary-600 text-white rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                      <PlusIcon className="h-5 w-5 mr-2" /> Créer une propriété
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <m.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow group">
                      <div className="relative h-48 bg-muted">
                        {property.coverImage || property.images?.[0] ? (
                          <Image src={property.coverImage || property.images[0]} alt={property.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><HomeModernIcon className="h-16 w-16 text-muted-foreground" /></div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                            {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Link href={`/proprietes/${property.id}`} className="p-2.5 bg-card rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shadow-lg" title="Voir"><EyeIcon className="h-5 w-5" /></Link>
                          <Link href={`/admin/proprietes/edit/${property.id}`} className="p-2.5 bg-card rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shadow-lg" title="Modifier"><PencilSquareIcon className="h-5 w-5" /></Link>
                          <button type="button" onClick={() => openDelete(property.id)} className="p-2.5 bg-card rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-lg" title="Supprimer"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-foreground truncate mb-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{property.city}{property.location ? `, ${property.location}` : ''}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-bold text-primary-600 dark:text-primary-400">{formatPrice(property.price)}</p>
                          <span className="text-xs text-muted-foreground">{property.totalSize} m²</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">{PROPERTY_TYPE_LABELS[property.propertyType as keyof typeof PROPERTY_TYPE_LABELS]}</span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-xs text-muted-foreground">{TRANSACTION_TYPE_LABELS[property.transactionType as keyof typeof TRANSACTION_TYPE_LABELS]}</span>
                        </div>
                      </div>
                    </m.div>
                  ))}
                </div>
              )}
              <div className="mt-6 bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                <PropertyPagination {...paginationProps} />
              </div>
            </div>
          )}

          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            title="Supprimer cette propriété ?"
            description="Cette action est irréversible. La propriété sera définitivement supprimée de la base de données."
            onConfirm={confirmDelete}
            onCancel={() => { setDeleteModalOpen(false); setPropertyToDelete(null) }}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function AdminPropertiesPage() {
  return (
    <Suspense fallback={null}>
      <AdminPropertiesPageContent />
    </Suspense>
  )
}
