'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout'

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
  slug: string
}

function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchWithTimeout('/api/news?limit=3', {}, 5000)
        if (response.ok) {
          const data = await response.json()
          setArticles(
            data.map((item: any) => ({
              id: item.id,
              title: item.title,
              excerpt: item.excerpt || '',
              category: item.category,
              date: new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              readTime: `${Math.ceil(
                item.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200
              )} min de lecture`,
              image: item.coverImage || '/images/og-image.png',
              slug: item.slug,
            }))
          )
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [])

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold mb-3">
              À lire
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Comprendre le marché{' '}
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500 bg-clip-text text-transparent">
                sans jargon
              </span>
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-base max-w-md">
              Conseils pratiques, tendances locales et nouvelles utiles pour avancer avec plus de confiance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-400 transition-all"
            >
              Lire les articles
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                <div className="h-52 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500">
              Aucun article disponible pour le moment. De nouveaux contenus arrivent bientôt.
            </p>
          </div>
        )}

        {/* Articles grid */}
        {!isLoading && articles.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/actualites/${article.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">

                    {/* Image */}
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                        {article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed flex-1">
                        {article.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <span className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                          <ArrowRightIcon className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default React.memo(NewsSection)
