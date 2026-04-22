'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useProperties } from '@/features/properties/hooks/useProperties'
import PropertyCard from '@/features/properties/components/PropertyCard'

export default function PropertySection() {
  const { properties, loading, error } = useProperties({
    limit: 3,
    transactionType: 'SALE',
    sort: 'date_desc',
  })
  const [showTitle, setShowTitle] = useState(true)

  useEffect(() => {
    const savedSettings = localStorage.getItem('admin-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setShowTitle(settings.homepage?.showPropertySectionTitle ?? true)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  if (error) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">Nous n'arrivons pas à charger les biens pour le moment. Réessayez dans un instant.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="proprietes"
      className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-3">
                Sélection du moment
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Des biens choisis avec soin à{' '}
                <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500 bg-clip-text text-transparent">
                  Madagascar
                </span>
              </h2>
            </div>
            <Link
              href="/proprietes"
              className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold whitespace-nowrap hover:gap-3 transition-all"
            >
              Parcourir les biens
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Property Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-64 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </motion.div>
            ))
          ) : properties.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-gray-400 dark:text-gray-500">
              Aucun bien publié pour le moment. Revenez bientôt, de nouvelles opportunités arrivent.
            </div>
          ) : (
            properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <PropertyCard property={property} variant="featured" />
              </motion.div>
            ))
          )}
        </div>

        {/* CTA — only shown on mobile (desktop has link in header) */}
        {!loading && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center sm:hidden"
          >
            <Link
              href="/proprietes"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/30"
            >
              Découvrir tous les biens
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
