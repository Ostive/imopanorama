'use client'

import { useQuery } from '@tanstack/react-query';

export interface SemanticSearchParams {
  query: string;
  city?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  lat?: number;
  lon?: number;
  radius?: number; // in km
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  score: number;
  property: any;
}

export function useSemanticSearch(params: SemanticSearchParams) {
  const { query, ...filters } = params;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['semantic-search', params],
    queryFn: async () => {
      if (!query || query.trim().length === 0) {
        return { results: [], total: 0, query: '' };
      }

      const searchParams = new URLSearchParams();
      searchParams.set('q', query);

      // Add filters
      if (filters.city) searchParams.set('city', filters.city);
      if (filters.type) searchParams.set('type', filters.type);
      if (filters.status) searchParams.set('status', filters.status);
      if (filters.minPrice) searchParams.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice.toString());
      if (filters.minSize) searchParams.set('minSize', filters.minSize.toString());
      if (filters.maxSize) searchParams.set('maxSize', filters.maxSize.toString());
      if (filters.limit) searchParams.set('limit', filters.limit.toString());
      if (filters.offset) searchParams.set('offset', filters.offset.toString());

      // Geo-location
      if (filters.lat && filters.lon && filters.radius) {
        searchParams.set('lat', filters.lat.toString());
        searchParams.set('lon', filters.lon.toString());
        searchParams.set('radius', filters.radius.toString());
      }

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    results: data?.results || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
