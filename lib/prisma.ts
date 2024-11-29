import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
}

export default prisma;
export { prisma };
