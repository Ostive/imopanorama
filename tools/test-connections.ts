import 'dotenv/config';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function testPostgres() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    console.log('  [OK] PostgreSQL connecte');
    console.log(`       Users: ${userCount} | Properties: ${propertyCount}`);
    return true;
  } catch (e: any) {
    console.error('  [FAIL] PostgreSQL:', e.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testRedis() {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.error('  [FAIL] REDIS_URL non definie');
    return false;
  }

  const client = new Redis(url, {
    maxRetriesPerRequest: 0,
    connectTimeout: 5000,
    commandTimeout: 5000,
    retryStrategy: () => null,
  });

  return new Promise<boolean>((resolve) => {
    client.on('connect', async () => {
      try {
        const pong = await client.ping();
        await client.set('imo:test', 'ok', 'EX', 10);
        const val = await client.get('imo:test');
        console.log(`  [OK] Redis connecte — PING: ${pong} | SET/GET: ${val}`);
        client.disconnect();
        resolve(true);
      } catch (e: any) {
        console.error('  [FAIL] Redis commande:', e.message);
        client.disconnect();
        resolve(false);
      }
    });

    client.on('error', (e) => {
      console.error('  [FAIL] Redis connexion:', e.message);
      client.disconnect();
      resolve(false);
    });
  });
}

async function main() {
  console.log('\n=== TEST CONNEXIONS ===\n');

  console.log('PostgreSQL:');
  await testPostgres();

  console.log('\nRedis:');
  await testRedis();

  console.log('\n======================\n');
}

main().catch(console.error);
