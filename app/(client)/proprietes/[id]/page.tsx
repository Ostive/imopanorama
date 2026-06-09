import type { Metadata } from 'next'
import PropertyDetailPage from './PropertyDetailPageClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/properties/${id}`,
      { next: { revalidate: 3600 } },
    )
    if (res.ok) {
      const data = await res.json()
      const p = data.property
      if (p) {
        return {
          title: p.title ?? 'Propriété',
          description: (p.description as string | undefined)?.slice(0, 160) ??
            'Découvrez cette propriété sur ImoPanorama Madagascar.',
        }
      }
    }
  } catch {}
  return {
    title: 'Propriété',
    description: 'Découvrez cette propriété à vendre ou à louer sur ImoPanorama Madagascar.',
  }
}

export { PropertyDetailPage as default }
