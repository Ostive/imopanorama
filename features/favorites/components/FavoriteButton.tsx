'use client'

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  propertyId: string;
  property?: any;
  className?: string;
  showText?: boolean;
  onlyIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({
  propertyId,
  property,
  className = '',
  showText = false,
  onlyIcon = false,
  size = 'md'
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // DISABLED: Check favorite status - was causing infinite API calls
  useEffect(() => {
    if (isAuthenticated) {
      // Only check local state, NO API calls
      const isInFavorites = isFavorite(propertyId);
      setIsFav(isInFavorites);
    }
  }, [propertyId, isAuthenticated, isFavorite]);

  // Gérer le clic sur le bouton de favoris
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);

    try {
      // Si le terrain complet est fourni, utiliser toggleFavorite
      // Sinon, on peut seulement retirer des favoris
      let result;
      if (property) {
        result = await toggleFavorite(property);
      } else if (isFav) {
        result = await removeFavorite(propertyId);
      } else {
        console.warn('Cannot add property to favorites without full property data');
        return;
      }

      if (result) {
        setIsFav(!isFav);
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Déterminer la taille de l'icône en fonction de la prop size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  // Déterminer les classes CSS en fonction des props
  const buttonClasses = onlyIcon
    ? `${getIconSize()} ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ${className}`
    : `inline-flex items-center gap-1 ${
        isFav 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 hover:text-red-500'
      } transition-colors ${className}`;

  // Rendu du bouton
  if (onlyIcon) {
    return isFav ? (
      <HeartIconSolid
        className={buttonClasses}
        onClick={handleToggleFavorite}
        aria-label="Retirer des favoris"
      />
    ) : (
      <HeartIcon
        className={buttonClasses}
        onClick={handleToggleFavorite}
        aria-label="Ajouter aux favoris"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${buttonClasses} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFav ? (
        <HeartIconSolid className={getIconSize()} />
      ) : (
        <HeartIcon className={getIconSize()} />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        </span>
      )}
    </button>
  );
}
