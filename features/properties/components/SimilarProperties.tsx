'use client'

/**
 * @module SimilarProperties
 * @description Displays a horizontal grid of property cards similar to
 * the currently viewed property.  Data is fetched client-side from
 * `GET /api/properties/[id]/similar`.
 *
 * Place this component at the bottom of the property-detail page:
 * ```tsx
 * <SimilarProperties propertyId={property.id} />
 * ```
 */

import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Property } from '@/features/properties/types/properties.types'
import PropertyCard from '@/features/properties/components/PropertyCard'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { logger } from '@/infrastructure/logger/logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SimilarPropertiesProps {
  /** The ID of the property to find similar ones for. */
  propertyId: string
  /** Maximum number of similar properties to show (default `4`). */
  limit?: number
  /** Optional CSS class name for the wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SimilarProperties({
  propertyId,
  limit = 4,
  className = '',
}: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!propertyId) return

    const fetchSimilar = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}/similar?limit=${limit}`)
        const json = await res.json()

        if (json.success && json.data?.length > 0) {
          setProperties(json.data)
        }
      } catch (error) {
        logger.error('Error fetching similar properties', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilar()
  }, [propertyId, limit])

  // Don't render anything if no similar properties found
  if (!loading && properties.length === 0) return null

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className={`w-full ${className}`}
    >
      {/* Section header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-2.5 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl">
          <SparklesIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Propriétés similaires
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Découvrez des biens qui pourraient également vous intéresser
          </p>
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-gray-200 dark:bg-gray-700" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property cards grid */}
      {!loading && properties.length > 0 && (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {properties.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard
                property={property}
                variant="default"
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  )
}
