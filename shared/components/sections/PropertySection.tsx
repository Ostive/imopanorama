'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { m } from 'framer-motion'
import { ArrowRightIcon, WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
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
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
  }, [])

  return (
    <section id="proprietes" className="py-16 sm:py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(14_165_233/0.07)_1px,transparent_0)] bg-size-[28px_28px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-12 bg-primary-500" />
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
                Sélection du moment
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1.05] max-w-xl wrap-break-word">
              Des biens choisis{' '}
              <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                avec soin
              </span>{' '}
              à Madagascar
            </h2>
          </m.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </m.div>
            ))
          ) : error ? (
            <div className="col-span-3 flex justify-center py-10">
              <div className="bg-primary-50/60 dark:bg-primary-900/20 rounded-2xl px-10 py-10 max-w-md w-full text-center space-y-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 mx-auto">
                  <WifiIcon className="w-7 h-7 text-primary-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Les biens ne sont pas disponibles pour le moment
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cela peut venir de votre connexion ou d'un problème temporaire de notre côté. Rechargez la page pour réessayer.
                  </p>
                </div>
                <button type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Recharger la page
                </button>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-3 text-center py-20">
              <p className="font-semibold text-foreground mb-1">Aucun contenu pour le moment</p>
              <p className="text-sm text-muted-foreground">De nouveaux contenus arrivent bientôt.</p>
            </div>
          ) : (
            properties.map((property, index) => (
              <m.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <PropertyCard property={property} variant="featured" />
              </m.div>
            ))
          )}
        </div>

        {!loading && !error && properties.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/proprietes"
              className="group inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all"
            >
              Tous les biens
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </m.div>
        )}
      </div>
    </section>
  )
}
