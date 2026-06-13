'use client'

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { m, AnimatePresence } from 'framer-motion';
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_CONDITION_LABELS, PROPERTY_LEGAL_STATUS_LABELS, PROPERTY_DOCUMENT_STATUS_LABELS } from '@/features/properties/types';
import { formatPrice, formatDate } from '@/shared/utils';
import { getMarketConfig } from '@/shared/config/markets';
import { useFavorites } from '@/features/favorites/context/FavoritesContext';
import { logger } from '@/infrastructure/logger/logger';
import { toast } from 'react-hot-toast';
import ContactForm from '@/features/contacts/components/ContactForm';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PropertyDetailSkeleton } from '@/shared/components/loading';
import { useImageFallback } from '@/shared/hooks/useImageFallback';
import { ShareDropdown } from '@/shared/components/ui/ShareMenu';
import { PropertyInfoItem } from '@/shared/components/ui/PropertyInfoItem';
import { PropertySectionHeader } from '@/shared/components/ui/PropertySectionHeader';
import { ContactInfoItem } from '@/shared/components/ui/ContactInfoItem';
import { AgencyActionButtons } from '@/shared/components/ui/AgencyActionButtons';
import ScheduleVisitModal from '@/features/properties/components/ScheduleVisitModal';

// Dynamic import for MapLibre GL (~200KB) - only loads when map section is reached
const PropertyMap = dynamicImport(() => import('@/shared/components/map/PropertyMap'), {
  loading: () => (
    <Card className="w-full h-96">
      <CardContent className="flex items-center justify-center h-full p-6">
        <Skeleton className="w-full h-full" />
      </CardContent>
    </Card>
  ),
  ssr: false // MapLibre requires browser APIs
});
import {
  HeartIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  StarIcon,
  HomeModernIcon,
  HomeIcon,
  BoltIcon,
  ClockIcon,
  EyeIcon,
  VideoCameraIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  TagIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  BookmarkIcon,
  PhotoIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Bed, Bath, DoorOpen, Trees } from 'lucide-react';

const propertyStatusConfig = {
  available: { label: 'Disponible', variant: 'default' as const },
  sold: { label: 'Vendu', variant: 'destructive' as const },
  reserved: { label: 'Réservé', variant: 'secondary' as const },
};

interface ImageGalleryProps {
  images: string[];
  title: string;
}

function ImageGallery({ images: rawImages, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { handleImageError, safeImages } = useImageFallback();

  // Filtrer les images cassées dès le départ (pas de retry inutile)
  const images = safeImages(rawImages);

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-video">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Aucune image disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile: Carousel view */}
      <div className="block lg:hidden">
        {/* Image principale — plein bord */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900 group"
        >
          <Image
            src={images[currentImageIndex]}
            alt={`${title || 'Propriété'} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== '/images/properties/property-placeholder.jpg') {
                target.src = '/images/properties/property-placeholder.jpg'
              }
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

          {images.length > 1 && (
            <>
              <m.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <Button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-xl"
                  aria-label="Image précédente"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </m.div>
              <m.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Button
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-xl"
                  aria-label="Image suivante"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </m.div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Fullscreen button */}
          <Button
            onClick={() => setIsFullscreen(true)}
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 rounded-full shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </Button>
        </m.div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 px-3 pt-2 pb-1">
            {images.map((image, index) => (
              <m.button
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${index === currentImageIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border/40 hover:border-primary/40'
                  }`}
              >
                <Image
                  src={image}
                  alt={`Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="150px"
                  onError={handleImageError}
                />
                {index === currentImageIndex && (
                  <div className="absolute inset-0 bg-primary/20"></div>
                )}
              </m.button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Fixed-height layouts adapted to image count */}
      <div className="hidden lg:block relative">

        {/* === 1 image : pleine largeur, hauteur fixe 480px === */}
        {images.length === 1 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.005 }}
            className="cursor-pointer group relative h-[480px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
            onClick={() => { setCurrentImageIndex(0); setIsFullscreen(true); }}
          >
            <Image
              src={images[0]}
              alt={`${title || 'Propriété'} - Image 1`}
              fill
              className="object-cover"
              sizes="70vw"
              priority
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </m.div>
        )}

        {/* === 2 images : 2 colonnes égales, hauteur fixe 400px === */}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-3 h-[400px]">
            {images.map((image, index) => (
              <m.div
                key={image}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                  index === 0 ? 'rounded-l-2xl rounded-r-lg' : 'rounded-r-2xl rounded-l-lg'
                }`}
                onClick={() => { setCurrentImageIndex(index); setIsFullscreen(true); }}
              >
                <Image
                  src={image}
                  alt={`${title || 'Propriété'} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="35vw"
                  priority
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </m.div>
            ))}
          </div>
        )}

        {/* === 3 images : 1 grande à gauche (2/3) + 2 empilées à droite (1/3), hauteur fixe 480px === */}
        {images.length === 3 && (
          <div className="grid grid-cols-3 gap-3 h-[480px]">
            {/* Grande image gauche */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.005 }}
              className="col-span-2 cursor-pointer group relative rounded-l-2xl rounded-r-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              onClick={() => { setCurrentImageIndex(0); setIsFullscreen(true); }}
            >
              <Image
                src={images[0]}
                alt={`${title || 'Propriété'} - Image 1`}
                fill
                className="object-cover"
                sizes="50vw"
                priority
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </m.div>

            {/* 2 images empilées à droite */}
            <div className="flex flex-col gap-3">
              {images.slice(1, 3).map((image, index) => (
                <m.div
                  key={image}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`cursor-pointer group relative flex-1 overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                    index === 0 ? 'rounded-tr-2xl rounded-bl-lg' : 'rounded-br-2xl rounded-tl-lg'
                  }`}
                  onClick={() => { setCurrentImageIndex(index + 1); setIsFullscreen(true); }}
                >
                  <Image
                    src={image}
                    alt={`${title || 'Propriété'} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                    priority={index === 0}
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </m.div>
              ))}
            </div>
          </div>
        )}

        {/* === 4 images : 1 grande à gauche (1/2) + 3 en grille à droite (1/2), hauteur fixe 480px === */}
        {images.length === 4 && (
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            {/* Grande image gauche */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.005 }}
              className="cursor-pointer group relative rounded-l-2xl rounded-r-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              onClick={() => { setCurrentImageIndex(0); setIsFullscreen(true); }}
            >
              <Image
                src={images[0]}
                alt={`${title || 'Propriété'} - Image 1`}
                fill
                className="object-cover"
                sizes="40vw"
                priority
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </m.div>

            {/* 3 images à droite : 1 en haut pleine largeur + 2 en bas */}
            <div className="flex flex-col gap-3">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer group relative flex-1 rounded-tr-2xl rounded-bl-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                onClick={() => { setCurrentImageIndex(1); setIsFullscreen(true); }}
              >
                <Image
                  src={images[1]}
                  alt={`${title || 'Propriété'} - Image 2`}
                  fill
                  className="object-cover"
                  sizes="30vw"
                  priority
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </m.div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {images.slice(2, 4).map((image, index) => (
                  <m.div
                    key={image}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 2) * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                      index === 1 ? 'rounded-br-2xl rounded-tl-lg' : 'rounded-lg'
                    }`}
                    onClick={() => { setCurrentImageIndex(index + 2); setIsFullscreen(true); }}
                  >
                    <Image
                      src={image}
                      alt={`${title || 'Propriété'} - Image ${index + 3}`}
                      fill
                      className="object-cover"
                      sizes="15vw"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === 5+ images : 1 grande à gauche (1/2) + 4 en grille 2x2 à droite, hauteur fixe 500px === */}
        {images.length >= 5 && (
          <div className="grid grid-cols-2 gap-3 h-[500px]">
            {/* Grande image gauche */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.005 }}
              className="cursor-pointer group relative rounded-l-2xl rounded-r-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              onClick={() => { setCurrentImageIndex(0); setIsFullscreen(true); }}
            >
              <Image
                src={images[0]}
                alt={`${title || 'Propriété'} - Image 1`}
                fill
                className="object-cover"
                sizes="40vw"
                priority
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </m.div>

            {/* Grille 2x2 à droite */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {images.slice(1, 5).map((image, index) => {
                const isTopRight = index === 1;
                const isBottomRight = index === 3;
                const roundedClass = index === 0 ? 'rounded-lg'
                  : isTopRight ? 'rounded-tr-2xl rounded-bl-lg'
                  : index === 2 ? 'rounded-lg'
                  : 'rounded-br-2xl rounded-tl-lg';

                return (
                  <m.div
                    key={image}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className={`cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all ${roundedClass}`}
                    onClick={() => { setCurrentImageIndex(index + 1); setIsFullscreen(true); }}
                  >
                    <Image
                      src={image}
                      alt={`${title || 'Propriété'} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="20vw"
                      priority={index < 2}
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Bouton "+X photos" sur la dernière image si plus de 5 */}
                    {index === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-white text-center">
                          <p className="text-3xl font-bold">+{images.length - 5}</p>
                          <p className="text-sm font-medium mt-1">photos</p>
                        </div>
                      </div>
                    )}
                  </m.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton style Airbnb : nombre de photos + plein écran */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-900 hover:bg-gray-50 shadow-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Afficher les {images.length} photos
        </button>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-linear-to-b from-black/80 to-transparent p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-gray-300">Image {currentImageIndex + 1} sur {images.length}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Download button */}
                <m.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = images[currentImageIndex];
                      link.download = `${title}-${currentImageIndex + 1}.jpg`;
                      link.click();
                    }}
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    title="Télécharger l'image"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </Button>
                </m.div>

                {/* Close button */}
                <m.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => setIsFullscreen(false)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                    title="Fermer"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </m.div>
              </div>
            </div>
          </div>

          {/* Main image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20">
            <m.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentImageIndex]}
                alt={`${title || 'Propriété'} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
                onError={handleImageError}
              />
            </m.div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <m.div
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-6 top-1/2 -translate-y-1/2"
              >
                <Button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  variant="ghost"
                  size="icon-lg"
                  className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 shadow-2xl"
                  aria-label="Image précédente"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </m.div>

              <m.div
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-1/2 -translate-y-1/2"
              >
                <Button
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  variant="ghost"
                  size="icon-lg"
                  className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 shadow-2xl"
                  aria-label="Image suivante"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </m.div>
            </>
          )}

          {/* Bottom thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/80 to-transparent p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {images.map((image, index) => (
                    <m.button
                      key={image}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/20 hover:border-white/40'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                        onError={handleImageError}
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-white/20"></div>
                      )}
                    </m.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/60 text-sm hidden md:block">
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
                Navigation
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
                Fermer
              </span>
            </div>
          </div>
        </m.div>
      )}
    </>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToFavorites, removeFromFavorites, isFavorite: checkIsFavorite } = useFavorites();

  const fetchProperty = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, { signal });
      const data = await response.json();

      if (data.success) {
        setProperty(data.data);
      } else {
        setError('Property not found');
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      logger.error('Error fetching property', error);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;
    const controller = new AbortController();
    fetchProperty(controller.signal);
    return () => controller.abort();
  }, [propertyId, fetchProperty]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!propertyId) return;
      try {
        const favorite = await checkIsFavorite(propertyId);
        setIsFavorite(favorite);
      } catch (error) {
        logger.error('Error checking favorite:', error);
      }
    };
    checkFavorite();
  }, [propertyId, checkIsFavorite]);

  const handleToggleFavorite = async () => {
    if (!property) return;

    const previousState = isFavorite;
    setIsTogglingFavorite(true);
    setIsFavorite(!isFavorite);

    try {
      if (isFavorite) {
        await removeFromFavorites(property.id);
        toast.success('Retiré des favoris');
      } else {
        await addToFavorites(property.id);
        toast.success('Ajouté aux favoris');
      }
    } catch (error: any) {
      setIsFavorite(previousState);
      if (error.message?.includes('401') || error.message?.includes('Non autorisé')) {
        toast.error('Veuillez vous connecter pour gérer vos favoris');
      } else {
        toast.error('Une erreur est survenue');
      }
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleScheduleVisit = () => {
    setShowVisitModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3" />
          <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {[1, 2, 3].map(i => <div key={`property-detail-skeleton-${i}`} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
            </div>
            <div className="h-[520px] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-50 mb-2">Propriété introuvable</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Cette propriété n'existe pas ou a été supprimée.</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/proprietes">Retour aux propriétés</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = propertyStatusConfig[property.status as keyof typeof propertyStatusConfig] || propertyStatusConfig.available;
  const market = getMarketConfig(property.country);
  const locationParts = [property.location, property.city, property.region, market.label].filter(Boolean);
  const locationLabel = locationParts.length > 0 ? locationParts.join(', ') : 'Localisation non renseignée';
  const documentLabel = property.documentStatus
    ? PROPERTY_DOCUMENT_STATUS_LABELS[property.documentStatus] || property.documentStatus
    : null;
  const legalLabel = property.legalStatus
    ? PROPERTY_LEGAL_STATUS_LABELS[property.legalStatus] || property.legalStatus
    : null;

  const pricePerM2Display = property.pricePerM2
    ? formatPrice(Math.round(property.pricePerM2), property.currency, property.country)
    : property.price && property.totalSize && property.totalSize > 0
      ? formatPrice(Math.round(property.price / property.totalSize), property.currency, property.country)
      : null;

  const statusBadgeClass =
    property.status === 'AVAILABLE' ? 'bg-emerald-500/90'
    : property.status === 'SOLD' ? 'bg-red-500/90'
    : property.status === 'RESERVED' ? 'bg-amber-500/90'
    : 'bg-emerald-500/90';

  const legalItems = [
    { label: 'Statut foncier', value: legalLabel || 'À confirmer', ok: !!legalLabel },
    { label: 'Documents du bien', value: documentLabel || 'Non renseigné', ok: property.documentStatus === 'VERIFIED' },
    { label: 'Titre foncier / cadastre', value: property.legalStatus === 'TITLED' || property.legalStatus === 'CADASTRAL' ? legalLabel || 'Document déclaré' : 'À demander', ok: property.legalStatus === 'TITLED' || property.legalStatus === 'CADASTRAL' },
    { label: 'Bornage et limites', value: property.fokontany || property.commune ? 'Zone localisée' : 'À vérifier sur place', ok: !!property.fokontany || !!property.commune },
    { label: 'Propriétaire', value: property.isVerified ? 'Bien vérifié' : 'Vérification recommandée', ok: !!property.isVerified },
    { label: 'Mutation / vente', value: 'À valider avec les documents originaux', ok: false },
  ];

  const charItems = [
    { label: 'Surface totale', value: `${property.totalSize} m²`, icon: <ArrowsPointingOutIcon className="w-4 h-4" /> },
    { label: 'Type de bien', value: PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType, icon: <HomeModernIcon className="w-4 h-4" /> },
    { label: 'Transaction', value: property.transactionType === 'SALE' ? 'Vente' : property.transactionType === 'RENT' ? 'Location' : 'Saisonnier', icon: <BanknotesIcon className="w-4 h-4" /> },
    { label: 'Ville', value: property.city, icon: <MapPinIcon className="w-4 h-4" /> },
    ...(property.bedrooms ? [{ label: 'Chambres', value: String(property.bedrooms), icon: <Bed className="w-4 h-4" /> }] : []),
    ...(property.bathrooms ? [{ label: 'Salles de bain', value: String(property.bathrooms), icon: <Bath className="w-4 h-4" /> }] : []),
    ...(property.rooms ? [{ label: 'Pièces', value: String(property.rooms), icon: <DoorOpen className="w-4 h-4" /> }] : []),
    ...(property.livingSize && property.livingSize !== property.totalSize ? [{ label: 'Surface habitable', value: `${property.livingSize} m²`, icon: <HomeIcon className="w-4 h-4" /> }] : []),
    ...(property.landSize ? [{ label: 'Terrain', value: `${property.landSize} m²`, icon: <Trees className="w-4 h-4" /> }] : []),
  ];

  const detailItems = [
    ...(property.yearBuilt ? [{ label: 'Année de construction', value: String(property.yearBuilt), icon: <ClockIcon className="w-4 h-4" /> }] : []),
    ...(property.condition ? [{ label: 'État', value: PROPERTY_CONDITION_LABELS[property.condition] || property.condition, icon: <CheckCircleIcon className="w-4 h-4" /> }] : []),
    ...(property.energyClass ? [{ label: 'Classe énergétique', value: property.energyClass, icon: <BoltIcon className="w-4 h-4" /> }] : []),
    ...(property.floor !== null && property.floor !== undefined ? [{ label: 'Étage', value: `${property.floor}ème`, icon: <BuildingOfficeIcon className="w-4 h-4" /> }] : []),
    ...(property.floors ? [{ label: "Nb d'étages", value: String(property.floors), icon: <BuildingOffice2Icon className="w-4 h-4" /> }] : []),
    ...(property.reference ? [{ label: 'Référence', value: property.reference, icon: <BookmarkIcon className="w-4 h-4" /> }] : []),
    ...(property.commune ? [{ label: 'Commune', value: property.commune, icon: <MapPinIcon className="w-4 h-4" /> }] : []),
    ...(property.fokontany ? [{ label: 'Fokontany / secteur', value: property.fokontany, icon: <MapPinIcon className="w-4 h-4" /> }] : []),
    ...(legalLabel ? [{ label: 'Statut foncier', value: legalLabel, icon: <DocumentTextIcon className="w-4 h-4" /> }] : []),
    ...(documentLabel && property.documentStatus !== 'UNKNOWN' ? [{ label: 'Documents', value: documentLabel, icon: <CheckCircleIcon className="w-4 h-4" /> }] : []),
  ];

  const hasDetails = detailItems.length > 0;

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-12">
      {/* Visit modal */}
      {showVisitModal && property && (
        <ScheduleVisitModal
          isOpen={showVisitModal}
          onClose={() => setShowVisitModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
        />
      )}

      {/* Sticky breadcrumb nav */}
      <m.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-11 flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-gray-400 hover:text-primary transition-colors shrink-0 font-medium">Accueil</Link>
          <ChevronRightIcon className="w-3 h-3 text-gray-300 shrink-0" />
          <Link href="/proprietes" className="text-gray-400 hover:text-primary transition-colors shrink-0 font-medium">Propriétés</Link>
          <ChevronRightIcon className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="text-gray-800 dark:text-gray-100 font-semibold truncate text-xs sm:text-sm">{property.title}</span>
        </div>
      </m.nav>

      {/* ── GALLERY : plein bord sur mobile ── */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full sm:max-w-7xl sm:mx-auto sm:px-4 lg:px-8 sm:pt-4"
      >
        <ImageGallery images={property.images || []} title={property.title} />

        {/* Badges desktop bas-gauche */}
        <div className="hidden lg:flex absolute bottom-5 left-9 flex-wrap gap-2 z-10 pointer-events-none">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType}
          </span>
          <span className={`${statusBadgeClass} backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
            {PROPERTY_STATUS_LABELS[property.status] || status.label}
          </span>
          {property.isVerified && (
            <span className="bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5" />Vérifié
            </span>
          )}
          {property.views && property.views > 0 && (
            <span className="bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <EyeIcon className="w-3.5 h-3.5" />{property.views.toLocaleString()} vues
            </span>
          )}
        </div>
      </m.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-0 sm:pt-2">

        {/* ── Hero info strip ── */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-b-none sm:rounded-b-2xl shadow-[0_8px_32px_rgba(0,0,0,0.07)] px-3 sm:px-7 py-4 sm:py-5 mb-4 sm:mb-8"
        >
          {/* Title + price */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-[1.85rem] font-black text-gray-900 dark:text-gray-50 leading-tight tracking-tight mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{locationLabel}</span>
              </div>
            </div>
            <div className="shrink-0 lg:text-right">
              <div className="text-3xl lg:text-4xl font-black text-primary leading-none">
                {property.price ? formatPrice(property.price, property.currency, property.country) : 'Prix sur demande'}
              </div>
              {pricePerM2Display && (
                <div className="text-sm text-gray-400 font-medium mt-1">
                  {pricePerM2Display}<span className="text-xs">/m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats chips + actions */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                <ArrowsPointingOutIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{property.totalSize} m²</span>
              </div>
              {property.bedrooms && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Bed className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{property.bedrooms}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">ch.</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Bath className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{property.bathrooms}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">sdb</span>
                </div>
              )}
              {property.rooms && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <DoorOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{property.rooms}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">pièces</span>
                </div>
              )}
              {property.landSize && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Trees className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{property.landSize} m²</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">terrain</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-xl">
                <BanknotesIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">
                  {property.transactionType === 'SALE' ? 'Vente' : property.transactionType === 'RENT' ? 'Location' : 'Saisonnier'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-1.5 text-sm"
                >
                  {isFavorite
                    ? <HeartSolidIcon className="w-4 h-4 text-red-500" />
                    : <HeartIcon className="w-4 h-4" />
                  }
                  <span className="hidden sm:inline text-xs">{isFavorite ? 'Favori' : 'Sauvegarder'}</span>
                </Button>
              </m.div>
              <ShareDropdown
                title={property.title}
                text={`${property.title} à ${property.city} — ${formatPrice(property.price, property.currency, property.country)}`}
              />
            </div>
          </div>
        </m.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2">

            {/* Description */}
            <m.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8 border-b border-gray-100 dark:border-gray-800/60"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                <DocumentTextIcon className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Description</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px] whitespace-pre-line">
                {property.description
                  ? property.description
                  : `Magnifique propriété de ${property.totalSize || property.landSize} m² située à ${property.city}. Idéal pour votre projet immobilier dans un environnement privilégié. N'hésitez pas à nous contacter pour plus d'informations ou pour organiser une visite.`
                }
              </p>
            </m.section>

            {/* Caractéristiques */}
            <m.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8 border-b border-gray-100 dark:border-gray-800/60"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                <ArrowsPointingOutIcon className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Caractéristiques</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {charItems.map((item, i) => (
                  <m.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1.5">
                      {item.icon}
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug">{item.value}</div>
                  </m.div>
                ))}
              </div>
            </m.section>

            {/* Points forts (features) */}
            {property.features && property.features.length > 0 && (
              <m.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8 border-b border-gray-100 dark:border-gray-800/60"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                  <StarIcon className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Points forts</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature: string, i: number) => (
                    <m.span
                      key={feature}
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-3.5 py-1.5 rounded-full text-sm font-medium"
                    >
                      <StarIcon className="w-3.5 h-3.5 shrink-0" />
                      {feature}
                    </m.span>
                  ))}
                </div>
              </m.section>
            )}

            {/* Détails du bien */}
            {hasDetails && (
              <m.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8 border-b border-gray-100 dark:border-gray-800/60"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                  <HomeModernIcon className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Détails du bien</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {detailItems.map((item, i) => (
                    <m.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1.5">
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug">{item.value}</div>
                    </m.div>
                  ))}
                </div>
              </m.section>
            )}

            {/* Confiance juridique */}
            <m.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8 border-b border-gray-100 dark:border-gray-800/60"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                <ShieldCheckIcon className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Confiance juridique</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {legalItems.map((item, i) => (
                  <m.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border-l-4 ${
                      item.ok
                        ? 'border-l-emerald-500 dark:border-l-emerald-400'
                        : 'border-l-amber-400 dark:border-l-amber-500'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.ok
                        ? <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        : <ExclamationCircleIcon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      }
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                Cette checklist aide à poser les bonnes questions. La validation finale doit se faire avec les documents originaux et, si nécessaire, un professionnel local du foncier.
              </div>
            </m.section>

            {/* Visite virtuelle */}
            {(property.virtualTour || property.videoUrl) && (
              <m.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8 border-b border-gray-100 dark:border-gray-800/60"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                  <CubeTransparentIcon className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Visite virtuelle</h2>
                </div>
                <div className="space-y-4">
                  {property.virtualTour && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <iframe
                        src={property.virtualTour}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; gyroscope; xr-spatial-tracking"
                        sandbox="allow-scripts allow-popups allow-presentation"
                        allowFullScreen
                        title="Visite virtuelle"
                      />
                    </div>
                  )}
                  {property.videoUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <iframe
                        src={property.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-popups allow-presentation"
                        allowFullScreen
                        title="Vidéo de présentation"
                      />
                    </div>
                  )}
                </div>
              </m.section>
            )}

            {/* Localisation */}
            <m.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8 border-b border-gray-100 dark:border-gray-800/60"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                <MapPinIcon className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Localisation</h2>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <PropertyMap property={property} height="400px" />
              </div>
            </m.section>

            {/* Équipements */}
            {property.amenities && property.amenities.length > 0 && (
              <m.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[3px] h-7 bg-primary rounded-full shrink-0" />
                  <CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Équipements & services</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity: string, i: number) => (
                    <m.span
                      key={amenity}
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-3.5 py-1.5 rounded-full text-sm font-medium"
                    >
                      <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" />
                      {amenity}
                    </m.span>
                  ))}
                </div>
              </m.section>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5 lg:sticky lg:top-16 h-fit" id="contact-section">

            {/* Contact form — gradient header + form */}
            <m.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-5 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                    <BuildingOfficeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-[15px] leading-tight">ImoPanorama</p>
                    <p className="text-white/60 text-xs mt-0.5">Agence immobilière · Madagascar</p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-white/90 text-sm font-semibold">Intéressé par ce bien ?</p>
                  <p className="text-white/55 text-xs mt-0.5 leading-relaxed">Envoyez un message, nous vous répondrons dans les 24h.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900">
                <ContactForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </m.div>

            {/* Quick actions */}
            <m.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <AgencyActionButtons
                propertyTitle={property.title}
                propertyId={property.id}
                onScheduleVisit={handleScheduleVisit}
              />
            </m.div>

            {/* Business card contact info */}
            <m.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-gray-900 rounded-2xl px-5 py-5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Contact direct</h3>
              <div className="space-y-0.5">
                <ContactInfoItem icon={<EnvelopeIcon className="w-5 h-5" />} label="Email" content="contact@imopanorama.mg" href="mailto:contact@imopanorama.mg" color="primary" />
                <ContactInfoItem icon={<PhoneIcon className="w-5 h-5" />} label="Téléphone" content="+261 20 22 123 45" href="tel:+261202212345" color="blue" />
                <ContactInfoItem icon={<MapPinIcon className="w-5 h-5" />} label="Adresse" content="Antananarivo, Madagascar" color="green" />
                <ContactInfoItem icon={<ClockIcon className="w-5 h-5" />} label="Horaires" content="Lun–Ven : 8h–17h" color="primary" />
              </div>
            </m.div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-black text-primary leading-tight truncate">
              {property.price ? formatPrice(property.price, property.currency, property.country) : 'Prix sur demande'}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">{property.city} · {property.totalSize} m²</div>
          </div>
          <Button
            className="rounded-full px-5 font-semibold gap-1.5 shrink-0"
            onClick={() => {
              const el = document.getElementById('contact-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <EnvelopeIcon className="w-4 h-4" />
            Contacter
          </Button>
          <m.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              variant="outline"
              size="icon"
              className="rounded-full shrink-0 border-gray-200 dark:border-gray-700"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {isFavorite
                ? <HeartSolidIcon className="w-5 h-5 text-red-500" />
                : <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              }
            </Button>
          </m.div>
        </div>
      </div>
    </div>
  );
}
