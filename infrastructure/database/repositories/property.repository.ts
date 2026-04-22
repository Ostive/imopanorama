import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Types ────────────────────────────────────────────────── */

export interface PropertyFindManyParams {
  where?: Prisma.PropertyWhereInput;
  orderBy?: Prisma.PropertyOrderByWithRelationInput;
  skip?: number;
  take?: number;
  select?: Prisma.PropertySelect;
  include?: Prisma.PropertyInclude;
}

export interface PropertyFindUniqueParams {
  where: Prisma.PropertyWhereUniqueInput;
  select?: Prisma.PropertySelect;
  include?: Prisma.PropertyInclude;
}

/* ─── Repository ───────────────────────────────────────────── */

export const propertyRepository = {
  async findMany(params: PropertyFindManyParams = {}) {
    return prisma.property.findMany(params);
  },

  async findUnique(params: PropertyFindUniqueParams) {
    return prisma.property.findUnique(params);
  },

  async count(where?: Prisma.PropertyWhereInput) {
    return prisma.property.count({ where });
  },

  async create(data: Prisma.PropertyUncheckedCreateInput) {
    return prisma.property.create({ data });
  },

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.property.delete({ where: { id } });
  },

  async exists(id: string): Promise<boolean> {
    const count = await prisma.property.count({ where: { id } });
    return count > 0;
  },

  /**
   * Executes findMany + count in parallel for paginated queries
   */
  async findManyWithCount(params: PropertyFindManyParams = {}) {
    const [data, total] = await Promise.all([
      prisma.property.findMany(params),
      prisma.property.count({ where: params.where }),
    ]);
    return { data, total };
  },
};
