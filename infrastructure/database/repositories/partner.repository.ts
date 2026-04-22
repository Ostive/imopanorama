import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

export const partnerRepository = {
  async findMany(params: Prisma.PartnerFindManyArgs = {}) {
    return prisma.partner.findMany(params);
  },

  async findUnique(id: string) {
    return prisma.partner.findUnique({ where: { id } });
  },

  async create(data: Prisma.PartnerCreateInput) {
    return prisma.partner.create({ data });
  },

  async update(id: string, data: Prisma.PartnerUpdateInput) {
    return prisma.partner.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.partner.delete({ where: { id } });
  },
};
