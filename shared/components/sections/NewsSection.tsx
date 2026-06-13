'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
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
              image: item.coverImage || '/images/social/og-image.png',
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
    <section className="py-16 sm:py-20 md:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-primary-500" />
            <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
              À lire
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1.05] wrap-break-word">
            Comprendre le marché{' '}
            <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              sans jargon
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-md">
            Conseils pratiques, tendances locales et nouvelles utiles pour avancer avec plus de confiance.
          </p>
        </m.div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background rounded-3xl overflow-hidden">
                <div className="h-52 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-muted rounded-full" />
                  <div className="h-5 bg-muted rounded" />
                  <div className="h-5 w-4/5 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="font-semibold text-foreground mb-1">Aucun contenu pour le moment</p>
            <p className="text-sm text-muted-foreground">De nouveaux contenus arrivent bientôt.</p>
          </div>
        )}

        {/* Articles — grille uniforme */}
        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article, index) => (
              <m.article
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/actualites/${article.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                    {/* Image */}
                    <div className="relative overflow-hidden shrink-0 h-52">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                      <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                        {article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1">
                        {article.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </m.article>
            ))}
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all"
            >
              Tous les articles
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </m.div>
        )}
      </div>
    </section>
  )
}

export default React.memo(NewsSection)
