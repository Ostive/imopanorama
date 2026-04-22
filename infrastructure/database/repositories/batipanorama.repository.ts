import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── BatiProject Repository ─────────────────────────────── */

export const batiProjectRepository = {
  async findMany(params: Prisma.BatiProjectFindManyArgs = {}) {
    return prisma.batiProject.findMany(params);
  },

  async findUnique(id: string) {
    return prisma.batiProject.findUnique({ where: { id } });
  },

  async create(data: Prisma.BatiProjectUncheckedCreateInput) {
    return prisma.batiProject.create({ data });
  },

  async update(id: string, data: Prisma.BatiProjectUncheckedUpdateInput) {
    return prisma.batiProject.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.batiProject.delete({ where: { id } });
  },
};

/* ─── BatiService Repository ─────────────────────────────── */

export const batiServiceRepository = {
  async findMany(params: Prisma.BatiServiceFindManyArgs = {}) {
    return prisma.batiService.findMany(params);
  },

  async findUnique(id: string) {
    return prisma.batiService.findUnique({ where: { id } });
  },

  async create(data: Prisma.BatiServiceUncheckedCreateInput) {
    return prisma.batiService.create({ data });
  },

  async update(id: string, data: Prisma.BatiServiceUncheckedUpdateInput) {
    return prisma.batiService.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.batiService.delete({ where: { id } });
  },
};

/* ─── BatiProcess Repository ─────────────────────────────── */

export const batiProcessRepository = {
  async findMany(params: Prisma.BatiProcessFindManyArgs = {}) {
    return prisma.batiProcess.findMany(params);
  },

  async findUnique(id: string) {
    return prisma.batiProcess.findUnique({ where: { id } });
  },

  async create(data: Prisma.BatiProcessUncheckedCreateInput) {
    return prisma.batiProcess.create({ data });
  },

  async update(id: string, data: Prisma.BatiProcessUncheckedUpdateInput) {
    return prisma.batiProcess.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.batiProcess.delete({ where: { id } });
  },
};

/* ─── BatiQuote Repository ───────────────────────────────── */

export const batiQuoteRepository = {
  async findMany(params: Prisma.BatiQuoteFindManyArgs = {}) {
    return prisma.batiQuote.findMany(params);
  },

  async findUnique(id: string, include?: Prisma.BatiQuoteInclude) {
    return prisma.batiQuote.findUnique({ where: { id }, include });
  },

  async create(data: Prisma.BatiQuoteUncheckedCreateInput, include?: Prisma.BatiQuoteInclude) {
    return prisma.batiQuote.create({ data, include });
  },

  async update(id: string, data: Prisma.BatiQuoteUncheckedUpdateInput, include?: Prisma.BatiQuoteInclude) {
    return prisma.batiQuote.update({ where: { id }, data, include });
  },

  async delete(id: string) {
    return prisma.batiQuote.delete({ where: { id } });
  },
};
