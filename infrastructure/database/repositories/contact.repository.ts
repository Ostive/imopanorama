import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';

/* ─── Types ────────────────────────────────────────────────── */

interface FindManyParams<TWhere, TInclude> {
  where?: TWhere;
  include?: TInclude;
  orderBy?: { createdAt: 'asc' | 'desc' };
  skip?: number;
  take?: number;
}

/* ─── Generic Contact Repository ───────────────────────────── */

export const contactRepository = {
  async findMany(params: FindManyParams<Prisma.ContactWhereInput, Prisma.ContactInclude> = {}) {
    return prisma.contact.findMany(params);
  },

  async findUnique(id: string, include?: Prisma.ContactInclude) {
    return prisma.contact.findUnique({ where: { id }, include });
  },

  async count(where?: Prisma.ContactWhereInput) {
    return prisma.contact.count({ where });
  },

  async create(data: Prisma.ContactUncheckedCreateInput, include?: Prisma.ContactInclude) {
    return prisma.contact.create({ data, include });
  },

  async update(id: string, data: Prisma.ContactUpdateInput, include?: Prisma.ContactInclude) {
    return prisma.contact.update({ where: { id }, data, include });
  },

  async delete(id: string) {
    return prisma.contact.delete({ where: { id } });
  },
};

/* ─── Property Contact Repository ──────────────────────────── */

export const propertyContactRepository = {
  async findMany(params: FindManyParams<Prisma.PropertyContactWhereInput, Prisma.PropertyContactInclude> = {}) {
    return prisma.propertyContact.findMany(params);
  },

  async findUnique(id: string, include?: Prisma.PropertyContactInclude) {
    return prisma.propertyContact.findUnique({ where: { id }, include });
  },

  async count(where?: Prisma.PropertyContactWhereInput) {
    return prisma.propertyContact.count({ where });
  },

  async create(data: Prisma.PropertyContactUncheckedCreateInput, include?: Prisma.PropertyContactInclude) {
    return prisma.propertyContact.create({ data, include });
  },

  async update(id: string, data: Prisma.PropertyContactUpdateInput, include?: Prisma.PropertyContactInclude) {
    return prisma.propertyContact.update({ where: { id }, data, include });
  },

  async delete(id: string) {
    return prisma.propertyContact.delete({ where: { id } });
  },
};
