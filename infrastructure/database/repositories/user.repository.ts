import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Repository ───────────────────────────────────────────── */

export const userRepository = {
  async findMany(params: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    skip?: number;
    take?: number;
    select?: Prisma.UserSelect;
  } = {}) {
    return prisma.user.findMany(params);
  },

  async findUnique(id: string, select?: Prisma.UserSelect) {
    return prisma.user.findUnique({ where: { id }, select });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async count(where?: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { id } });
    return count > 0;
  },

  /**
   * Executes findMany + count in parallel for paginated queries
   */
  async findManyWithCount(params: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    skip?: number;
    take?: number;
    select?: Prisma.UserSelect;
  } = {}) {
    const [data, total] = await Promise.all([
      prisma.user.findMany(params),
      prisma.user.count({ where: params.where }),
    ]);
    return { data, total };
  },
};
