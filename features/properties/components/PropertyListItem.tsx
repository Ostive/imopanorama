'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '../types'
import { motion } from 'framer-motion'
import {
  MapPinIcon,
  ArrowsPointingOutIcon,
  HeartIcon,
  HomeIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { logger } from '@/infrastructure/logger/logger'
import { useImageFallback } from '@/shared/hooks/useImageFallback'

interface PropertyListItemProps {
  property: Property
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void
  initialIsFavorite?: boolean
}

export default function PropertyListItem({
  property,
  onFavoriteToggle,
  initialIsFavorite = false
}: PropertyListItemProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { handleImageError, safeImages } = useImageFallback()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500 text-white'
      case 'RESERVED': return 'bg-amber-500 text-white'
      case 'SOLD':
      case 'RENTED': return 'bg-rose-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const formattedPrice = property.price ? formatPrice(property.price) : 'Prix non renseigné'
  const images = safeImages(property.images || [])
  const displayFeatures = property.amenities?.length ? property.amenities : property.features || []

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter cette propriété à vos favoris')
      router.push('/login')
      return
    }
    try {
      const newState = !isFavorite
      setIsFavorite(newState)
      toast.success(newState ? '❤️ Ajouté aux favoris' : 'Retiré des favoris')
      onFavoriteToggle?.(property.id, newState)
    } catch (error) {
      logger.error('Error toggling favorite', error)
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <Link href={`/proprietes/${property.id}`} className="flex flex-row h-full">

        {/* ── Image — thumbnail on mobile, wider on desktop ── */}
        <div className="relative w-28 sm:w-72 shrink-0 self-stretch overflow-hidden">
          <Image
            src={images[0]}
            alt={property.title || 'Photo de la propriété'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 112px, 288px"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

          {/* Image count pill — mobile only */}
          {images.length > 1 && (
            <div className="sm:hidden absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
              <span className="text-white text-[10px] font-semibold">{images.length}</span>
            </div>
          )}

          {/* Status badge — mobile only (inside image) */}
          <div className="sm:hidden absolute top-1.5 left-1.5">
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(property.status)}`}>
              {PROPERTY_STATUS_LABELS[property.status] || 'Dispo'}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 flex flex-col p-3 sm:p-5">

          {/* Top row: type badge + featured + favorite */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                {PROPERTY_TYPE_LABELS[property.propertyType] || 'Bien'}
              </span>
              {/* Status badge — desktop (outside image) */}
              <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(property.status)}`}>
                {PROPERTY_STATUS_LABELS[property.status]}
              </span>
              {property.isFeatured && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
                  <SparklesIcon className="w-3 h-3" />
                  Coup de cœur
                </span>
              )}
            </div>
            <motion.button
              onClick={handleFavorite}
              whileTap={{ scale: 0.85 }}
              className="shrink-0 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {isFavorite
                ? <HeartSolidIcon className="w-4 h-4 text-red-500" />
                : <HeartIcon className="w-4 h-4 text-gray-500" />
              }
            </motion.button>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-1 sm:line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-0.5">
            {property.title || 'Propriété sans titre'}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-2">
            <MapPinIcon className="w-3 h-3 shrink-0" />
            <span className="text-xs line-clamp-1">{property.city || 'Localisation non renseignée'}</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mb-2">
            {property.totalSize && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <ArrowsPointingOutIcon className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs font-semibold">{property.totalSize.toLocaleString()} m²</span>
              </div>
            )}
            {property.bedrooms && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <HomeIcon className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs font-semibold">{property.bedrooms} ch.</span>
              </div>
            )}
          </div>

          {/* Features — desktop only */}
          {displayFeatures.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mb-3">
              {displayFeatures.slice(0, 4).map((f, i) => (
                <span key={i} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600">
                  {f}
                </span>
              ))}
              {displayFeatures.length > 4 && (
                <span className="text-xs text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md border border-primary-200 dark:border-primary-700">
                  +{displayFeatures.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Bottom: price + arrow */}
          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formattedPrice}
                </span>
                {property.transactionType === 'RENT' && (
                  <span className="text-xs text-gray-500">/mois</span>
                )}
              </div>
              {property.transactionType === 'SALE' && property.pricePerM2 && (
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(property.pricePerM2).toLocaleString()}€/m²
                </span>
              )}
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white p-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="hidden sm:inline text-sm font-semibold">Voir</span>
              <ChevronRightIcon className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

      </Link>
    </motion.div>
  )
}
