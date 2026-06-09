'use client'

import React from 'react'
import Image from 'next/image'
import { Property } from '@/features/properties/types/properties.types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/context/AuthContext'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { m } from 'framer-motion'
import { MapPinIcon, ArrowsPointingOutIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/features/properties/types/properties.types'
import { logger } from '@/infrastructure/logger/logger'
import { useImageFallback } from '@/shared/hooks/useImageFallback'
import { useCompare } from '@/features/properties/context/CompareContext'
import { useFavorites } from '@/features/favorites/hooks/useFavorites'
import { formatPrice } from '@/shared/utils'

interface PropertyCardProps {
  property: Property
  onViewDetails?: (propertyId: string) => void
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void
  initialIsFavorite?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

function PropertyCard({
  property,
  onViewDetails,
  onFavoriteToggle,
  initialIsFavorite = false,
  variant = 'default'
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isAuthenticated } = useAuth()
  const { isFavorite: checkIsFav, toggleFavorite } = useFavorites()
  const isFavorite = checkIsFav(property.id) || initialIsFavorite
  const router = useRouter()
  const { handleImageError, safeImages } = useImageFallback()
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare()
  const inCompare = isInCompare(property.id)

  // Get all images or use placeholder (failed images auto-replaced)
  const images = safeImages(property.images || [])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500 text-white'
      case 'RESERVED':
        return 'bg-amber-500 text-white'
      case 'SOLD':
      case 'RENTED':
        return 'bg-rose-500 text-white'
      case 'DRAFT':
        return 'bg-slate-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  // Formater le prix pour l'affichage
  const formattedPrice = property.price ? formatPrice(property.price, property.currency, property.country) : 'Prix sur demande';

  // Collect features for display
  const displayFeatures = property.amenities && property.amenities.length > 0
    ? property.amenities
    : property.features || [];

  return (
    <m.div
      className="group relative w-full h-full rounded-3xl bg-card shadow-xl hover:shadow-2xl transition-all duration-300 border border-border"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/proprietes/${property.id}`} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Image Section - Top Half */}
          <div className="relative w-full h-64 p-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <m.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={property.title || 'Photo de la propriété'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={handleImageError}
                />
              </m.div>

              {/* Gradient overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

              {/* Slider controls - only show if multiple images */}
              {images.length > 1 && (
                <>
                  <m.button
                    onClick={previousImage}
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2.5 shadow-xl transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Image précédente"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
                  </m.button>
                  <m.button
                    onClick={nextImage}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2.5 shadow-xl transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Image suivante"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-800" />
                  </m.button>

                  {/* Image count indicator */}
                  <div className="absolute bottom-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-white text-xs font-semibold">
                      {currentImageIndex + 1}/{images.length}
                    </span>
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <m.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-sky-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                >
                  {PROPERTY_TYPE_LABELS[property.propertyType] || 'Bien immobilier'}
                </m.span>
                <m.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getStatusBadgeClass(property.status)}`}
                >
                  {PROPERTY_STATUS_LABELS[property.status] || 'Disponible'}
                </m.span>
                {property.isVerified && (
                  <m.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                  >
                    Vérifié
                  </m.span>
                )}
              </div>

              {/* Favorite + Compare buttons */}
              <div className="absolute top-4 right-4 z-20 flex flex-row gap-2">
                <m.button
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (!isAuthenticated) {
                      toast.error('Connectez-vous pour garder ce bien dans vos favoris')
                      router.push('/login')
                      return
                    }

                    try {
                      const success = await toggleFavorite(property)
                      if (success) {
                        const newFavoriteState = !isFavorite
                        toast.success(
                          newFavoriteState
                            ? 'Ajouté à vos favoris'
                            : 'Retiré de vos favoris'
                        )
                        onFavoriteToggle?.(property.id, newFavoriteState)
                      }
                    } catch (error) {
                      logger.error('Error toggling favorite', error)
                      toast.error("Nous n'avons pas pu mettre à jour vos favoris")
                    }
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/95 hover:bg-white rounded-full p-2.5 shadow-xl transition-all"
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-700" />
                  )}
                </m.button>

                {/* Compare button */}
                <m.button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (inCompare) {
                      removeFromCompare(property.id)
                    } else if (canAdd) {
                      addToCompare(property)
                    } else {
                      toast.error('Maximum 4 propriétés comparables')
                    }
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`rounded-full p-2.5 shadow-xl transition-all ${
                    inCompare
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/95 hover:bg-white text-gray-700'
                  }`}
                  aria-label={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
                  title={inCompare ? 'Retirer de la comparaison' : 'Comparer'}
                >
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                </m.button>
              </div>
            </div>
          </div>

          {/* Info Section - Bottom Half */}
          <div className="flex-1 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-b-3xl">
            {/* Location */}
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <MapPinIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-foreground text-sm font-semibold leading-tight">
                  {property.title || 'Bien à découvrir'}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {property.city || 'Localisation à confirmer'}
                </p>
              </div>
            </div>

            {/* Size & Bedrooms */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <ArrowsPointingOutIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {property.totalSize ? property.totalSize.toLocaleString() : '—'} m²
                </p>
                <p className="text-muted-foreground text-xs">
                  Surface totale
                </p>
              </div>

              {/* Bedrooms if applicable */}
              {property.bedrooms && (
                <>
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg ml-2">
                    <HomeIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {property.bedrooms} ch.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Chambres
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Price */}
            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-2xl font-bold">
                    {formattedPrice}
                  </span>
                  {property.transactionType === 'RENT' && (
                    <span className="text-muted-foreground text-sm font-medium">
                      /mois
                    </span>
                  )}
                </div>
                {property.transactionType === 'SALE' && property.pricePerM2 && (
                  <span className="text-muted-foreground text-xs">
                    {formatPrice(Math.round(property.pricePerM2), property.currency, property.country)}/m²
                  </span>
                )}
              </div>
            </div>

            {/* Features/Amenities */}
            {displayFeatures && displayFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayFeatures.slice(0, 3).map((feature, index) => (
                  <m.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs font-semibold text-foreground bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-border"
                  >
                    {feature}
                  </m.span>
                ))}
                {displayFeatures.length > 3 && (
                  <m.span
                    whileHover={{ scale: 1.05 }}
                    className="text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40 px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-800"
                  >
                    +{displayFeatures.length - 3} autres
                  </m.span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(PropertyCard, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.variant === nextProps.variant
  )
})
