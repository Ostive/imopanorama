'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  PropertyFiltersState,
  DEFAULT_FILTERS,
  PropertySortBy,
  PropertyViewMode,
} from '../types/filters.types'
import { PropertyType, TransactionType } from '../types/properties.types'

function parseFromSearchParams(sp: URLSearchParams): PropertyFiltersState {
  const next: PropertyFiltersState = { ...DEFAULT_FILTERS }

  const search = sp.get('search')
  if (search) next.search = search

  const view = sp.get('view')
  if (view === 'grid' || view === 'list' || view === 'map') next.viewMode = view

  const types = sp.get('propertyType')
  if (types) next.selectedTypes = types.split(',') as PropertyType[]

  const tx = sp.get('transactionType')
  if (tx) next.transactionType = tx as TransactionType

  next.country = sp.get('country') ?? ''
  next.region = sp.get('region') ?? ''
  next.city = sp.get('city') ?? ''
  next.minPrice = sp.get('minPrice') ?? ''
  next.maxPrice = sp.get('maxPrice') ?? ''
  next.minSize = sp.get('minSize') ?? ''
  next.maxSize = sp.get('maxSize') ?? ''
  next.minBedrooms = sp.get('minBedrooms') ?? ''
  next.maxBedrooms = sp.get('maxBedrooms') ?? ''
  next.minBathrooms = sp.get('minBathrooms') ?? ''
  next.minRooms = sp.get('minRooms') ?? ''
  next.minFloor = sp.get('minFloor') ?? ''
  next.maxFloor = sp.get('maxFloor') ?? ''
  next.minYearBuilt = sp.get('minYearBuilt') ?? ''
  next.maxYearBuilt = sp.get('maxYearBuilt') ?? ''
  next.condition = sp.get('condition') ?? ''

  const amenities = sp.get('amenities')
  if (amenities) next.selectedAmenities = amenities.split(',').filter(Boolean)

  const sort = sp.get('sort')
  if (sort) {
    next.sortBy = sort as PropertySortBy
  } else if (search) {
    next.sortBy = 'relevance'
  }

  const page = sp.get('page')
  if (page) next.page = parseInt(page, 10) || 1

  return next
}

function buildSearchParams(f: PropertyFiltersState): string {
  const p = new URLSearchParams()
  if (f.viewMode && f.viewMode !== 'grid') p.set('view', f.viewMode)
  if (f.search) p.set('search', f.search)
  if (f.selectedTypes.length > 0) p.set('propertyType', f.selectedTypes.join(','))
  if (f.transactionType) p.set('transactionType', f.transactionType)
  if (f.country) p.set('country', f.country)
  if (f.region) p.set('region', f.region)
  if (f.city) p.set('city', f.city)
  if (f.minPrice) p.set('minPrice', f.minPrice)
  if (f.maxPrice) p.set('maxPrice', f.maxPrice)
  if (f.minSize) p.set('minSize', f.minSize)
  if (f.maxSize) p.set('maxSize', f.maxSize)
  if (f.minBedrooms) p.set('minBedrooms', f.minBedrooms)
  if (f.maxBedrooms) p.set('maxBedrooms', f.maxBedrooms)
  if (f.minBathrooms) p.set('minBathrooms', f.minBathrooms)
  if (f.minRooms) p.set('minRooms', f.minRooms)
  if (f.minFloor) p.set('minFloor', f.minFloor)
  if (f.maxFloor) p.set('maxFloor', f.maxFloor)
  if (f.minYearBuilt) p.set('minYearBuilt', f.minYearBuilt)
  if (f.maxYearBuilt) p.set('maxYearBuilt', f.maxYearBuilt)
  if (f.condition) p.set('condition', f.condition)
  if (f.selectedAmenities.length > 0) p.set('amenities', f.selectedAmenities.join(','))
  if (f.sortBy && f.sortBy !== 'date_desc') p.set('sort', f.sortBy)
  if (f.page > 1) p.set('page', f.page.toString())
  return p.toString()
}

const FILTER_KEYS_RESET_PAGE: ReadonlyArray<keyof PropertyFiltersState> = [
  'selectedTypes', 'transactionType', 'country', 'region', 'city',
  'minPrice', 'maxPrice', 'minSize', 'maxSize',
  'minBedrooms', 'maxBedrooms', 'minBathrooms', 'minRooms',
  'minFloor', 'maxFloor', 'minYearBuilt', 'maxYearBuilt',
  'condition', 'selectedAmenities', 'search',
]

function countActive(f: PropertyFiltersState): number {
  let count = 0
  if (f.search) count++
  if (f.selectedTypes.length > 0) count++
  if (f.transactionType) count++
  if (f.country) count++
  if (f.region) count++
  if (f.city) count++
  if (f.minPrice || f.maxPrice) count++
  if (f.minSize || f.maxSize) count++
  if (f.minBedrooms || f.maxBedrooms) count++
  if (f.minBathrooms) count++
  if (f.minRooms) count++
  if (f.minFloor || f.maxFloor) count++
  if (f.minYearBuilt || f.maxYearBuilt) count++
  if (f.condition) count++
  if (f.selectedAmenities.length > 0) count++
  return count
}

export interface UsePropertyFiltersResult {
  filters: PropertyFiltersState
  updateFilters: (partial: Partial<PropertyFiltersState>) => void
  resetFilters: () => void
  activeCount: number
}

export function usePropertyFilters(): UsePropertyFiltersResult {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<PropertyFiltersState>(() => DEFAULT_FILTERS)

  // Mirror latest filters in a ref so updateFilters stays stable and
  // sees the freshest state when called multiple times in the same tick.
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  useEffect(() => {
    const next = parseFromSearchParams(searchParams)
    filtersRef.current = next
    setFilters(next)
  }, [searchParams])

  const updateFilters = useCallback(
    (partial: Partial<PropertyFiltersState>) => {
      const next = { ...filtersRef.current, ...partial }
      const touchedFilterKey = (Object.keys(partial) as (keyof PropertyFiltersState)[])
        .some(k => FILTER_KEYS_RESET_PAGE.includes(k))
      if (touchedFilterKey && partial.page === undefined) {
        next.page = 1
      }
      filtersRef.current = next
      setFilters(next)
      const qs = buildSearchParams(next)
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname]
  )

  const resetFilters = useCallback(() => {
    filtersRef.current = DEFAULT_FILTERS
    setFilters(DEFAULT_FILTERS)
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const activeCount = useMemo(() => countActive(filters), [filters])

  return { filters, updateFilters, resetFilters, activeCount }
}

export function buildPropertiesApiQuery(
  f: PropertyFiltersState,
  opts: { isMap?: boolean } = {}
): string {
  const params = new URLSearchParams()
  if (!opts.isMap) {
    params.set('page', f.page.toString())
    params.set('limit', '12')
  } else {
    params.set('limit', '1000')
  }
  if (f.selectedTypes.length > 0) params.set('propertyType', f.selectedTypes.join(','))
  if (f.transactionType) params.set('transactionType', f.transactionType)
  if (f.country) params.set('country', f.country)
  if (f.region) params.set('region', f.region)
  if (f.city) params.set('city', f.city)
  if (f.minPrice) params.set('minPrice', f.minPrice)
  if (f.maxPrice) params.set('maxPrice', f.maxPrice)
  if (f.minSize) params.set('minSize', f.minSize)
  if (f.maxSize) params.set('maxSize', f.maxSize)
  if (f.minBedrooms) params.set('minBedrooms', f.minBedrooms)
  if (f.maxBedrooms) params.set('maxBedrooms', f.maxBedrooms)
  if (f.minBathrooms) params.set('minBathrooms', f.minBathrooms)
  if (f.minRooms) params.set('minRooms', f.minRooms)
  if (f.minFloor) params.set('minFloor', f.minFloor)
  if (f.maxFloor) params.set('maxFloor', f.maxFloor)
  if (f.minYearBuilt) params.set('minYearBuilt', f.minYearBuilt)
  if (f.maxYearBuilt) params.set('maxYearBuilt', f.maxYearBuilt)
  if (f.condition) params.set('condition', f.condition)
  if (f.selectedAmenities.length > 0) params.set('amenities', f.selectedAmenities.join(','))
  if (f.search) params.set('search', f.search)
  if (!opts.isMap && f.sortBy) params.set('sort', f.sortBy)
  return params.toString()
}
