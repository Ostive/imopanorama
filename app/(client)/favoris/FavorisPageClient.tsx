'use client'

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { redirect } from 'next/navigation';
import { m } from 'framer-motion';
import PropertyCard from '@/features/properties/components/PropertyCard';
import { HeartIcon, ExclamationTriangleIcon, ArrowPathIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites as useFavoritesContext } from '@/features/favorites/context/FavoritesContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function FavorisLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-muted rounded-2xl mr-4"></div>
              <div>
                <div className="h-8 bg-muted rounded w-48 mb-2"></div>
                <div className="h-4 bg-muted rounded w-64"></div>
              </div>
            </div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-muted"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="flex items-center justify-between pt-4">
                  <div className="h-8 bg-muted rounded w-32"></div>
                  <div className="h-10 bg-muted rounded-full w-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FavorisPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { refreshFavorites, removeFromFavorites } = useFavoritesContext();
  const [favorites, setFavorites] = useState<any[]>([]);

  const { data: favoritesData, isLoading: loading } = useQuery({
    queryKey: ['favorites-page'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) throw new Error('Erreur lors du chargement des favoris');
      return response.json();
    },
  });

  useEffect(() => {
    if (favoritesData) setFavorites(favoritesData.favorites || []);
  }, [favoritesData]);

  if (!authLoading && !isAuthenticated) redirect('/login');

  // Remove single favorite
  const removeFavorite = async (propertyId: string) => {
    try {
      await removeFromFavorites(propertyId);
      setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
      toast.success('Retiré des favoris');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Clear all favorites
  const clearFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites([]);
        await refreshFavorites(); // Update navbar count
        toast.success('Tous les favoris ont été supprimés');
      } else {
        throw new Error('Failed to clear favorites');
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (authLoading || loading) {
    return <FavorisLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Le redirect se fait dans useEffect
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête amélioré */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <m.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-linear-to-br from-red-500 to-pink-600 rounded-2xl p-4 mr-4 shadow-lg"
              >
                <HeartSolidIcon className="h-8 w-8 text-white" />
              </m.div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Mes Favoris
                </h1>
                <p className="text-muted-foreground mt-1">
                  Vos terrains préférés en un seul endroit
                </p>
              </div>
            </div>

            {favorites.length > 0 && (
              <m.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card rounded-2xl shadow-lg px-6 py-3 border-2 border-red-200 dark:border-red-800"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{favorites.length}</div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {favorites.length === 1 ? 'Favori' : 'Favoris'}
                  </div>
                </div>
              </m.div>
            )}
          </div>
        </m.div>

        {/* Carte d'accueil utilisateur */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-3xl shadow-xl p-8 mb-12 border border-red-100 dark:border-red-900/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-card rounded-2xl p-4 mr-6 shadow-md">
                <HeartSolidIcon className="h-10 w-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Bonjour {user?.firstName} ! 👋
                </h2>
                <p className="text-foreground text-lg">
                  {favorites.length === 0
                    ? "Commencez à ajouter vos propriétés préférées"
                    : `Vous avez ${favorites.length} propriété${favorites.length !== 1 ? 's' : ''} sauvegardée${favorites.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>

            {favorites.length > 0 && (
              <Link
                href="/proprietes"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-card hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors font-semibold text-foreground shadow-md"
              >
                <SparklesIcon className="w-5 h-5" />
                Découvrir plus
              </Link>
            )}
          </div>
        </m.div>

        {/* Liste des favoris */}
        {favorites.length > 0 ? (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Vos Terrains Favoris</h2>
                <p className="text-muted-foreground mt-1">{favorites.length} terrain{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}</p>
              </div>
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir vider tous vos favoris ?')) {
                    clearFavorites();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors font-medium border border-red-200 dark:border-red-800"
                title="Vider tous les favoris"
              >
                <TrashIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Vider tout</span>
              </m.button>
            </m.div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
              {favorites.map((favorite: any, index: number) => (
                <m.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <PropertyCard property={favorite.property} variant="featured" />
                  {/* Bouton pour retirer des favoris */}
                  <m.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFavorite(favorite.propertyId)}
                    className="absolute top-4 right-4 bg-card rounded-full p-3 shadow-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border-2 border-red-200 dark:border-red-800 opacity-0 group-hover:opacity-100"
                    title="Retirer des favoris"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  </m.button>
                </m.div>
              ))}
            </div>
          </>

        ) : (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl shadow-xl p-16 text-center"
          >
            <m.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <div className="bg-linear-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full p-8 inline-block mb-6">
                <HeartIcon className="h-20 w-20 text-red-400 dark:text-red-300" />
              </div>
            </m.div>

            <h3 className="text-3xl font-bold text-foreground mb-4">
              Aucun favori pour le moment
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Vous n'avez pas encore ajouté de propriétés à vos favoris.
              Parcourez notre sélection et cliquez sur le cœur pour sauvegarder vos propriétés préférées !
            </p>

            <Link
              href="/proprietes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <SparklesIcon className="w-6 h-6" />
              Découvrir nos propriétés
            </Link>

            <div className="bg-linear-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-6 text-left mt-12 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="bg-primary-500 rounded-xl p-3 mr-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-primary-900 dark:text-primary-200 mb-2 text-lg">Comment ajouter des favoris ?</p>
                  <p className="text-primary-700 dark:text-primary-300">
                    Sur chaque fiche propriété, cliquez sur l'icône <HeartSolidIcon className="inline h-5 w-5 text-red-500" /> pour l'ajouter à vos favoris.
                    Vous pourrez ensuite les retrouver ici à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </m.div>
        )}

        {/* Actions en bas de page */}
        {favorites.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/proprietes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border-2 border-border shadow-lg text-base font-semibold rounded-xl text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-xl transition-all"
            >
              <SparklesIcon className="h-5 w-5" />
              Découvrir nos propriétés
            </Link>
          </m.div>
        )}
      </div>
    </div>
  );
}
