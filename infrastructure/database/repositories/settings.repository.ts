import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Repository ───────────────────────────────────────────── */

export const settingsRepository = {
  async findUnique(key: string) {
    return prisma.settings.findUnique({ where: { key } });
  },

  async findMany(where?: Prisma.SettingsWhereInput) {
    return prisma.settings.findMany({ where });
  },

  async upsert(key: string, data: { value: Prisma.InputJsonValue; category: string }) {
    return prisma.settings.upsert({
      where: { key },
      update: {
        value: data.value,
        category: data.category,
        updatedAt: new Date(),
      },
      create: {
        key,
        value: data.value,
        category: data.category,
      },
    });
  },

  async delete(key: string) {
    return prisma.settings.delete({ where: { key } });
  },

  async exists(key: string): Promise<boolean> {
    const count = await prisma.settings.count({ where: { key } });
    return count > 0;
  },
};
