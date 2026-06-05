import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://imopanorama.mg'

  return {
    rules: [
      // All crawlers: full access except private areas
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile/', '/mes-demandes/', '/favoris/'],
      },
      // Google AI (Search Generative Experience) — allow, drives organic traffic
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Bing/Copilot — allow
      {
        userAgent: 'GPTBot',
        allow: ['/proprietes', '/actualites', '/batipanorama', '/immobilier'],
        disallow: ['/admin/', '/api/', '/profile/', '/mes-demandes/'],
      },
      // Claude AI crawler — allow public content
      {
        userAgent: 'ClaudeBot',
        allow: ['/proprietes', '/actualites', '/batipanorama', '/immobilier'],
        disallow: ['/admin/', '/api/', '/profile/'],
      },
      // Common Crawl (used to train LLMs with no SEO return) — block
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      // Meta AI crawler — block
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
