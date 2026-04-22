// Configuration centralisée de l'application
export const config = {
  // Informations de l'entreprise
  company: {
    name: 'ImoPanorama',
    description: 'Agence immobilière spécialisée dans la vente de terrains à Madagascar',
    location: 'Antananarivo, Madagascar',
    phone: '+261 34 XX XX XX XX',
    email: 'contact@imopanorama.mg',
    website: 'https://imopanorama.mg'
  },

  // Partenaire construction
  partner: {
    name: 'BatiPanorama',
    description: 'Expert construction à Madagascar depuis 15 ans',
    email: 'info@batipanorama.mg',
    experience: 15,
    projects: 100
  },

  // Configuration API
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://imopanorama.mg' 
      : 'http://localhost:3000',
    timeout: 10000,
    retries: 3
  },

  // Pagination par défaut
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  },

  // Configuration des images
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    placeholder: '/images/placeholders/property.jpg'
  },

  // SEO
  seo: {
    defaultTitle: 'ImoPanorama Madagascar - Vente de Terrains',
    defaultDescription: 'Agence immobilière spécialisée dans la vente de terrains à Madagascar. Découvrez nos terrains disponibles et notre partenaire BatiPanorama pour la construction.',
    keywords: ['immobilier', 'terrain', 'Madagascar', 'vente', 'construction', 'BatiPanorama']
  },

  // Réseaux sociaux
  social: {
    facebook: 'https://facebook.com/imopanorama',
    instagram: 'https://instagram.com/imopanorama',
    linkedin: 'https://linkedin.com/company/imopanorama'
  },

  // Feature flags pour l'évolution progressive
  features: {
    enableApiRoutes: true,
    enableUserAuth: true, // ✅ Activé
    enableAdmin: true, // ✅ Activé
    enablePayments: false, // Future
    enableBlog: false, // Future
    enableBooking: false, // Future
    enableNotifications: false, // Future
  },

  // Configuration des modules (prépare la modularisation)
  modules: {
    properties: {
      enabled: true,
      apiEndpoint: '/api/properties',
      cacheTimeout: 300000 // 5 minutes
    },
    batipanorama: {
      enabled: true,
      apiEndpoint: '/api/batipanorama', // Future
      cacheTimeout: 600000 // 10 minutes
    },
    users: {
      enabled: false, // Future
      apiEndpoint: '/api/users'
    },
    payments: {
      enabled: false, // Future
      apiEndpoint: '/api/payments'
    }
  }
} as const;

// Types pour la configuration
export type Config = typeof config;
export type ModuleName = keyof typeof config.modules;
