'use client'

import React, { createContext, useContext } from 'react'
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

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth()
  const queryClient = useQueryClient()

  // Define Query Key
  const favoritesKey = ['favorites'];

  // 1. Check Favorites (Fetch)
  const { data: favorites = [], isLoading, refetch } = useQuery<Favorite[]>({
    queryKey: favoritesKey,
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
  const favoriteIds = new Set(favorites.map(f => f.propertyId))

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
      queryClient.invalidateQueries({ queryKey: favoritesKey });
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
      queryClient.invalidateQueries({ queryKey: favoritesKey });
    }
  });

  const addToFavorites = async (propertyId: string) => {
    await addMutation.mutateAsync(propertyId);
  }

  const removeFromFavorites = async (propertyId: string) => {
    await removeMutation.mutateAsync(propertyId);
  }

  const isFavorite = (propertyId: string): boolean => {
    if (!isAuthenticated) return false
    return favoriteIds.has(propertyId)
  }

  const refreshFavorites = async () => {
    await refetch();
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoritesCount,
        favoriteIds,
        refreshFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading: isLoading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
