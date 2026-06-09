import type { Metadata } from 'next'
import ProjectDetailPage from './ProjectDetailPageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/bati-projects/${slug}`,
      { next: { revalidate: 3600 } },
    )
    if (res.ok) {
      const data = await res.json()
      const project = data.project
      if (project?.title) {
        return {
          title: project.title,
          description: (project.description as string | undefined)?.slice(0, 160) ??
            'Découvrez ce projet de construction BatiPanorama à Madagascar.',
        }
      }
    }
  } catch {}
  return {
    title: 'Projet BatiPanorama',
    description: 'Découvrez ce projet de construction et rénovation réalisé par BatiPanorama à Madagascar.',
  }
}

export { ProjectDetailPage as default }
