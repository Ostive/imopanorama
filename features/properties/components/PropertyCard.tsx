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

  // Formater le prix pour l'affichage
  const formattedPrice = property.price ? formatPrice(property.price, property.currency, property.country) : 'Prix sur demande';

  // Collect features for display
  const displayFeatures = property.amenities && property.amenities.length > 0
    ? property.amenities
    : property.features || [];

  return (
    <m.div
      className="group relative w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/proprietes/${property.id}`} className="block">

        {/* ── IMAGE ZONE ── */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={images[currentImageIndex]}
            alt={property.title || 'Photo de la propriété'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImageError}
          />

          {/* Deep gradient: top scrim + bottom price scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

          {/* ── TOP ROW: badges left · actions right ── */}
          <div className="absolute top-2.5 inset-x-2.5 flex justify-between items-start z-10">
            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide shadow">
                {PROPERTY_TYPE_LABELS[property.propertyType] || 'Bien'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow ${getStatusBadgeClass(property.status)}`}>
                {PROPERTY_STATUS_LABELS[property.status] || 'Disponible'}
              </span>
              {property.isVerified && (
                <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow">
                  ✓ Vérifié
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5">
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
                      toast.success(newFavoriteState ? 'Ajouté à vos favoris' : 'Retiré de vos favoris')
                      onFavoriteToggle?.(property.id, newFavoriteState)
                    }
                  } catch (error) {
                    logger.error('Error toggling favorite', error)
                    toast.error("Nous n'avons pas pu mettre à jour vos favoris")
                  }
                }}
                whileTap={{ scale: 0.85 }}
                className="bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/30 rounded-full p-1.5 sm:p-2 shadow transition-all"
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isFavorite
                  ? <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                  : <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
              </m.button>

              <m.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (inCompare) { removeFromCompare(property.id) }
                  else if (canAdd) { addToCompare(property) }
                  else { toast.error('Maximum 4 propriétés comparables') }
                }}
                whileTap={{ scale: 0.85 }}
                className={`backdrop-blur-md border rounded-full p-1.5 sm:p-2 shadow transition-all ${
                  inCompare
                    ? 'bg-primary-500/80 border-primary-400/50 text-white'
                    : 'bg-white/15 border-white/25 hover:bg-white/30 text-white'
                }`}
                aria-label={inCompare ? 'Retirer de la comparaison' : 'Comparer'}
                title={inCompare ? 'Retirer de la comparaison' : 'Comparer'}
              >
                <ArrowsRightLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </m.button>
            </div>
          </div>

          {/* ── SLIDER CONTROLS ── */}
          {images.length > 1 && (
            <>
              <m.button
                onClick={previousImage}
                whileTap={{ scale: 0.88 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full p-1.5 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Image précédente"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5 text-white" />
              </m.button>
              <m.button
                onClick={nextImage}
                whileTap={{ scale: 0.88 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full p-1.5 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Image suivante"
              >
                <ChevronRightIcon className="w-3.5 h-3.5 text-white" />
              </m.button>

              {/* Dot indicators */}
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                {images.slice(0, 5).map((_, i) => (
                  <span
                    key={i}
                    className={`block rounded-full transition-all duration-300 ${
                      i === currentImageIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── BOTTOM OVERLAY: price + stats ── */}
          <div className="absolute bottom-0 inset-x-0 z-10 px-3 pb-3 pt-6">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-white font-black text-base sm:text-lg leading-none drop-shadow">
                    {formattedPrice}
                  </span>
                  {property.transactionType === 'RENT' && (
                    <span className="text-white/70 text-[10px] font-medium">/mois</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-white/75 text-[10px] sm:text-xs">
                  {property.totalSize && (
                    <span className="flex items-center gap-0.5">
                      <ArrowsPointingOutIcon className="w-3 h-3" />
                      {property.totalSize.toLocaleString()} m²
                    </span>
                  )}
                  {property.bedrooms && (
                    <>
                      <span className="opacity-50">·</span>
                      <span className="flex items-center gap-0.5">
                        <HomeIcon className="w-3 h-3" />
                        {property.bedrooms} ch.
                      </span>
                    </>
                  )}
                </div>
              </div>
              {property.transactionType === 'SALE' && property.pricePerM2 && (
                <span className="text-white/50 text-[9px] shrink-0 self-end">
                  {formatPrice(Math.round(property.pricePerM2), property.currency, property.country)}/m²
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── INFO FOOTER ── */}
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-card border-t border-border/50">
          <p className="text-foreground text-xs sm:text-sm font-semibold truncate leading-tight">
            {property.title || 'Bien à découvrir'}
          </p>
          <div className="flex items-center justify-between mt-1 gap-2">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] sm:text-xs min-w-0">
              <MapPinIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{property.city || 'Localisation à confirmer'}</span>
            </div>
            {displayFeatures.length > 0 && (
              <div className="flex gap-1 shrink-0">
                <span className="text-[9px] sm:text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                  {displayFeatures[0]}
                </span>
                {displayFeatures.length > 1 && (
                  <span className="text-[9px] sm:text-[10px] bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded font-medium">
                    +{displayFeatures.length - 1}
                  </span>
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
