'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, CalendarIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline'
import { sanitizeHtml, stripHtmlToText } from '@/shared/utils/sanitizeHtml'
import type { NewsItem } from '@/features/news/types/news.types'

const categoryLabel: Record<string, string> = {
  GENERAL: 'General',
  IMMOBILIER: 'Immobilier',
  CONSTRUCTION: 'Construction',
  EVENEMENT: 'Evenement',
  ENTREPRISE: 'Entreprise',
}

function formatDate(value?: string | null) {
  if (!value) return null
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

async function fetchArticle(slug: string): Promise<NewsItem> {
  const response = await fetch(`/api/news/${encodeURIComponent(slug)}`)
  if (!response.ok) throw new Error('Article introuvable')
  return response.json()
}

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['news-detail', slug],
    queryFn: () => fetchArticle(slug),
    enabled: Boolean(slug),
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-8 h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-8 aspect-[16/9] animate-pulse rounded-2xl bg-muted" />
          <div className="mt-8 space-y-3">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (isError || !article) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-600">Actualite</p>
          <h1 className="mt-4 text-4xl font-black text-foreground">Article introuvable</h1>
          <p className="mt-4 text-muted-foreground">Cet article n'est plus disponible ou n'a pas encore ete publie.</p>
          <Link href="/actualites" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux actualites
          </Link>
        </div>
      </main>
    )
  }

  const date = formatDate(article.publishedAt)
  const plainExcerpt = article.excerpt || stripHtmlToText(article.content).slice(0, 180)

  return (
    <main className="min-h-screen bg-background">
      <article>
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <Link href="/actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
              <ArrowLeftIcon className="h-4 w-4" />
              Actualites
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1 font-semibold text-primary-700">
                <TagIcon className="h-4 w-4" />
                {categoryLabel[article.category] ?? article.category}
              </span>
              {date && (
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date}
                </span>
              )}
              {article.author && (
                <span className="inline-flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {article.author.firstName} {article.author.lastName}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-foreground md:text-6xl">
              {article.title}
            </h1>
            {plainExcerpt && (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {plainExcerpt}
              </p>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-10">
          {article.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          )}

          <div
            className="article-content mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content || article.excerpt || '') }}
          />
        </div>
      </article>
    </main>
  )
}
