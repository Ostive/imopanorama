'use client'

import { useCompare } from '@/features/properties/context/CompareContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { XMarkIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { useImageFallback } from '@/shared/hooks/useImageFallback'

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const { safeImages } = useImageFallback()

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              {/* Titre */}
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">
                <ArrowsRightLeftIcon className="w-5 h-5 text-primary-600" />
                <span>Comparer ({compareList.length}/4)</span>
              </div>

              {/* Liste des propriétés */}
              <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-1">
                {compareList.map(property => {
                  const imgs = safeImages(property.images || [])
                  return (
                    <div
                      key={property.id}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shrink-0"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={imgs[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0 max-w-[120px]">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{property.title}</p>
                        <p className="text-xs text-gray-500 truncate">{property.city}</p>
                      </div>
                      <button
                        onClick={() => removeFromCompare(property.id)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Retirer de la comparaison"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={clearCompare}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
                >
                  Tout effacer
                </button>
                <Link
                  href={`/proprietes/comparer?ids=${compareList.map(p => p.id).join(',')}`}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-primary-500/30"
                >
                  <ArrowsRightLeftIcon className="w-4 h-4" />
                  <span>Comparer</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
