import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

<<<<<<< HEAD
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
=======
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export { prisma };
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
>>>>>>> 3446c28164d4dfde3ffa9a54a79847da661e415f
