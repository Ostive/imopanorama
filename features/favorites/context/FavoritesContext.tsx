'use client'

import React, { createContext, use, useCallback, useMemo } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Favorite } from '@/features/favorites/types/favorites.types'

interface FavoritesContextType {
  favoritesCount: number
  favoriteIds: Set<string>
  refreshFavorites: () => Promise<void>
  addToFavorites: (propertyId: string) => Promise<void>
  removeFromFavorites: (propertyId: string) => Promise<void>
  isFavorite: (propertyId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)
const FAVORITES_KEY = ['favorites']

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth()
  const queryClient = useQueryClient()

  // 1. Check Favorites (Fetch)
  const { data: favorites = [], isLoading, refetch } = useQuery<Favorite[]>({
    queryKey: FAVORITES_KEY,
    queryFn: async () => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        const response = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) {
          if (response.status === 401) return [];
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        return data.favorites || [];
      } finally {
        clearTimeout(timer)
      }
    },
    enabled: !!isAuthenticated && !!token,
    initialData: [],
    staleTime: 60_000,      // don't refetch for 60s
    gcTime: 5 * 60_000,     // keep in cache 5 min
    retry: 1,
  })

  // Derived state
  const favoritesCount = favorites.length
  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.propertyId)), [favorites])

  // 2. Add Mutation
  const addMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) throw new Error('Failed to add favorite');
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    }
  });

  // 3. Remove Mutation
  const removeMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to remove favorite');
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    }
  });

  const addToFavorites = useCallback(async (propertyId: string) => {
    await addMutation.mutateAsync(propertyId);
  }, [addMutation])

  const removeFromFavorites = useCallback(async (propertyId: string) => {
    await removeMutation.mutateAsync(propertyId);
  }, [removeMutation])

  const isFavorite = useCallback((propertyId: string): boolean => {
    if (!isAuthenticated) return false
    return favoriteIds.has(propertyId)
  }, [favoriteIds, isAuthenticated])

  const refreshFavorites = useCallback(async () => {
    await refetch();
  }, [refetch])

  const value = useMemo(() => ({
    favoritesCount,
    favoriteIds,
    refreshFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading: isLoading
  }), [favoritesCount, favoriteIds, refreshFavorites, addToFavorites, removeFromFavorites, isFavorite, isLoading])

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = use(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
