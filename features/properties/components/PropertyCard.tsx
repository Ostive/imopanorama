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
      className="group relative w-full overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/proprietes/${property.id}`} className="block">

        {/* ── IMAGE plein bord ── */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={images[currentImageIndex]}
            alt={property.title || 'Photo de la propriété'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            onError={handleImageError}
          />

          {/* Gradient haut + bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Badge type (haut-gauche) + bouton favori (haut-droite) */}
          <div className="absolute top-2 inset-x-2 z-10 flex items-start justify-between gap-1">
            {/* Un seul badge type, tronqué */}
            <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow max-w-[55%] truncate">
              {PROPERTY_TYPE_LABELS[property.propertyType] || 'Bien'}
            </span>

            {/* Bouton favori seulement (compare retiré du header) */}
            <m.button
              onClick={async (e) => {
                e.preventDefault(); e.stopPropagation()
                if (!isAuthenticated) { toast.error('Connectez-vous pour garder ce bien dans vos favoris'); router.push('/login'); return }
                try {
                  const success = await toggleFavorite(property)
                  if (success) {
                    const newState = !isFavorite
                    toast.success(newState ? 'Ajouté à vos favoris' : 'Retiré de vos favoris')
                    onFavoriteToggle?.(property.id, newState)
                  }
                } catch (error) { logger.error('Error toggling favorite', error); toast.error("Nous n'avons pas pu mettre à jour vos favoris") }
              }}
              whileTap={{ scale: 0.85 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-md transition-all shrink-0"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {isFavorite
                ? <HeartSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                : <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />}
            </m.button>
          </div>

          {/* Slider */}
          {images.length > 1 && (
            <>
              <m.button onClick={previousImage} whileTap={{ scale: 0.88 }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Image précédente">
                <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-800" />
              </m.button>
              <m.button onClick={nextImage} whileTap={{ scale: 0.88 }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Image suivante">
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-800" />
              </m.button>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                {images.slice(0, 5).map((_, i) => (
                  <span key={i} className={`block rounded-full transition-all ${i === currentImageIndex ? 'w-3 h-1 bg-white' : 'w-1 h-1 bg-white/50'}`} />
                ))}
              </div>
            </>
          )}

          {/* Prix + stats en overlay bas */}
          <div className="absolute bottom-0 inset-x-0 z-10 px-2.5 pb-2.5 pt-4">
            <div className="flex items-end justify-between gap-1">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-extrabold text-sm leading-none drop-shadow">{formattedPrice}</span>
                  {property.transactionType === 'RENT' && <span className="text-white/70 text-[10px]">/mois</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-white/75 text-[10px]">
                  {property.totalSize && (
                    <span className="flex items-center gap-0.5">
                      <ArrowsPointingOutIcon className="w-2.5 h-2.5" />{property.totalSize.toLocaleString()} m²
                    </span>
                  )}
                  {property.bedrooms && (
                    <span className="flex items-center gap-0.5">
                      <HomeIcon className="w-2.5 h-2.5" />{property.bedrooms} ch.
                    </span>
                  )}
                </div>
              </div>
              {property.transactionType === 'SALE' && property.pricePerM2 && (
                <span className="text-white/50 text-[9px] self-end">
                  {formatPrice(Math.round(property.pricePerM2), property.currency, property.country)}/m²
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── INFO compacte ── */}
        <div className="px-2.5 pt-2 pb-2.5 bg-card">
          {/* Titre */}
          <p className="text-foreground text-xs font-semibold truncate leading-snug">
            {property.title || 'Bien à découvrir'}
          </p>

          {/* Ville + statut */}
          <div className="flex items-center justify-between mt-1 gap-1">
            <div className="flex items-center gap-0.5 text-muted-foreground text-[10px] min-w-0">
              <MapPinIcon className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{property.city || '—'}</span>
            </div>
            <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(property.status)}`}>
              {PROPERTY_STATUS_LABELS[property.status] || 'Disponible'}
            </span>
          </div>

          {/* Features + compare */}
          <div className="flex items-center justify-between mt-1.5 gap-1">
            <div className="flex gap-1 min-w-0 overflow-hidden">
              {displayFeatures.slice(0, 2).map(f => (
                <span key={f} className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium truncate max-w-[50px]">
                  {f}
                </span>
              ))}
              {displayFeatures.length > 2 && (
                <span className="text-[9px] bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded font-medium shrink-0">
                  +{displayFeatures.length - 2}
                </span>
              )}
            </div>
            <m.button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation()
                if (inCompare) { removeFromCompare(property.id) }
                else if (canAdd) { addToCompare(property) }
                else { toast.error('Maximum 4 propriétés comparables') }
              }}
              whileTap={{ scale: 0.85 }}
              className={`shrink-0 rounded-full p-1 sm:p-1.5 shadow-sm border transition-all ${inCompare ? 'bg-primary-500 border-primary-500 text-white' : 'bg-card border-border text-muted-foreground'}`}
              aria-label={inCompare ? 'Retirer de la comparaison' : 'Comparer'}
            >
              <ArrowsRightLeftIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </m.button>
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
