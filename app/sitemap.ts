import { MetadataRoute } from 'next'
import { prisma } from '@/infrastructure/database/prisma'
import { MADAGASCAR_CITY_SEO } from '@/shared/data/madagascarSeo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imopanorama.mg'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/proprietes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/batipanorama`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vendre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/estimation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calculateur-budget`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide-achat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/guide-location`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/investir-a-madagascar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/terrains-a-vendre`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/maisons-a-vendre`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/appartements-a-louer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/temoignages`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/actualites`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qui-sommes-nous`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const citySeoPages: MetadataRoute.Sitemap = MADAGASCAR_CITY_SEO.map((city) => ({
    url: `${baseUrl}/immobilier/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
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
      priority: 0.7,
    }))

    // Dynamic news pages (only published ones)
    const news = await prisma.news.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 500, // Limit for performance
    })

    const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
      url: `${baseUrl}/actualites/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...citySeoPages, ...propertyPages, ...newsPages]
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    console.warn(`Sitemap generated without dynamic DB pages: ${message}`)
    // Return at least static pages if DB query fails
    return [...staticPages, ...citySeoPages]
  }
}
