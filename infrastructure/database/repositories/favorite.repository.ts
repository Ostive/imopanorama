import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Repository ───────────────────────────────────────────── */

export const favoriteRepository = {
  async findMany(params: {
    where?: Prisma.PropertyFavoriteWhereInput;
    include?: Prisma.PropertyFavoriteInclude;
    orderBy?: Prisma.PropertyFavoriteOrderByWithRelationInput;
  } = {}) {
    return prisma.propertyFavorite.findMany(params);
  },

  async findFirst(where: Prisma.PropertyFavoriteWhereInput) {
    return prisma.propertyFavorite.findFirst({ where });
  },

  async count(where?: Prisma.PropertyFavoriteWhereInput) {
    return prisma.propertyFavorite.count({ where });
  },

  async create(data: Prisma.PropertyFavoriteUncheckedCreateInput, include?: Prisma.PropertyFavoriteInclude) {
    return prisma.propertyFavorite.create({ data, include });
  },

  async delete(id: string) {
    return prisma.propertyFavorite.delete({ where: { id } });
  },
};
