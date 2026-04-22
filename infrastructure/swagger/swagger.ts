import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const apiPaths = path.join(process.cwd(), 'app', 'api', '**', '*.ts').replace(/\\/g, '/');
const docsPaths = path.join(process.cwd(), 'lib', 'swagger-docs', '**', '*.ts').replace(/\\/g, '/');

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ImoPanorama API',
      version: '1.0.0',
      description: 'API documentation for ImoPanorama - Real Estate Platform in Madagascar',
      contact: {
        name: 'ImoPanorama Support',
        email: 'contact@imopanorama.mg',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from Better Auth',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
          description: 'Session cookie from Better Auth',
        },
      },
      schemas: {
        // Common schemas
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
          },
        },
        PaginationParams: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              default: 1,
              description: 'Page number',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
              description: 'Items per page',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {},
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
            },
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
          },
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            firstName: {
              type: 'string',
              nullable: true,
            },
            lastName: {
              type: 'string',
              nullable: true,
            },
            phone: {
              type: 'string',
              nullable: true,
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'AGENT', 'ADMIN', 'SUPER_ADMIN'],
              default: 'CLIENT',
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Property schemas
        Property: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            propertyType: {
              type: 'string',
              enum: [
                'APARTMENT', 'HOUSE', 'VILLA', 'STUDIO', 'DUPLEX', 'TRIPLEX',
                'PENTHOUSE', 'LOFT', 'TOWNHOUSE', 'COMMERCIAL', 'OFFICE',
                'WAREHOUSE', 'LAND', 'BUILDING', 'PARKING', 'GARAGE',
                'SHOP', 'RESTAURANT', 'HOTEL', 'INDUSTRIAL', 'AGRICULTURAL',
                'MIXED_USE', 'VACATION_HOME', 'OTHER'
              ],
            },
            transactionType: {
              type: 'string',
              enum: ['SALE', 'RENT', 'LEASE'],
            },
            price: {
              type: 'number',
              format: 'double',
            },
            city: {
              type: 'string',
            },
            address: {
              type: 'string',
              nullable: true,
            },
            size: {
              type: 'number',
              format: 'double',
              nullable: true,
            },
            bedrooms: {
              type: 'integer',
              nullable: true,
            },
            bathrooms: {
              type: 'integer',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'SOLD', 'RENTED', 'RESERVED', 'UNAVAILABLE'],
              default: 'AVAILABLE',
            },
            isFeatured: {
              type: 'boolean',
              default: false,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Terrain schemas
        Terrain: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            price: {
              type: 'number',
              format: 'double',
            },
            size: {
              type: 'number',
              format: 'double',
            },
            city: {
              type: 'string',
            },
            location: {
              type: 'string',
              nullable: true,
            },
            type: {
              type: 'string',
              enum: ['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'MIXED', 'OTHER'],
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'SOLD', 'RESERVED', 'UNAVAILABLE'],
              default: 'AVAILABLE',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            features: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            isFeatured: {
              type: 'boolean',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Contact schemas
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            phone: {
              type: 'string',
              nullable: true,
            },
            message: {
              type: 'string',
            },
            isRead: {
              type: 'boolean',
              default: false,
            },
            propertyId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // News schemas
        News: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            content: {
              type: 'string',
              description: 'HTML content',
            },
            excerpt: {
              type: 'string',
              nullable: true,
            },
            category: {
              type: 'string',
              enum: ['ACTUALITE', 'CONSEIL', 'MARCHE', 'PROJET', 'EVENEMENT', 'AUTRE'],
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            isPublished: {
              type: 'boolean',
              default: false,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // FAQ schemas
        FAQ: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            question: {
              type: 'string',
            },
            answer: {
              type: 'string',
            },
            category: {
              type: 'string',
              nullable: true,
            },
            order: {
              type: 'integer',
              default: 0,
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // BatiPanorama schemas
        BatiProject: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            location: {
              type: 'string',
            },
            category: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['IN_PROGRESS', 'COMPLETED', 'PLANNED'],
            },
            surface: {
              type: 'number',
              nullable: true,
            },
            duration: {
              type: 'string',
              nullable: true,
            },
            budget: {
              type: 'string',
              nullable: true,
            },
            coverImage: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
            },
            isPublished: {
              type: 'boolean',
              default: true,
            },
            order: {
              type: 'integer',
              default: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management',
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)',
      },
      {
        name: 'Properties',
        description: 'Unified property management (apartments, houses, villas, etc.)',
      },
      {
        name: 'Terrains',
        description: 'Land and terrain management',
      },
      {
        name: 'Contacts',
        description: 'Contact form submissions and inquiries',
      },
      {
        name: 'Favorites',
        description: 'User wishlist management',
      },
      {
        name: 'News',
        description: 'News articles and blog posts',
      },
      {
        name: 'FAQs',
        description: 'Frequently asked questions',
      },
      {
        name: 'Partners',
        description: 'Partner management',
      },
      {
        name: 'BatiPanorama',
        description: 'Construction services - projects, quotes, services',
      },
      {
        name: 'Search',
        description: 'Semantic search with vector database',
      },
      {
        name: 'Analytics',
        description: 'Tracking and analytics',
      },
      {
        name: 'Media',
        description: 'Image upload and management',
      },
    ],
  },
  apis: [apiPaths, docsPaths],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
