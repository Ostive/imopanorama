'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
import { AdminPageHeader, StatsCard, ErrorAlert, ConfirmDeleteModal, CheckboxDropdown } from '../components'
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
    <div className={`px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Afficher</span>
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
        <span className="text-sm text-gray-700">sur {total} résultat{total > 1 ? 's' : ''}</span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Précédent
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-2 py-2 text-sm text-gray-400">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    page === p ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <span className="sm:hidden px-2 py-2 text-sm text-gray-700">{page}/{totalPages}</span>
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant
          </button>
        </div>
      )}

      {totalPages > 7 && (
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); onGoToSubmit(goToInput) }}>
          <span className="text-sm text-gray-700">Aller à</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={goToInput}
            onChange={(e) => onGoToChange(e.target.value)}
            placeholder={`1-${totalPages}`}
            className="w-20 h-9 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </form>
      )}
    </div>
  )
}

/* ─── Status color helper ─── */
const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  RESERVED:  'bg-amber-100 text-amber-800 border border-amber-200',
  SOLD:      'bg-rose-100 text-rose-800 border border-rose-200',
  RENTED:    'bg-blue-100 text-blue-800 border border-blue-200',
  DRAFT:     'bg-gray-100 text-gray-800 border border-gray-200',
}
const getStatusColor = (status: string) => STATUS_COLORS[status.toUpperCase()] ?? 'bg-gray-100 text-gray-800 border border-gray-200'

/* ─── Main Page ─── */
export default function AdminPropertiesPage() {
  const router = useRouter()
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => (searchParams.get('view') as 'table' | 'grid') || 'table')
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'date_desc')
  const [goToInput, setGoToInput] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const msg = typeof window !== 'undefined' ? localStorage.getItem('property_success_message') : null
    if (msg) {
      setSuccessMessage(msg)
      localStorage.removeItem('property_success_message')
      const t = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(t)
    }
  }, [])

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
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false })
  }, [debouncedSearch, statusFilter, propertyTypeFilter, transactionTypeFilter, page, limit, viewMode, sortBy, router])

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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/20 py-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 shrink-0" />
                    <p className="text-green-800">{successMessage}</p>
                  </div>
                  <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
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
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`} title="Vue tableau">
                    <TableCellsIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`} title="Vue grille">
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Créer
                      <ChevronDownIcon className="h-4 w-4 ml-2 opacity-80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-gray-50">
                        <div className="bg-primary-100 p-2 rounded-lg text-primary-600"><PlusIcon className="h-5 w-5" /></div>
                        <div className="flex flex-col"><span className="font-semibold text-gray-900">Vide</span><span className="text-xs text-gray-500">Partir de zéro</span></div>
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px bg-gray-100 my-2" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=HOUSE" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-green-50 group">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:text-green-700"><HomeIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-gray-900 group-hover:text-green-700">Maison / Villa</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=APARTMENT" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-blue-50 group">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:text-blue-700"><BuildingOfficeIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-gray-900 group-hover:text-blue-700">Appartement</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/proprietes/new?type=TERRAIN_RESIDENTIAL" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-amber-50 group">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:text-amber-700"><MapPinIcon className="h-5 w-5" /></div>
                        <span className="font-semibold text-gray-900 group-hover:text-amber-700">Terrain</span>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FunnelIcon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSearchQuery(''); setDebouncedSearch(''); setStatusFilter(''); setPropertyTypeFilter(''); setTransactionTypeFilter(''); setPage(1) }}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" /> Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
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
          </motion.div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort('title')}>
                        <div className="flex items-center gap-1">Propriété {getSortIcon('title')}</div>
                      </th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort('city')}>
                        <div className="flex items-center gap-1">Localisation {getSortIcon('city')}</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort('price')}>
                        <div className="flex items-center gap-1">Prix {getSortIcon('price')}</div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => toggleSort('date')}>
                        <div className="flex items-center gap-1">Créé le {getSortIcon('date')}</div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={8} className="px-6 py-4"><TableSkeleton rows={5} columns={7} /></td></tr>
                    ) : properties.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-20">
                          <div className="text-center">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <HomeModernIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune propriété trouvée</h3>
                            <p className="text-gray-500 mb-6">{hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre première propriété'}</p>
                            {!hasActiveFilters && (
                              <Link href="/admin/proprietes/new" className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                                <PlusIcon className="h-5 w-5 mr-2" /> Créer une propriété
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      properties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {property.coverImage || property.images?.[0] ? (
                                <img src={property.coverImage || property.images[0]} alt={property.title} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0"><HomeModernIcon className="h-6 w-6 text-gray-400" /></div>
                              )}
                              <div className="ml-4 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{property.title}</div>
                                <div className="text-sm text-gray-500">{property.totalSize} m²</div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{PROPERTY_TYPE_LABELS[property.propertyType as keyof typeof PROPERTY_TYPE_LABELS]}</td>
                          <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{TRANSACTION_TYPE_LABELS[property.transactionType as keyof typeof TRANSACTION_TYPE_LABELS]}</td>
                          <td className="hidden md:table-cell px-6 py-4">
                            <div className="text-sm text-gray-900">{property.city}</div>
                            <div className="text-sm text-gray-500">{property.location}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{formatPrice(property.price)}</div>
                            {property.pricePerM2 && <div className="text-xs text-gray-500">{formatPrice(property.pricePerM2)}/m²</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                              {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                            </span>
                          </td>
                          <td className="hidden xl:table-cell px-6 py-4 text-sm text-gray-500">{formatDate(property.createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="hidden md:flex items-center justify-end gap-2">
                              <Link href={`/proprietes/${property.id}`} className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors" title="Voir"><EyeIcon className="h-5 w-5" /></Link>
                              <Link href={`/admin/proprietes/edit/${property.id}`} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier"><PencilSquareIcon className="h-5 w-5" /></Link>
                              <button onClick={() => openDelete(property.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                            <div className="md:hidden flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><EllipsisVerticalIcon className="h-5 w-5" /></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild><Link href={`/proprietes/${property.id}`} className="flex items-center gap-2 text-primary-600"><EyeIcon className="h-4 w-4" />Voir</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link href={`/admin/proprietes/edit/${property.id}`} className="flex items-center gap-2 text-blue-600"><PencilSquareIcon className="h-4 w-4" />Modifier</Link></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openDelete(property.id)} className="flex items-center gap-2 text-red-600"><TrashIcon className="h-4 w-4" />Supprimer</DropdownMenuItem>
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
              <PropertyPagination {...paginationProps} className="bg-white" />
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-20 text-center border border-gray-100">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"><HomeModernIcon className="h-12 w-12 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune propriété trouvée</h3>
                  <p className="text-gray-500 mb-6">{hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre première propriété'}</p>
                  {!hasActiveFilters && (
                    <Link href="/admin/proprietes/new" className="inline-flex items-center px-6 py-3 bg-linear-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold">
                      <PlusIcon className="h-5 w-5 mr-2" /> Créer une propriété
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group">
                      <div className="relative h-48 bg-gray-200">
                        {property.coverImage || property.images?.[0] ? (
                          <img src={property.coverImage || property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><HomeModernIcon className="h-16 w-16 text-gray-400" /></div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                            {PROPERTY_STATUS_LABELS[property.status as keyof typeof PROPERTY_STATUS_LABELS]}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Link href={`/proprietes/${property.id}`} className="p-2.5 bg-white rounded-xl text-primary-600 hover:bg-primary-50 transition-colors shadow-lg" title="Voir"><EyeIcon className="h-5 w-5" /></Link>
                          <Link href={`/admin/proprietes/edit/${property.id}`} className="p-2.5 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-lg" title="Modifier"><PencilSquareIcon className="h-5 w-5" /></Link>
                          <button onClick={() => openDelete(property.id)} className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-colors shadow-lg" title="Supprimer"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{property.city}{property.location ? `, ${property.location}` : ''}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-bold text-primary-600">{formatPrice(property.price)}</p>
                          <span className="text-xs text-gray-500">{property.totalSize} m²</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{PROPERTY_TYPE_LABELS[property.propertyType as keyof typeof PROPERTY_TYPE_LABELS]}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">{TRANSACTION_TYPE_LABELS[property.transactionType as keyof typeof TRANSACTION_TYPE_LABELS]}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
