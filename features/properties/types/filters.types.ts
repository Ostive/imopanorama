import { PropertyType, TransactionType } from './properties.types'

export type PropertyViewMode = 'grid' | 'list' | 'map'

export type PropertySortBy =
  | 'relevance'
  | 'date_desc'
  | 'date_asc'
  | 'price_asc'
  | 'price_desc'
  | 'size_asc'
  | 'size_desc'

export interface PropertyFiltersState {
  selectedTypes: PropertyType[]
  transactionType: TransactionType | ''
  country: string
  region: string
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
  selectedAmenities: string[]
  search: string
  sortBy: PropertySortBy
  page: number
  viewMode: PropertyViewMode
}

export const DEFAULT_FILTERS: PropertyFiltersState = {
  selectedTypes: [],
  transactionType: '',
  country: '',
  region: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  minSize: '',
  maxSize: '',
  minBedrooms: '',
  maxBedrooms: '',
  minBathrooms: '',
  minRooms: '',
  minFloor: '',
  maxFloor: '',
  minYearBuilt: '',
  maxYearBuilt: '',
  condition: '',
  selectedAmenities: [],
  search: '',
  sortBy: 'date_desc',
  page: 1,
  viewMode: 'grid',
}

export const PROPERTY_CATEGORIES = {
  terrains: ['TERRAIN_RESIDENTIAL', 'TERRAIN_COMMERCIAL', 'TERRAIN_AGRICULTURAL', 'TERRAIN_INDUSTRIAL'] as PropertyType[],
  villas: ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE'] as PropertyType[],
  apartments: ['APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'] as PropertyType[],
  commercial: ['OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'] as PropertyType[],
} as const

export type PropertyCategoryKey = keyof typeof PROPERTY_CATEGORIES
