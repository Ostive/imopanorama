'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_CONDITION_LABELS } from '@/features/properties/types';
import { formatPrice, formatDate } from '@/shared/utils';
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
  BoltIcon,
  ClockIcon,
  EyeIcon,
  VideoCameraIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

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
            <div className="text-6xl mb-4">🏞️</div>
            <p className="text-lg font-medium">Aucune image disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile: Carousel view */}
      <div className="block lg:hidden space-y-4">
        {/* Image principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-video rounded-3xl overflow-hidden bg-gray-900 shadow-2xl group"
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
              if (target.src !== '/images/placeholders/property.jpg') {
                target.src = '/images/placeholders/property.jpg'
              }
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

          {images.length > 1 && (
            <>
              <motion.div
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
              </motion.div>
              <motion.div
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
              </motion.div>
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
        </motion.div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <motion.button
                key={index}
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
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Fixed-height layouts adapted to image count */}
      <div className="hidden lg:block">

        {/* === 1 image : pleine largeur, hauteur fixe 480px === */}
        {images.length === 1 && (
          <motion.div
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                  <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* === 2 images : 2 colonnes égales, hauteur fixe 400px === */}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-3 h-[400px]">
            {images.map((image, index) => (
              <motion.div
                key={index}
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                      <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* === 3 images : 1 grande à gauche (2/3) + 2 empilées à droite (1/3), hauteur fixe 480px === */}
        {images.length === 3 && (
          <div className="grid grid-cols-3 gap-3 h-[480px]">
            {/* Grande image gauche */}
            <motion.div
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
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {images.length} photos
              </div>
            </motion.div>

            {/* 2 images empilées à droite */}
            <div className="flex flex-col gap-3">
              {images.slice(1, 3).map((image, index) => (
                <motion.div
                  key={index}
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
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* === 4 images : 1 grande à gauche (1/2) + 3 en grille à droite (1/2), hauteur fixe 480px === */}
        {images.length === 4 && (
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            {/* Grande image gauche */}
            <motion.div
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
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {images.length} photos
              </div>
            </motion.div>

            {/* 3 images à droite : 1 en haut pleine largeur + 2 en bas */}
            <div className="flex flex-col gap-3">
              <motion.div
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
              </motion.div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {images.slice(2, 4).map((image, index) => (
                  <motion.div
                    key={index}
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
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === 5+ images : 1 grande à gauche (1/2) + 4 en grille 2x2 à droite, hauteur fixe 500px === */}
        {images.length >= 5 && (
          <div className="grid grid-cols-2 gap-3 h-[500px]">
            {/* Grande image gauche */}
            <motion.div
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
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {images.length} photos
              </div>
            </motion.div>

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
                  <motion.div
                    key={index}
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <motion.div
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                </motion.div>

                {/* Close button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-20">
            <motion.div
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
            </motion.div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.div
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
              </motion.div>

              <motion.div
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
              </motion.div>
            </>
          )}

          {/* Bottom thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/80 to-transparent p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
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
                    </motion.button>
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
        </motion.div>
      )}
    </>
  );
}

// Le formulaire de contact est maintenant géré par le composant TerrainContactForm

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToFavorites, removeFromFavorites, isFavorite: checkIsFavorite } = useFavorites();

  // Fetch property data
  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      const data = await response.json();

      if (data.success) {
        setProperty(data.data);
      } else {
        setError('Property not found');
      }
    } catch (error) {
      logger.error('Error fetching property', error);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  // Check if property is favorite on mount
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

  // Fonction pour gérer les favoris
  const handleToggleFavorite = async () => {
    if (!property) return;

    const previousState = isFavorite;
    setIsTogglingFavorite(true);

    // Optimistic update
    setIsFavorite(!isFavorite);

    try {
      if (isFavorite) {
        // Remove from favorites (updates navbar automatically)
        await removeFromFavorites(property.id);
        toast.success('Retiré des favoris');
      } else {
        // Add to favorites (updates navbar automatically)
        await addToFavorites(property.id);
        toast.success('❤️ Ajouté aux favoris');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      // Revert on error
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

  // Fonction pour programmer une visite
  const handleScheduleVisit = () => {
    setShowVisitModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-2xl w-2/3"></div>
            <div className="aspect-video bg-muted rounded-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-96" />
              </div>
              <Card className="h-[600px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-12">
            <CardContent>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold mb-2">Propriété introuvable</h1>
              <p className="text-muted-foreground mb-6">Cette propriété n'existe pas ou a été supprimée.</p>
              <Button asChild>
                <Link href="/proprietes">Retour aux propriétés</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = {
    available: { label: 'Disponible', variant: 'default' as const },
    sold: { label: 'Vendu', variant: 'destructive' as const },
    reserved: { label: 'Réservé', variant: 'secondary' as const }
  };

  const status = statusConfig[property.status as keyof typeof statusConfig] || statusConfig.available;

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50/40 via-white to-blue-50/30">
      {/* Modal de programmation de visite */}
      {showVisitModal && property && (
        <ScheduleVisitModal 
          isOpen={showVisitModal}
          onClose={() => setShowVisitModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
        />
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
              Accueil
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link href="/proprietes" className="text-gray-600 hover:text-primary-600 transition-colors">Propriétés</Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">{property.title}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Galerie d'images */}
        <div className="mb-8">
          <ImageGallery images={property.images || []} title={property.title} />
        </div>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 border-gray-200 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900 dark:text-white">
                    {property.title || 'Propriété sans titre'}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{property.city || 'Localisation non renseignée'}</span>
                  </div>
                  <Badge variant={status.variant} className="px-4 py-2 text-sm">
                    {status.label}
                  </Badge>
                  {property.views && property.views > 0 && (
                    <Badge variant="secondary" className="px-4 py-2 text-sm gap-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>{property.views.toLocaleString()} vues</span>
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {property.price ? formatPrice(property.price) : 'Prix sur demande'}
                </div>
                <div className="text-muted-foreground font-medium">
                  {property.pricePerM2
                    ? `${formatPrice(Math.round(property.pricePerM2))}/m²`
                    : property.price && property.totalSize && property.totalSize > 0
                      ? `${formatPrice(Math.round(property.price / property.totalSize))}/m²`
                      : '-'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  variant="secondary"
                  className="gap-2"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
                </Button>
              </motion.div>
              <ShareDropdown
                title={property.title}
                text={`${property.title} à ${property.city} — ${formatPrice(property.price)}`}
              />
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">

            {/* Informations principales - Bullet Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8"
            >
              <PropertySectionHeader
                icon={<ArrowsPointingOutIcon className="h-6 w-6" />}
                title="Caractéristiques"
                description="Détails complets de la propriété"
                color="primary"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <PropertyInfoItem icon={<ArrowsPointingOutIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />} label="Surface totale" value={`${property.totalSize || 0} m²`} color="primary" delay={0} />
                <PropertyInfoItem icon="🏷️" label="Type de propriété" value={PROPERTY_TYPE_LABELS[property.propertyType] || 'Non renseigné'} color="blue" delay={0.05} />
                <PropertyInfoItem icon="💰" label="Type de transaction" value={property.transactionType === 'SALE' ? 'Vente' : property.transactionType === 'RENT' ? 'Location' : 'Location saisonnière'} color="purple" delay={0.1} />
                <PropertyInfoItem icon={<MapPinIcon className="w-5 h-5 text-green-600 dark:text-green-400" />} label="Ville" value={property.city || 'Non renseignée'} color="green" delay={0.15} />
                {property.bedrooms && <PropertyInfoItem icon="🛏️" label="Chambres" value={property.bedrooms} color="pink" delay={0.2} />}
                {property.bathrooms && <PropertyInfoItem icon="🚿" label="Salles de bain" value={property.bathrooms} color="cyan" delay={0.25} />}
                {property.rooms && <PropertyInfoItem icon="🚪" label="Nombre de pièces" value={property.rooms} color="amber" delay={0.3} />}
                {property.livingSize && property.livingSize !== property.totalSize && <PropertyInfoItem icon="🏠" label="Surface habitable" value={`${property.livingSize} m²`} color="orange" delay={0.35} />}
                {property.landSize && <PropertyInfoItem icon="🌳" label="Surface terrain" value={`${property.landSize} m²`} color="emerald" delay={0.4} />}
              </div>
              <div className="mt-8 border-t border-border"></div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8"
            >
              <PropertySectionHeader
                icon={<DocumentTextIcon className="h-6 w-6" />}
                title="Description"
                description="Présentation détaillée de la propriété"
                color="slate"
              />
              <div className="text-muted-foreground leading-relaxed text-lg">
                {property.description ? (
                  <p className="whitespace-pre-line">{property.description}</p>
                ) : (
                  <div>
                    Magnifique propriété de {property.totalSize || property.landSize} m² située à {property.city}.
                    Idéal pour votre projet immobilier dans un environnement privilégié.
                    N'hésitez pas à nous contacter pour plus d'informations ou pour organiser une visite.
                  </div>
                )}
              </div>
              <div className="mt-8 border-t border-border"></div>
            </motion.div>

            {/* Features Section */}
            {property.features && property.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8"
              >
                <PropertySectionHeader
                  icon={<StarIcon className="h-6 w-6" />}
                  title="Caractéristiques spéciales"
                  description="Points forts et atouts de la propriété"
                  color="amber"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {property.features.map((feature: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <StarIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="font-medium text-foreground flex-1 min-w-0">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 border-t border-border"></div>
              </motion.div>
            )}

            {/* Property Details Section */}
            {(property.yearBuilt || property.condition || property.energyClass || property.floor || property.floors) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8"
              >
                <PropertySectionHeader
                  icon={<HomeModernIcon className="h-6 w-6" />}
                  title="Détails du bien"
                  description="Informations complémentaires sur la propriété"
                  color="blue"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  {property.yearBuilt && <PropertyInfoItem icon={<ClockIcon className="w-5 h-5" />} label="Année de construction" value={property.yearBuilt} color="blue" delay={0} />}
                  {property.condition && <PropertyInfoItem icon={<CheckCircleIcon className="w-5 h-5" />} label="État" value={PROPERTY_CONDITION_LABELS[property.condition] || property.condition} color="emerald" delay={0.03} />}
                  {property.energyClass && <PropertyInfoItem icon={<BoltIcon className="w-5 h-5" />} label="Classe énergétique" value={property.energyClass} color="amber" delay={0.06} />}
                  {property.floor !== null && property.floor !== undefined && <PropertyInfoItem icon="🏢" label="Étage" value={`${property.floor}ème`} color="purple" delay={0.09} />}
                  {property.floors && <PropertyInfoItem icon="🏗️" label="Nombre d'étages" value={property.floors} color="cyan" delay={0.12} />}
                  {property.reference && <PropertyInfoItem icon="🔖" label="Référence" value={property.reference} color="slate" delay={0.15} />}
                </div>
                <div className="mt-8 border-t border-border"></div>
              </motion.div>
            )}

            {/* Virtual Tour & Video */}
            {(property.virtualTour || property.videoUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8"
              >
                <PropertySectionHeader
                  icon={<CubeTransparentIcon className="h-6 w-6" />}
                  title="Visite virtuelle"
                  description="Explorez la propriété en immersion 360°"
                  color="purple"
                />
                <div className="space-y-6">
                  {property.virtualTour && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                      <iframe
                        src={property.virtualTour}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; gyroscope; xr-spatial-tracking"
                        allowFullScreen
                        title="Visite virtuelle"
                      />
                    </div>
                  )}

                  {property.videoUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                      <iframe
                        src={property.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Vidéo de présentation"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-8 border-t border-border"></div>
              </motion.div>
            )}

            {/* Carte de la propriété */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-8"
            >
              <PropertySectionHeader
                icon={<MapPinIcon className="h-6 w-6" />}
                title="Localisation"
                description="Emplacement exact de la propriété sur la carte"
                color="red"
              />
              <div className="rounded-2xl overflow-hidden">
                <PropertyMap property={property} height="400px" />
              </div>
              <div className="mt-8 border-t border-border"></div>
            </motion.div>

            {/* Caractéristiques et équipements */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-8"
              >
                <PropertySectionHeader
                  icon={<CheckCircleIcon className="h-6 w-6" />}
                  title="Équipements et services"
                  description="Tous les équipements disponibles dans cette propriété"
                  color="green"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {property.amenities.map((feature: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium text-foreground flex-1 min-w-0">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 h-fit">
            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ContactForm propertyId={property.id} propertyTitle={property.title} />
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AgencyActionButtons
                propertyTitle={property.title}
                propertyId={property.id}
                onScheduleVisit={handleScheduleVisit}
              />
            </motion.div>

            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Nous contacter</h3>
                <ContactInfoItem icon={<EnvelopeIcon className="w-6 h-6" />} label="Email" content="contact@imopanorama.mg" href="mailto:contact@imopanorama.mg" color="primary" />
                <ContactInfoItem icon={<PhoneIcon className="w-6 h-6" />} label="Téléphone" content="+261 20 22 123 45" href="tel:+261202212345" color="blue" />
                <ContactInfoItem icon={<MapPinIcon className="w-6 h-6" />} label="Adresse" content="Antananarivo, Madagascar" color="green" />
                <ContactInfoItem icon={<span className="text-2xl">🕒</span>} label="Horaires" content="Lun-Ven: 8h-17h" color="primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
