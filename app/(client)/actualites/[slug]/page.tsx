import type { Metadata } from 'next'
import NewsDetailPage from './NewsDetailPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/news/${slug}`,
      { next: { revalidate: 3600 } },
    )
    if (res.ok) {
      const data = await res.json()
      const article = data.article ?? data.news ?? data
      if (article?.title) {
        return {
          title: article.title,
          description: (article.excerpt ?? article.description ?? article.content as string | undefined)
            ?.replace(/<[^>]+>/g, '')
            .slice(0, 160) ??
            'Actualité immobilière sur ImoPanorama Madagascar.',
        }
      }
    }
  } catch {}
  return {
    title: 'Actualité',
    description: 'Actualités et conseils immobiliers sur ImoPanorama Madagascar.',
  }
}

export { NewsDetailPage as default }
