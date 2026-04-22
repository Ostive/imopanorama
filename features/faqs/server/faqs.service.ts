import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Types ────────────────────────────────────────────────── */

interface FaqListParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
}

interface FaqListResult {
  faqs: unknown[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreateFaqData {
  question: string;
  answer: string;
  category: string;
  order?: number;
  isActive?: boolean;
}

type UpdateFaqData = Partial<CreateFaqData>;

/* ─── Service ──────────────────────────────────────────────── */

export const faqsServerService = {
  /**
   * Liste les FAQs avec pagination et filtres
   */
  async list(params: FaqListParams = {}): Promise<FaqListResult> {
    const { page = 1, limit = 10, category, isActive, search } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.FaqWhereInput = {};

    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [faqs, totalCount] = await Promise.all([
      prisma.faq.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.faq.count({ where }),
    ]);

    return {
      faqs,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  },

  /**
   * Récupère les catégories distinctes
   */
  async getCategories(): Promise<string[]> {
    const result = await prisma.faq.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return result.map(r => r.category);
  },

  /**
   * Récupère une FAQ par ID
   */
  async getById(id: string) {
    return prisma.faq.findUnique({ where: { id } });
  },

  /**
   * Crée une FAQ
   */
  async create(data: CreateFaqData) {
    return prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
        isActive: data.isActive,
      },
    });
  },

  /**
   * Met à jour une FAQ
   */
  async update(id: string, data: UpdateFaqData) {
    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) return null;
    return prisma.faq.update({ where: { id }, data });
  },

  /**
   * Supprime une FAQ
   */
  async remove(id: string): Promise<boolean> {
    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.faq.delete({ where: { id } });
    return true;
  },
};
