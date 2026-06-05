import { News, NewsCategory, Prisma } from '@prisma/client';
import { slugify } from '@/shared/utils';
import { prisma } from '@/infrastructure/database/prisma';

export type CreateNewsInput = {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  images?: string[];
  category?: NewsCategory;
  tags?: string[];
  isPublished?: boolean;
  authorId: string;
};

export type UpdateNewsInput = Partial<CreateNewsInput>;

export const newsService = {
  async listNews(params: {
    page?: number;
    limit?: number;
    includeUnpublished?: boolean;
    category?: NewsCategory;
    isPublished?: boolean;
    search?: string;
  } = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const where: Prisma.NewsWhereInput = {
      ...(params.includeUnpublished ? {} : { isPublished: true }),
      ...(params.category ? { category: params.category } : {}),
      ...(params.isPublished !== undefined ? { isPublished: params.isPublished } : {}),
      ...(params.search ? {
        OR: [
          { title: { contains: params.search, mode: 'insensitive' } },
          { slug: { contains: params.search, mode: 'insensitive' } },
          { excerpt: { contains: params.search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  /**
   * Récupère toutes les actualités
   */
  async getAllNews(includeUnpublished = false) {
    return prisma.news.findMany({
      where: includeUnpublished ? {} : { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * Récupère une actualité par son ID
   */
  async getNewsById(id: string) {
    return prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * Récupère une actualité par son slug
   */
  async getNewsBySlug(slug: string) {
    return prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * Récupère les actualités par catégorie
   */
  async getNewsByCategory(category: NewsCategory, includeUnpublished = false) {
    return prisma.news.findMany({
      where: {
        category,
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * Crée une nouvelle actualité
   */
  async createNews(data: CreateNewsInput): Promise<News> {
    const slug = data.slug || slugify(data.title);

    // Vérifier si le slug existe déjà
    const existingNews = await prisma.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      throw new Error('Un article avec ce slug existe déjà');
    }

    return prisma.news.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || '',
        images: data.images || [],
        category: data.category || 'GENERAL',
        tags: data.tags || [],
        isPublished: data.isPublished || false,
        publishedAt: data.isPublished ? new Date() : null,
        author: {
          connect: { id: data.authorId },
        },
      },
    });
  },

  /**
   * Met à jour une actualité existante
   */
  async updateNews(id: string, data: UpdateNewsInput): Promise<News> {
    try {
      // Créer un objet de mise à jour strictement typé
      const updateData: Record<string, any> = {};

      // Traiter chaque champ individuellement pour s'assurer du bon typage
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
      if (data.category) updateData.category = data.category;
      if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;

      // Traiter les tableaux spécialement pour éviter les problèmes de typage
      if (Array.isArray(data.tags)) updateData.tags = [...data.tags];
      if (Array.isArray(data.images)) updateData.images = [...data.images];

      // Gérer le slug
      if (data.slug !== undefined) {
        updateData.slug = data.slug;
      } else if (data.title) {
        updateData.slug = slugify(data.title);
      }

      // Gérer la date de publication
      if (data.isPublished === true) {
        const currentNews = await prisma.news.findUnique({ where: { id } });
        if (!currentNews?.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      // Vérifier si le slug existe déjà (sauf pour l'article en cours de modification)
      if (updateData.slug) {
        const existingWithSlug = await prisma.news.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id }
          }
        });

        if (existingWithSlug) {
          throw new Error('Un article avec ce slug existe déjà');
        }
      }

      // Vérifier qu'il y a des données à mettre à jour
      if (Object.keys(updateData).length === 0) {
        const existingNews = await prisma.news.findUnique({
          where: { id },
          include: { author: true }
        });
        if (!existingNews) {
          throw new Error('Article non trouvé');
        }
        return existingNews;
      }

      const result = await prisma.news.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.error('Erreur dans newsService.updateNews:', error);
      throw error;
    }
  },

  /**
   * Supprime une actualité
   */
  async deleteNews(id: string): Promise<News> {
    return prisma.news.delete({
      where: { id },
    });
  },

  /**
   * Récupère les actualités récentes
   */
  async getRecentNews(limit = 5) {
    return prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },

  /**
   * Recherche d'actualités
   */
  async searchNews(query: string, includeUnpublished = false) {
    return prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  },
};
