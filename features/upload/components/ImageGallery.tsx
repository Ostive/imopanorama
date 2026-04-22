import React, { useState } from 'react';
import Image from 'next/image';
import { XCircleIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { InlineLoader } from '@/shared/components/ui/Loader';
import { bunnyCdnService } from '../services/bunnyCdnService';
import { useTheme } from '@/shared/theme/ThemeContext';

interface ImageGalleryProps {
  images: string[];
  onDelete?: (imageUrl: string, index: number) => Promise<void>;
  onSort?: (newOrder: string[]) => void;
  onImageClick?: (imageUrl: string) => void;
  loading?: boolean;
  className?: string;
  editable?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onDelete,
  onSort,
  onImageClick,
  loading = false,
  className = '',
  editable = true
}) => {
  const { currentTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fonction pour gérer la suppression d'une image
  const handleDelete = async (imageUrl: string, index: number) => {
    if (!onDelete) return;

    try {
      setIsDeleting(index);
      await onDelete(imageUrl, index);
    } finally {
      setIsDeleting(null);
    }
  };

  // Fonction pour ouvrir l'image en plein écran
  const openFullscreen = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Fonction pour fermer l'image en plein écran
  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  // Rendu quand il n'y a pas d'images
  if (images.length === 0) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center ${className}`}>
        {loading ? (
          <div className="flex justify-center">
            <InlineLoader text="Chargement des images..." />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune image disponible</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Grille d'images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={`image-${index}`} className="relative group aspect-square">
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => onImageClick ? onImageClick(imageUrl) : openFullscreen(imageUrl)}
              />

              {editable && (
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center ${onImageClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onImageClick && onImageClick(imageUrl)}>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {!onImageClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullscreen(imageUrl);
                        }}
                        className="p-1 bg-gray-800 dark:bg-gray-600 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
                        title="Voir en plein écran"
                      >
                        <ArrowsPointingOutIcon className="h-4 w-4" />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(imageUrl, index);
                        }}
                        className="p-1 bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-500 dark:hover:bg-red-400 transition-colors"
                        title="Supprimer l'image"
                        disabled={isDeleting === index}
                      >
                        {isDeleting === index ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <XCircleIcon className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal plein écran */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 dark:bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg transition-colors"
              onClick={closeFullscreen}
            >
              <XCircleIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </button>
            <div className="relative w-full h-full">
              <img
                src={selectedImage}
                alt="Image en plein écran"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
