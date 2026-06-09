'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { m } from 'framer-motion'
import { useFaqs } from '@/features/faqs/hooks/useFaqs'
import { Faq } from '@/features/faqs/types'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  FolderIcon,
  FunnelIcon,
  XMarkIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  AdminPageHeader,
  StatsCard,
  AdminTablePagination,
  CheckboxDropdown,
} from '../components'


const CATEGORY_OPTIONS = [
  { value: 'general',       label: 'Général' },
  { value: 'achat',         label: 'Achat' },
  { value: 'vente',         label: 'Vente' },
  { value: 'location',      label: 'Location' },
  { value: 'investissement',label: 'Investissement' },
  { value: 'services',      label: 'Services' },
  { value: 'frais',         label: 'Frais' },
  { value: 'processus',     label: 'Processus' },
  { value: 'visite',        label: 'Visite' },
]

export default function AdminFaqsPage() {
  const router = useRouter()
  const urlParams = useSearchParams()

  const [searchInput, setSearchInput] = useState(() => urlParams.get('search') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = urlParams.get('category'); return c ? [c] : []
  })
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const s = urlParams.get('isActive'); return s !== null ? [s] : []
  })
  const [page, setPage] = useState(() => parseInt(urlParams.get('page') || '1'))
  const [limit, setLimit] = useState(() => parseInt(urlParams.get('limit') || '10'))
  const [search, setSearch] = useState(() => urlParams.get('search') || '')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 500)
    return () => clearTimeout(t)
  }, [searchInput])

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0])
    if (selectedStatuses.length === 1) params.set('isActive', selectedStatuses[0])
    if (page > 1) params.set('page', String(page))
    if (limit !== 10) params.set('limit', String(limit))
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false })
  }, [search, selectedCategories, selectedStatuses, page, limit, router])

  const category = selectedCategories.length === 1 ? selectedCategories[0] : undefined
  const isActive = selectedStatuses.length === 1 ? selectedStatuses[0] === 'true' : undefined

  const { faqs, loading, error, totalCount, deleteFaq } = useFaqs({
    page,
    limit,
    search: search || undefined,
    category,
    isActive,
  })

  const totalPages = Math.ceil(totalCount / limit)
  const activeCount = faqs.filter((f) => f.isActive).length
  const uniqueCategories = new Set(faqs.map((f) => f.category)).size
  const hasActiveFilters = searchInput || selectedCategories.length > 0 || selectedStatuses.length > 0

  const handleDelete = async (faq: Faq) => {
    if (!window.confirm(`Supprimer "${faq.question}" ?`)) return
    const success = await deleteFaq(faq.id)
    if (success) toast.success('Question supprimée')
    else toast.error('Erreur lors de la suppression')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/20 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        <AdminPageHeader
          icon={<QuestionMarkCircleIcon className="w-6 h-6 text-white" />}
          title="Gestion des FAQs"
          subtitle="Gérez les questions fréquemment posées"
          showBackButton
          loading={loading}
          actions={
            <Link href="/admin/faqs/new">
              <m.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-6 py-2 bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Ajouter une question
              </m.div>
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total" value={totalCount} subtitle="Questions" icon={<QuestionMarkCircleIcon className="w-7 h-7" />} color="blue" />
          <StatsCard title="Actives" value={activeCount} subtitle="Publiées" icon={<CheckCircleIcon className="w-7 h-7" />} color="green" delay={0.05} />
          <StatsCard title="Catégories" value={uniqueCategories} subtitle="Types" icon={<FolderIcon className="w-7 h-7" />} color="purple" delay={0.1} />
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
              <button type="button"
                onClick={() => { setSearchInput(''); setSelectedCategories([]); setSelectedStatuses([]) }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium flex items-center gap-1"
              >
                <XMarkIcon className="h-4 w-4" />Réinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher une question..."
                aria-label="Rechercher une question"
                className="w-full pl-10 pr-10 h-10 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <CheckboxDropdown
              label="Catégorie"
              selected={selectedCategories}
              onChange={(v) => { setSelectedCategories(v); setPage(1) }}
              options={CATEGORY_OPTIONS}
            />
            <CheckboxDropdown
              label="Statut"
              selected={selectedStatuses}
              onChange={(v) => { setSelectedStatuses(v); setPage(1) }}
              options={[
                { value: 'true',  label: 'Actif' },
                { value: 'false', label: 'Inactif' },
              ]}
            />
          </div>
        </m.div>

        {/* Table */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="h-4 bg-muted rounded w-2/5"></div>
                  <div className="h-6 bg-muted rounded-full w-20"></div>
                  <div className="h-6 bg-muted rounded w-8"></div>
                  <div className="h-6 bg-muted rounded-full w-16 ml-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-600 dark:text-red-400">Erreur lors du chargement des questions.</div>
          ) : faqs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <QuestionMarkCircleIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Aucune question trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground truncate max-w-xs">
                          {faq.question.length > 70 ? `${faq.question.slice(0, 70)}…` : faq.question}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
                          {faq.answer.length > 90 ? `${faq.answer.slice(0, 90)}…` : faq.answer}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          {faq.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-foreground">{faq.order}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {faq.isActive ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                            <CheckCircleIcon className="h-4 w-4" />Actif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                            <XMarkIcon className="h-4 w-4" />Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="hidden md:flex items-center justify-end gap-2">
                          <Link href="/faqs" target="_blank" className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Voir">
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link href={`/admin/faqs/${faq.id}/edit`} className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Modifier">
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button type="button" onClick={() => handleDelete(faq)} className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer">
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
                                <Link href="/faqs" target="_blank" className="flex items-center gap-2 text-primary-600">
                                  <EyeIcon className="h-4 w-4" />Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/faqs/${faq.id}/edit`} className="flex items-center gap-2 text-primary-600">
                                  <PencilIcon className="h-4 w-4" />Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(faq)} className="flex items-center gap-2 text-red-600">
                                <TrashIcon className="h-4 w-4" />Supprimer
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
          )}

          <AdminTablePagination
            page={page}
            limit={limit}
            total={totalCount}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1) }}
          />
        </m.div>

      </div>
    </div>
  )
}
