import { MetadataRoute } from 'next'
import { prisma } from '@/infrastructure/database/prisma'
import { MADAGASCAR_CITY_SEO } from '@/shared/data/madagascarSeo'

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://imopanorama.mg').replace(/\/$/, '')

const now = new Date()

function page(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified: Date = now,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    page('', 'daily', 1),
    page('/proprietes', 'daily', 0.95),
    page('/maisons-a-vendre', 'weekly', 0.86),
    page('/terrains-a-vendre', 'weekly', 0.86),
    page('/appartements-a-louer', 'weekly', 0.86),
    page('/vendre', 'monthly', 0.84),
    page('/estimation', 'monthly', 0.84),
    page('/investir-a-madagascar', 'monthly', 0.82),
    page('/guide-achat', 'monthly', 0.76),
    page('/guide-location', 'monthly', 0.76),
    page('/calculateur-budget', 'monthly', 0.72),
    page('/services', 'monthly', 0.7),
    page('/batipanorama', 'weekly', 0.82),
    page('/batipanorama/projets', 'weekly', 0.76),
    page('/batipanorama/contact', 'monthly', 0.72),
    page('/actualites', 'daily', 0.82),
    page('/faq', 'monthly', 0.62),
    page('/temoignages', 'monthly', 0.6),
    page('/contact', 'monthly', 0.7),
    page('/qui-sommes-nous', 'monthly', 0.6),
    page('/mentions-legales', 'yearly', 0.3),
    page('/politique-confidentialite', 'yearly', 0.3),
    page('/cgu', 'yearly', 0.3),
  ]

  const citySeoPages: MetadataRoute.Sitemap = MADAGASCAR_CITY_SEO.map((city) => ({
    url: `${baseUrl}/immobilier/${city.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: city.slug === 'antananarivo' ? 0.82 : 0.78,
  }))

  try {
    // Dynamic property pages (only published ones for SEO)
    const properties = await prisma.property.findMany({
      where: {
        isPublished: true,
        status: 'AVAILABLE',
      },
      select: {
        id: true,
        updatedAt: true,
        isFeatured: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 1000, // Limit for performance
    })

    const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/proprietes/${property.id}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: property.isFeatured ? 0.74 : 0.68,
    }))

    // Dynamic news pages (only published ones)
    const news = await prisma.news.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 500, // Limit for performance
    })

    const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
      url: `${baseUrl}/actualites/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.66,
    }))

    const batiProjects = await prisma.batiProject.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        updatedAt: true,
        status: true,
      },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      take: 300,
    })

    const batiProjectPages: MetadataRoute.Sitemap = batiProjects.map((project) => ({
      url: `${baseUrl}/batipanorama/projet/${project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: project.status === 'IN_PROGRESS' ? 'weekly' as const : 'monthly' as const,
      priority: project.status === 'IN_PROGRESS' ? 0.72 : 0.64,
    }))

    return [...staticPages, ...citySeoPages, ...propertyPages, ...newsPages, ...batiProjectPages]
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    console.warn(`Sitemap generated without dynamic DB pages: ${message}`)
    // Return at least static pages if DB query fails
    return [...staticPages, ...citySeoPages]
  }
}
