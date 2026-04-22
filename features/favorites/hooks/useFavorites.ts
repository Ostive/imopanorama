import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Property } from '@/features/properties/types';

interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property: Property;
}

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Charger les favoris avec React Query
  const { data: favorites = [], isLoading: loading, error } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des favoris');
      }
      const data = await response.json();
      return data.favorites || [];
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutations
  const addFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout du favori');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du favori');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const clearFavoritesMutation = useMutation({
    mutationFn: async (currentFavorites: Favorite[]) => {
      await Promise.all(
        currentFavorites.map((fav) =>
          fetch(`/api/favorites/${fav.propertyId}`, { method: 'DELETE' })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  // Helper functions
  const isFavorite = useCallback((propertyId: string) => {
    return favorites.some((fav: Favorite) => fav.propertyId === propertyId);
  }, [favorites]);

  const checkIsFavorite = useCallback(async (propertyId: string) => {
    return favorites.some((fav: Favorite) => fav.propertyId === propertyId);
  }, [favorites]);

  const addFavorite = useCallback(async (property: Property) => {
    if (!isAuthenticated || !user) return false;
    try {
      await addFavoriteMutation.mutateAsync(property.id);
      return true;
    } catch {
      return false;
    }
  }, [isAuthenticated, user, addFavoriteMutation]);

  const removeFavorite = useCallback(async (propertyId: string) => {
    if (!isAuthenticated || !user) return false;
    try {
      await removeFavoriteMutation.mutateAsync(propertyId);
      return true;
    } catch {
      return false;
    }
  }, [isAuthenticated, user, removeFavoriteMutation]);

  const toggleFavorite = useCallback(async (property: Property) => {
    if (isFavorite(property.id)) {
      return await removeFavorite(property.id);
    } else {
      return await addFavorite(property);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const clearFavorites = useCallback(async () => {
    if (!isAuthenticated || !user || favorites.length === 0) return false;
    try {
      await clearFavoritesMutation.mutateAsync(favorites);
      return true;
    } catch {
      return false;
    }
  }, [isAuthenticated, user, favorites, clearFavoritesMutation]);

  const loadFavorites = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
  }, [queryClient, user?.id]);

  return {
    favorites,
    loading,
    error: error ? (error as Error).message : null,
    isFavorite,
    checkIsFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
    count: favorites.length,
  };
}
