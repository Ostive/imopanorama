'use client'

import React, { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { m } from 'framer-motion'
import {
  Squares2X2Icon,
  HomeIcon,
  ListBulletIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { Property } from '@/features/properties/types/properties.types'
import { PropertyViewMode } from '@/features/properties/types/filters.types'
import {
  usePropertyFilters,
  buildPropertiesApiQuery,
} from '@/features/properties/hooks/usePropertyFilters'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui'
import PropertyFilterPanel from '@/features/properties/components/filters/PropertyFilterPanel'
import PropertyCard from '@/features/properties/components/PropertyCard'
import PropertyListItem from '@/features/properties/components/PropertyListItem'
import dynamicImport from 'next/dynamic'

const PropertiesMapViewDynamic = dynamicImport(
  () => import('@/features/properties/components/PropertiesMapView'),
  {
    loading: () => (
      <div className="w-full h-[calc(100vh-300px)] bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary-600 mx-auto mb-4"></div>
          <p>La carte se prépare...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
)

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-7xl mx-auto px-4">
            <div className="h-10 bg-muted rounded-xl w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PropertiesPageContent />
    </Suspense>
  )
}

function PropertiesPageContent() {
  const { filters, updateFilters, resetFilters, activeCount } = usePropertyFilters()

  const { data: propertiesData, isLoading: loading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const response = await fetch(`/api/properties?${buildPropertiesApiQuery(filters)}`)
      return response.json()
    },
  })

  const properties = propertiesData?.success ? (propertiesData.data as Property[]) : []
  const total = propertiesData?.success ? propertiesData.total : 0

  const { data: mapData } = useQuery({
    queryKey: ['allProperties', filters],
    queryFn: async () => {
      const response = await fetch(
        `/api/properties?${buildPropertiesApiQuery(filters, { isMap: true })}`
      )
      return response.json()
    },
    enabled: filters.viewMode === 'map',
  })

  const allProperties = mapData?.success ? (mapData.data as Property[]) : []

  const updateViewMode = (mode: PropertyViewMode) => updateFilters({ viewMode: mode })
  const updateSort = (value: string) =>
    updateFilters({ sortBy: value as typeof filters.sortBy, page: 1 })
  const updatePage = (value: number) => updateFilters({ page: value })

  const totalPages = Math.ceil(total / 12)

  return (
    <>
      <PropertyFilterPanel
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        activeFilterCount={activeCount}
        total={total}
      />

      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 sm:pb-8">
          {/* Results Header */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground shrink-0">
                {loading ? (
                  <span className="inline-block h-5 w-32 bg-muted rounded-lg animate-pulse" />
                ) : (
                  <>
                    {total} bien{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
                  </>
                )}
              </h2>

              <div className="flex items-center gap-2 ml-auto">
                <label className="sr-only" htmlFor="property-sort">
                  Trier les biens
                </label>
                <Select value={filters.sortBy} onValueChange={updateSort}>
                  <SelectTrigger
                    id="property-sort"
                    size="sm"
                    className="h-9 w-[132px] rounded-xl border-border bg-card px-2.5 text-xs font-medium shadow-sm transition-all hover:border-gray-300 focus:ring-2 focus:ring-primary-500 dark:hover:border-gray-500 sm:w-[180px] sm:text-sm"
                  >
                    <SelectValue placeholder="Trier" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="date_desc">Nouveautés</SelectItem>
                      <SelectItem value="date_asc">Plus ancien</SelectItem>
                      <SelectItem value="price_asc">Prix croissant</SelectItem>
                      <SelectItem value="price_desc">Prix décroissant</SelectItem>
                      <SelectItem value="size_asc">Surface croissante</SelectItem>
                      <SelectItem value="size_desc">Surface décroissante</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle — desktop only */}
                <div className="hidden sm:flex gap-0.5 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  {[
                    { mode: 'grid' as const, Icon: Squares2X2Icon, title: 'Grille' },
                    { mode: 'list' as const, Icon: ListBulletIcon, title: 'Liste' },
                    { mode: 'map' as const, Icon: MapPinIcon, title: 'Carte' },
                  ].map(({ mode, Icon, title }) => (
                    <m.button
                      key={mode}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => updateViewMode(mode)}
                      title={title}
                      className={`p-2 rounded-lg transition-all ${
                        filters.viewMode === mode
                          ? 'bg-input text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </m.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid/List/Map */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border animate-pulse"
                >
                  <div className="h-64 bg-muted w-full" />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded-full w-16" />
                    </div>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="pt-4 border-t border-border flex gap-4">
                      <div className="h-4 bg-muted rounded w-12" />
                      <div className="h-4 bg-muted rounded w-12" />
                      <div className="h-4 bg-muted rounded w-12" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-muted rounded w-24" />
                      <div className="h-8 bg-muted rounded-lg w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !properties || properties.length === 0 ? (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-card rounded-3xl shadow-xl"
            >
              <div className="max-w-md mx-auto px-6">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HomeIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Aucun bien ne correspond encore
                </h3>
                <p className="text-muted-foreground mb-8">
                  Essayez d'élargir un peu vos critères. Le bon bien se cache parfois à un filtre près.
                </p>
                <button type="button"
                  onClick={resetFilters}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Repartir de zéro
                </button>
              </div>
            </m.div>
          ) : filters.viewMode === 'map' ? (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 isolate">
              <PropertiesMapViewDynamic
                properties={allProperties.length > 0 ? allProperties : properties}
                height="calc(100vh - 300px)"
              />
            </div>
          ) : filters.viewMode === 'list' ? (
            <div className="space-y-4">
              {properties.map(property => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <div key={property.id} className="min-h-[400px]">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && filters.viewMode !== 'map' && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex justify-center items-center gap-2"
            >
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updatePage(Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="px-5 py-2.5 rounded-xl bg-card border-2 border-border text-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-all shadow-sm hover:shadow-md disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
              >
                Page précédente
              </m.button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(pageNum => {
                    return (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                    )
                  })
                  .map((pageNum, index, array) => (
                    <React.Fragment key={`page-${pageNum}`}>
                      {index > 0 && array[index - 1] !== pageNum - 1 && (
                        <span key={`ellipsis-${pageNum}`} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      )}
                      <m.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updatePage(pageNum)}
                        className={`min-w-[40px] px-3 py-2 rounded-xl font-semibold transition-all ${
                          pageNum === filters.page
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                            : 'bg-card border-2 border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </m.button>
                    </React.Fragment>
                  ))}
              </div>

              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updatePage(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="px-5 py-2.5 rounded-xl bg-card border-2 border-border text-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-all shadow-sm hover:shadow-md disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
              >
                Page suivante
              </m.button>
            </m.div>
          )}
        </div>

        {/* Bottom View Bar — mobile only */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
          <div className="flex items-center justify-around px-4 py-2 safe-area-bottom">
            {[
              { mode: 'grid' as const, Icon: Squares2X2Icon, label: 'Grille' },
              { mode: 'list' as const, Icon: ListBulletIcon, label: 'Liste' },
              { mode: 'map' as const, Icon: MapPinIcon, label: 'Carte' },
            ].map(({ mode, Icon, label }) => (
              <m.button
                key={mode}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateViewMode(mode)}
                className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all ${
                  filters.viewMode === mode
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{label}</span>
              </m.button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
