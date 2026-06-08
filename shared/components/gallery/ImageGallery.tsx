'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const navigateGallery = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;

    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    setSelectedImage(images[newIndex]);
  }, [selectedImage, images]);

  // Gestion des touches du clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next');
      } else if (e.key === 'ArrowLeft') {
        navigateGallery('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, navigateGallery]);

  // Gestion des événements tactiles pour le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!lightboxOpen) return;
    
    const minSwipeDistance = 50;
    const direction = touchStart - touchEnd;

    if (Math.abs(direction) > minSwipeDistance) {
      if (direction > 0) {
        // Swipe gauche -> image suivante
        navigateGallery('next');
      } else {
        // Swipe droite -> image précédente
        navigateGallery('prev');
      }
    }
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Réactiver le défilement
  };

  return (
    <>
      {/* Grille de vignettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="group relative bg-card rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <button type="button"
                  onClick={() => openLightbox(image)}
                  className="bg-card text-gray-800 dark:text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300"
                  aria-label="Agrandir l'image"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {image.title && (
                <h3 className="text-lg font-semibold text-foreground">
                  {image.title}
                </h3>
              )}
              {image.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {image.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* Bouton fermer */}
            <button type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
              aria-label="Fermer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation */}
            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('prev');
              }}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200`}
              aria-label="Image précédente"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            <button type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateGallery('next');
              }}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200`}
              aria-label="Image suivante"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>

            {/* Image */}
            <div 
              className="relative max-w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] rounded-lg"
              />
            </div>

            {/* Légende */}
            {(selectedImage.title || selectedImage.description) && (
              <div 
                className="bg-black bg-opacity-70 text-white p-4 rounded-lg mt-4 max-w-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedImage.title && (
                  <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-200">{selectedImage.description}</p>
                )}
              </div>
            )}

            {/* Indicateur de position */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {images.map((img, index) => (
                <button type="button"
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    selectedImage.id === img.id 
                      ? `bg-primary-500 w-4` 
                      : 'bg-gray-400 bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
