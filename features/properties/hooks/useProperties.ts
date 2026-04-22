'use client'

import { useQuery } from '@tanstack/react-query'
import { Property } from '@/features/properties/types/properties.types'
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout'

interface UsePropertiesReturn {
  properties: Property[]
  loading: boolean
  error: Error | null
}

export function useFeaturedProperties(limit: number = 6): UsePropertiesReturn {
  const { data: properties = [], isLoading: loading, error } = useQuery<Property[]>({
    queryKey: ['featuredProperties', limit],
    queryFn: async () => {
      const response = await fetch(`/api/properties?isFeatured=true&limit=${limit}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des propriétés')
      }
      const data = await response.json()
      return (data.data || data.properties || []) as Property[]
    }
  })

  return { properties, loading, error: error as Error | null }
}

export function useProperties(filters?: {
  propertyType?: string
  transactionType?: string
  minPrice?: number
  maxPrice?: number
  minSize?: number
  maxSize?: number
  city?: string
  minBedrooms?: number
  search?: string
  page?: number
  limit?: number
  sort?: string
  enabled?: boolean
}): UsePropertiesReturn & { total: number } {

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['properties', filters],
    enabled: filters?.enabled !== false,
    staleTime: 2 * 60_000,
    retry: 1,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.propertyType) params.set('propertyType', filters.propertyType)
      if (filters?.transactionType) params.set('transactionType', filters.transactionType)
      if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString())
      if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
      if (filters?.minSize) params.set('minSize', filters.minSize.toString())
      if (filters?.maxSize) params.set('maxSize', filters.maxSize.toString())
      if (filters?.city) params.set('city', filters.city)
      if (filters?.minBedrooms) params.set('minBedrooms', filters.minBedrooms.toString())
      if (filters?.search) params.set('search', filters.search)
      if (filters?.page) params.set('page', filters.page.toString())
      if (filters?.limit) params.set('limit', filters.limit.toString())
      if (filters?.sort) params.set('sort', filters.sort)

      const response = await fetchWithTimeout(`/api/properties?${params.toString()}`, {}, 5000)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des propriétés')
      }

      // API returns { success, data: Property[], total, page, totalPages }
      const json = await response.json()
      return {
        properties: (json.data || json.properties || []) as Property[],
        total: json.total || 0,
      }
    }
  })

  return {
    properties: data?.properties || [],
    total: data?.total || 0,
    loading,
    error: error as Error | null
  }
}
