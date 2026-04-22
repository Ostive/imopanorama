import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// PrismaClient est attaché au global object en développement pour éviter
// d'épuiser la limite de connexions à la base de données pendant le hot-reloading

// Déclaration pour TypeScript pour permettre l'ajout de prisma à l'objet global
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Évite de créer plusieurs instances en développement
export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Vérifie si la connexion à la base de données est prête
 * @returns Promise<boolean> - true si la connexion est établie, false sinon
 */
export const isDatabaseConnectionReady = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

/**
 * Déconnecte proprement le client Prisma
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};
