'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Squares2X2Icon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapIcon,
  CurrencyEuroIcon,
  ShoppingBagIcon,
  KeyIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ListBulletIcon,
  MapPinIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BuildingLibraryIcon,

} from '@heroicons/react/24/outline'
import { Property, PropertyType, TransactionType } from '@/features/properties/types/properties.types'
import { getFilterApplicability, COMMON_AMENITIES } from '@/features/properties/utils/filterApplicability'
import PropertyCard from '@/features/properties/components/PropertyCard'
import PropertyListItem from '@/features/properties/components/PropertyListItem'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import dynamicImport from 'next/dynamic'

// Dynamic import for map to reduce initial bundle size
const PropertiesMapViewDynamic = dynamicImport(
  () => import('@/features/properties/components/PropertiesMapView'),
  {
    loading: () => (
      <div className="w-full h-[calc(100vh-300px)] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 mx-auto mb-4"></div>
          <p>La carte se prépare...</p>
        </div>
      </div>
    ),
    ssr: false
  }
)

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-7xl mx-auto px-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  )
}

function PropertiesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // Removed explicit loading, properties, total, allProperties states
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([])
  const [transactionType, setTransactionType] = useState<TransactionType | ''>('')
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minSize, setMinSize] = useState('')
  const [maxSize, setMaxSize] = useState('')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [maxBedrooms, setMaxBedrooms] = useState('')
  const [minBathrooms, setMinBathrooms] = useState('')
  const [minRooms, setMinRooms] = useState('')
  const [minFloor, setMinFloor] = useState('')
  const [maxFloor, setMaxFloor] = useState('')
  const [minYearBuilt, setMinYearBuilt] = useState('')
  const [maxYearBuilt, setMaxYearBuilt] = useState('')
  const [condition, setCondition] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date_desc')

  // Property type categories
  const propertyCategories = {
    terrains: ['TERRAIN_RESIDENTIAL', 'TERRAIN_COMMERCIAL', 'TERRAIN_AGRICULTURAL', 'TERRAIN_INDUSTRIAL'] as PropertyType[],
    villas: ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE'] as PropertyType[],
    apartments: ['APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'] as PropertyType[],
    commercial: ['OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'] as PropertyType[],
  }

  // Read all filters from URL on mount
  useEffect(() => {
    // ... (This useEffect remains the same - keeping it)
    const searchQuery = searchParams.get('search')
    if (searchQuery) setSearch(searchQuery)
    const viewParam = searchParams.get('view')
    if (viewParam === 'grid' || viewParam === 'list' || viewParam === 'map') setViewMode(viewParam)
    const typesParam = searchParams.get('propertyType')
    if (typesParam) setSelectedTypes(typesParam.split(',') as PropertyType[])
    const transactionParam = searchParams.get('transactionType')
    if (transactionParam) setTransactionType(transactionParam as TransactionType)
    const cityParam = searchParams.get('city')
    if (cityParam) setCity(cityParam)
    const minPriceParam = searchParams.get('minPrice')
    if (minPriceParam) setMinPrice(minPriceParam)
    const maxPriceParam = searchParams.get('maxPrice')
    if (maxPriceParam) setMaxPrice(maxPriceParam)
    const minSizeParam = searchParams.get('minSize')
    if (minSizeParam) setMinSize(minSizeParam)
    const maxSizeParam = searchParams.get('maxSize')
    if (maxSizeParam) setMaxSize(maxSizeParam)
    const minBedroomsParam = searchParams.get('minBedrooms')
    if (minBedroomsParam) setMinBedrooms(minBedroomsParam)
    const maxBedroomsParam = searchParams.get('maxBedrooms')
    if (maxBedroomsParam) setMaxBedrooms(maxBedroomsParam)
    const minBathroomsParam = searchParams.get('minBathrooms')
    if (minBathroomsParam) setMinBathrooms(minBathroomsParam)
    const minRoomsParam = searchParams.get('minRooms')
    if (minRoomsParam) setMinRooms(minRoomsParam)
    const minFloorParam = searchParams.get('minFloor')
    if (minFloorParam) setMinFloor(minFloorParam)
    const maxFloorParam = searchParams.get('maxFloor')
    if (maxFloorParam) setMaxFloor(maxFloorParam)
    const minYearBuiltParam = searchParams.get('minYearBuilt')
    if (minYearBuiltParam) setMinYearBuilt(minYearBuiltParam)
    const maxYearBuiltParam = searchParams.get('maxYearBuilt')
    if (maxYearBuiltParam) setMaxYearBuilt(maxYearBuiltParam)
    const conditionParam = searchParams.get('condition')
    if (conditionParam) setCondition(conditionParam)
    const amenitiesParam = searchParams.get('amenities')
    if (amenitiesParam) setSelectedAmenities(amenitiesParam.split(',').filter(Boolean))
    const sortParam = searchParams.get('sort')
    if (sortParam) {
      // If sort is relevance but no search query, fallback to date_desc
      setSortBy(sortParam)
    } else if (searchQuery) {
      setSortBy('relevance')
    } else {
      setSortBy('date_desc')
    }
    const pageParam = searchParams.get('page')
    if (pageParam) setPage(parseInt(pageParam))
  }, [searchParams])

  // --- React Query Implementation ---

  // Helper to build query params
  const buildQueryParams = (isMap = false) => {
    const params = new URLSearchParams()
    if (!isMap) {
      params.set('page', page.toString())
      params.set('limit', '12')
    } else {
      params.set('limit', '1000')
    }

    if (selectedTypes.length > 0) params.set('propertyType', selectedTypes.join(','))
    if (transactionType) params.set('transactionType', transactionType)
    if (city) params.set('city', city)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minSize) params.set('minSize', minSize)
    if (maxSize) params.set('maxSize', maxSize)
    if (minBedrooms) params.set('minBedrooms', minBedrooms)
    if (maxBedrooms) params.set('maxBedrooms', maxBedrooms)
    if (minBathrooms) params.set('minBathrooms', minBathrooms)
    if (minRooms) params.set('minRooms', minRooms)
    if (minFloor) params.set('minFloor', minFloor)
    if (maxFloor) params.set('maxFloor', maxFloor)
    if (minYearBuilt) params.set('minYearBuilt', minYearBuilt)
    if (maxYearBuilt) params.set('maxYearBuilt', maxYearBuilt)
    if (condition) params.set('condition', condition)
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','))
    if (search) params.set('search', search)
    if (!isMap && sortBy) params.set('sort', sortBy)

    return params.toString()
  }

  // Main properties query (paginated)
  const {
    data: propertiesData,
    isLoading: loading
  } = useQuery({
    queryKey: ['properties', { page, selectedTypes, transactionType, city, minPrice, maxPrice, minSize, maxSize, minBedrooms, maxBedrooms, minBathrooms, minRooms, minFloor, maxFloor, minYearBuilt, maxYearBuilt, condition, selectedAmenities, search, sortBy }],
    queryFn: async () => {
      const response = await fetch(`/api/properties?${buildQueryParams(false)}`)
      return response.json()
    }
  });

  const properties = propertiesData?.success ? (propertiesData.data as Property[]) : [];
  const total = propertiesData?.success ? propertiesData.total : 0;

  // Map properties query (fetch all when map view is active)
  const { data: mapData } = useQuery({
    queryKey: ['allProperties', { selectedTypes, transactionType, city, minPrice, maxPrice, minSize, maxSize, minBedrooms, maxBedrooms, minBathrooms, minRooms, minFloor, maxFloor, minYearBuilt, maxYearBuilt, condition, selectedAmenities, search }],
    queryFn: async () => {
      const response = await fetch(`/api/properties?${buildQueryParams(true)}`)
      return response.json()
    },
    enabled: viewMode === 'map'
  });

  const allProperties = mapData?.success ? (mapData.data as Property[]) : [];

  const selectCategory = (category: keyof typeof propertyCategories) => {
    const types = propertyCategories[category]
    const allSelected = types.every(type => selectedTypes.includes(type))

    let newTypes: PropertyType[]
    if (allSelected) {
      newTypes = selectedTypes.filter(t => !types.includes(t))
    } else {
      newTypes = Array.from(new Set([...selectedTypes, ...types]))
    }

    setSelectedTypes(newTypes)
    setPage(1)
    updateURL({ propertyType: newTypes, page: 1 })
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setTransactionType('')
    setCity('')
    setMinPrice('')
    setMaxPrice('')
    setMinSize('')
    setMaxSize('')
    setMinBedrooms('')
    setMaxBedrooms('')
    setMinBathrooms('')
    setMinRooms('')
    setMinFloor('')
    setMaxFloor('')
    setMinYearBuilt('')
    setMaxYearBuilt('')
    setCondition('')
    setSelectedAmenities([])
    setSearch('')
    setSortBy('date_desc')
    setPage(1)
    router.push(pathname, { scroll: false })
  }

  type URLUpdates = Partial<{
    view: 'grid' | 'list' | 'map'
    search: string
    propertyType: PropertyType[]
    transactionType: TransactionType | ''
    city: string
    minPrice: string
    maxPrice: string
    minSize: string
    maxSize: string
    minBedrooms: string
    maxBedrooms: string
    minBathrooms: string
    minRooms: string
    minFloor: string
    maxFloor: string
    minYearBuilt: string
    maxYearBuilt: string
    condition: string
    amenities: string[]
    sort: string
    page: number
  }>

  const updateURL = (updates: URLUpdates) => {
    const params = new URLSearchParams()
    const v = {
      view: viewMode, search, propertyType: selectedTypes, transactionType, city,
      minPrice, maxPrice, minSize, maxSize, minBedrooms, maxBedrooms, minBathrooms, minRooms,
      minFloor, maxFloor, minYearBuilt, maxYearBuilt, condition,
      amenities: selectedAmenities, sort: sortBy, page, ...updates,
    }
    if (v.view) params.set('view', v.view)
    if (v.search) params.set('search', v.search)
    if (v.propertyType.length > 0) params.set('propertyType', v.propertyType.join(','))
    if (v.transactionType) params.set('transactionType', v.transactionType)
    if (v.city) params.set('city', v.city)
    if (v.minPrice) params.set('minPrice', v.minPrice)
    if (v.maxPrice) params.set('maxPrice', v.maxPrice)
    if (v.minSize) params.set('minSize', v.minSize)
    if (v.maxSize) params.set('maxSize', v.maxSize)
    if (v.minBedrooms) params.set('minBedrooms', v.minBedrooms)
    if (v.maxBedrooms) params.set('maxBedrooms', v.maxBedrooms)
    if (v.minBathrooms) params.set('minBathrooms', v.minBathrooms)
    if (v.minRooms) params.set('minRooms', v.minRooms)
    if (v.minFloor) params.set('minFloor', v.minFloor)
    if (v.maxFloor) params.set('maxFloor', v.maxFloor)
    if (v.minYearBuilt) params.set('minYearBuilt', v.minYearBuilt)
    if (v.maxYearBuilt) params.set('maxYearBuilt', v.maxYearBuilt)
    if (v.condition) params.set('condition', v.condition)
    if (v.amenities.length > 0) params.set('amenities', v.amenities.join(','))
    if (v.sort) params.set('sort', v.sort)
    if (v.page > 1) params.set('page', v.page.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const updateSearch = (value: string) => { setSearch(value); updateURL({ search: value }) }
  const updateTransactionType = (value: TransactionType | '') => { setTransactionType(value); setPage(1); updateURL({ transactionType: value, page: 1 }) }
  const updateSelectedTypes = (types: PropertyType[]) => { setSelectedTypes(types); setPage(1); updateURL({ propertyType: types, page: 1 }) }
  const updateCity = (value: string) => { setCity(value); updateURL({ city: value }) }
  const updateMinPrice = (value: string) => { setMinPrice(value); updateURL({ minPrice: value }) }
  const updateMaxPrice = (value: string) => { setMaxPrice(value); updateURL({ maxPrice: value }) }
  const updateMinSize = (value: string) => { setMinSize(value); updateURL({ minSize: value }) }
  const updateMaxSize = (value: string) => { setMaxSize(value); updateURL({ maxSize: value }) }
  const updateMinBedrooms = (value: string) => { setMinBedrooms(value); updateURL({ minBedrooms: value }) }
  const updateMaxBedrooms = (value: string) => { setMaxBedrooms(value); updateURL({ maxBedrooms: value }) }
  const updateMinBathrooms = (value: string) => { setMinBathrooms(value); updateURL({ minBathrooms: value }) }
  const updateMinRooms = (value: string) => { setMinRooms(value); updateURL({ minRooms: value }) }
  const updateMinFloor = (value: string) => { setMinFloor(value); updateURL({ minFloor: value }) }
  const updateMaxFloor = (value: string) => { setMaxFloor(value); updateURL({ maxFloor: value }) }
  const updateMinYearBuilt = (value: string) => { setMinYearBuilt(value); updateURL({ minYearBuilt: value }) }
  const updateMaxYearBuilt = (value: string) => { setMaxYearBuilt(value); updateURL({ maxYearBuilt: value }) }
  const updateCondition = (value: string) => { setCondition(value); updateURL({ condition: value }) }
  const toggleAmenity = (value: string) => {
    const next = selectedAmenities.includes(value)
      ? selectedAmenities.filter(a => a !== value)
      : [...selectedAmenities, value]
    setSelectedAmenities(next)
    updateURL({ amenities: next })
  }
  const updateSortBy = (value: string) => { setSortBy(value); updateURL({ sort: value }) }
  const updatePage = (value: number) => { setPage(value); updateURL({ page: value }) }

  const updateViewMode = (mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode)
    updateURL({ view: mode })
  }

  const applicability = getFilterApplicability(selectedTypes)

  // Empêche le scroll de la page derrière le tiroir
  useEffect(() => {
    document.body.style.overflow = showFilters ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showFilters])


  const getActiveFiltersCount = () => {
    let count = 0
    if (search) count++
    if (selectedTypes.length > 0) count++
    if (transactionType) count++
    if (city) count++
    if (minPrice || maxPrice) count++
    if (minSize || maxSize) count++
    if (minBedrooms || maxBedrooms) count++
    if (minBathrooms) count++
    if (minRooms) count++
    if (minFloor || maxFloor) count++
    if (minYearBuilt || maxYearBuilt) count++
    if (condition) count++
    if (selectedAmenities.length > 0) count++
    return count
  }

  return (
    <>
      {/* Sticky filter bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

          {/* Ligne unique : chips (collapsibles) + Filtres + ^ (toujours visibles) */}
          <div className="flex items-center gap-2 py-2.5 sm:py-3">


            {/* Chips — scrollables */}
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTransactionType(transactionType === 'SALE' ? '' : 'SALE')}
                      className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                        transactionType === 'SALE'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title="Acheter"
                    >
                      <ShoppingBagIcon className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">Acheter</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTransactionType(transactionType === 'RENT' ? '' : 'RENT')}
                      className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                        transactionType === 'RENT'
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title="Louer"
                    >
                      <KeyIcon className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">Louer</span>
                    </motion.button>

                    <div className="shrink-0 h-6 w-px bg-gray-300 dark:bg-gray-600" />

                    {[
                      { key: 'terrains' as const, icon: MapIcon, label: 'Terrains' },
                      { key: 'villas' as const, icon: HomeIcon, label: 'Maisons & Villas' },
                      { key: 'apartments' as const, icon: BuildingOfficeIcon, label: 'Appartements' },
                      { key: 'commercial' as const, icon: BuildingStorefrontIcon, label: 'Commercial' },
                    ].map(({ key, icon: Icon, label }) => (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectCategory(key)}
                        className={`shrink-0 h-9 w-9 sm:w-auto sm:px-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 text-sm ${
                          propertyCategories[key].every(t => selectedTypes.includes(t))
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={label}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">{label}</span>
                      </motion.button>
                    ))}
                  </div>
            </div>

            {/* Filtres — collé à droite */}
            <div className="shrink-0 ml-auto flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`h-9 px-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 text-sm border ${
                  showFilters || getActiveFiltersCount() > 0
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Affiner</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/25 text-white">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer — fixed, accessible from anywhere on the page */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-[2500]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white dark:bg-gray-900 z-[2600] shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    Affiner votre recherche
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Affinez votre recherche
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Scrollable filters */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                {/* 1. Transaction Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <ShoppingBagIcon className="h-4 w-4 text-primary-500" />
                    Type de transaction
                  </label>
                  <Select
                    value={transactionType || 'all'}
                    onValueChange={(value) => updateTransactionType(value === 'all' ? '' : value as TransactionType)}
                  >
                    <SelectTrigger className="w-full !h-[46px] !px-4 !py-0 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="SALE">Vente</SelectItem>
                      <SelectItem value="RENT">Location</SelectItem>
                      <SelectItem value="SEASONAL_RENT">Location saisonnière</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. City */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MapPinIcon className="h-4 w-4 text-primary-500" />
                    Ville ou quartier
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => updateCity(e.target.value)}
                      placeholder="Ex: Antananarivo"
                      className="w-full h-[46px] pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                    {city && (
                      <button
                        onClick={() => updateCity('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Price Range */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <CurrencyEuroIcon className="h-4 w-4 text-primary-500" />
                    Budget souhaité
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => updateMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full h-[46px] pl-4 pr-8 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">€</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => updateMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full h-[46px] pl-4 pr-8 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">€</span>
                    </div>
                  </div>
                </div>

                {/* 4. Size Range */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MapIcon className="h-4 w-4 text-primary-500" />
                      Surface recherchée
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={minSize}
                        onChange={(e) => updateMinSize(e.target.value)}
                        placeholder="Min"
                        className="w-full h-[46px] pl-4 pr-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">m²</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={maxSize}
                        onChange={(e) => updateMaxSize(e.target.value)}
                        placeholder="Max"
                        className="w-full h-[46px] pl-4 pr-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">m²</span>
                    </div>
                  </div>
                </div>

                {/* 5. Bedrooms */}
                {applicability.bedrooms && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <HomeIcon className="h-4 w-4 text-primary-500" />
                      Chambres (Min - Max)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={minBedrooms}
                        onChange={(e) => updateMinBedrooms(e.target.value)}
                        placeholder="Min"
                        min="0"
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <input
                        type="number"
                        value={maxBedrooms}
                        onChange={(e) => updateMaxBedrooms(e.target.value)}
                        placeholder="Max"
                        min="0"
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 6. Bathrooms */}
                {applicability.bathrooms && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <SparklesIcon className="h-4 w-4 text-primary-500" />
                      Salles de bain minimum
                    </label>
                    <input
                      type="number"
                      value={minBathrooms}
                      onChange={(e) => updateMinBathrooms(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                  </div>
                )}

                {/* 7. Rooms */}
                {applicability.rooms && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Squares2X2Icon className="h-4 w-4 text-primary-500" />
                      Nombre de pièces minimum
                    </label>
                    <input
                      type="number"
                      value={minRooms}
                      onChange={(e) => updateMinRooms(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                    />
                  </div>
                )}

                {/* 8. Floor */}
                {applicability.floor && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <BuildingLibraryIcon className="h-4 w-4 text-primary-500" />
                      Étage (Min - Max)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={minFloor}
                        onChange={(e) => updateMinFloor(e.target.value)}
                        placeholder="Min"
                        min="0"
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <input
                        type="number"
                        value={maxFloor}
                        onChange={(e) => updateMaxFloor(e.target.value)}
                        placeholder="Max"
                        min="0"
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 9. Year Built */}
                {applicability.yearBuilt && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <CalendarIcon className="h-4 w-4 text-primary-500" />
                      Année de construction
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={minYearBuilt}
                        onChange={(e) => updateMinYearBuilt(e.target.value)}
                        placeholder="Depuis"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                      <input
                        type="number"
                        value={maxYearBuilt}
                        onChange={(e) => updateMaxYearBuilt(e.target.value)}
                        placeholder="Jusqu'à"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 10. Condition */}
                {applicability.condition && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <WrenchScrewdriverIcon className="h-4 w-4 text-primary-500" />
                      État souhaité
                    </label>
                    <Select
                      value={condition || 'all'}
                      onValueChange={(value) => updateCondition(value === 'all' ? '' : value)}
                    >
                      <SelectTrigger className="w-full !h-[46px] !px-4 !py-0 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Peu importe</SelectItem>
                        <SelectItem value="NEW">Neuf</SelectItem>
                        <SelectItem value="EXCELLENT">Excellent état</SelectItem>
                        <SelectItem value="GOOD">Bon état</SelectItem>
                        <SelectItem value="TO_RENOVATE">À rénover</SelectItem>
                        <SelectItem value="UNDER_CONSTRUCTION">En construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 11. Amenities */}
                {applicability.amenities && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <SparklesIcon className="h-4 w-4 text-primary-500" />
                      Équipements souhaités
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_AMENITIES.map((amenity) => {
                        const selected = selectedAmenities.includes(amenity.value)
                        return (
                          <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                              selected
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                            }`}
                          >
                            {amenity.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 font-medium transition-all flex items-center gap-2 border border-transparent hover:border-red-200 dark:hover:border-red-800 text-sm"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Tout effacer
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Voir les biens {total > 0 && `(${total})`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 sm:pb-8">
        {/* Results Header */}
        <div className="space-y-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white shrink-0">
              {loading ? (
                <span className="inline-block h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ) : (
                <>{total} bien{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}</>
              )}
            </h2>

            <div className="flex items-center gap-2 ml-auto">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={updateSortBy}>
                <SelectTrigger className="w-[110px] sm:w-[175px] !h-9 !px-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary-500 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="date_desc">Nouveautés</SelectItem>
                  <SelectItem value="date_asc">Plus ancien</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="size_asc">Surface croissante</SelectItem>
                  <SelectItem value="size_desc">Surface décroissante</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle — desktop only */}
              <div className="hidden sm:flex gap-0.5 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                {[
                  { mode: 'grid' as const, Icon: Squares2X2Icon, title: 'Grille' },
                  { mode: 'list' as const, Icon: ListBulletIcon, title: 'Liste' },
                  { mode: 'map' as const, Icon: MapPinIcon, title: 'Carte' },
                ].map(({ mode, Icon, title }) => (
                  <motion.button
                    key={mode}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => updateViewMode(mode)}
                    title={title}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === mode
                        ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
                {/* Image Skeleton */}
                <div className="h-64 bg-gray-200 dark:bg-gray-700 w-full" />

                {/* Content Skeleton */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                  </div>

                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !properties || properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
          >
            <div className="max-w-md mx-auto px-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <HomeIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Aucun bien ne correspond encore
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Essayez d'élargir un peu vos critères. Le bon bien se cache parfois à un filtre près.
              </p>
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Repartir de zéro
              </button>
            </div>
          </motion.div>
        ) : viewMode === 'map' ? (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 isolate">
            <PropertiesMapViewDynamic properties={allProperties.length > 0 ? allProperties : properties} height="calc(100vh - 300px)" />
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyListItem key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="min-h-[400px]">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Hide for map view */}
        {total > 12 && viewMode !== 'map' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex justify-center items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updatePage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
            >
              Page précédente
            </motion.button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1)
                .filter((pageNum) => {
                  const totalPages = Math.ceil(total / 12)
                  // Show first page, last page, current page, and pages around current
                  return (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  )
                })
                .map((pageNum, index, array) => (
                  <React.Fragment key={`page-${pageNum}`}>
                    {/* Show ellipsis if there's a gap */}
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span key={`ellipsis-${pageNum}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updatePage(pageNum)}
                      className={`min-w-[40px] px-3 py-2 rounded-xl font-semibold transition-all ${pageNum === page
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {pageNum}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updatePage(page + 1)}
              disabled={page >= Math.ceil(total / 12)}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
            >
              Page suivante
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom View Bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2 safe-area-bottom">
          {[
            { mode: 'grid' as const, Icon: Squares2X2Icon, label: 'Grille' },
            { mode: 'list' as const, Icon: ListBulletIcon, label: 'Liste' },
            { mode: 'map' as const, Icon: MapPinIcon, label: 'Carte' },
          ].map(({ mode, Icon, label }) => (
            <motion.button
              key={mode}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateViewMode(mode)}
              className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all ${
                viewMode === mode
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      </div>
    </>
  )
}
