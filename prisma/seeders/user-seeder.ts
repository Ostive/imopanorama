import { PrismaClient, Role } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export async function seedUsers(prisma: PrismaClient) {
  console.log('\n👥 Seeding users...');

  // Create Better Auth instance
  const authInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET || "your-super-secret-key-change-this-in-production",
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
  });

  const users: any = {};

  // Admin
  try {
    await authInstance.api.signUpEmail({
      body: {
        email: 'admin@imopanorama.mg',
        password: 'Admin123!',
        name: 'Admin User',
      }
    });
    
    users.admin = await prisma.user.update({
      where: { email: 'admin@imopanorama.mg' },
      data: {
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        phone: '+261 34 00 00 00',
        emailVerified: true,
      },
    });
    console.log(`   ✅ Admin created: ${users.admin.email}`);
  } catch (error) {
    users.admin = await prisma.user.findUnique({ where: { email: 'admin@imopanorama.mg' } });
    console.log(`   ℹ️  Admin already exists: admin@imopanorama.mg`);
  }

  // Super Admin
  try {
    await authInstance.api.signUpEmail({
      body: {
        email: 'superadmin@imopanorama.mg',
        password: 'SuperAdmin123!',
        name: 'Super Admin',
      }
    });
    
    users.superAdmin = await prisma.user.update({
      where: { email: 'superadmin@imopanorama.mg' },
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        role: Role.SUPER_ADMIN,
        phone: '+261 34 00 00 01',
        emailVerified: true,
      },
    });
    console.log(`   ✅ Super Admin created: ${users.superAdmin.email}`);
  } catch (error) {
    users.superAdmin = await prisma.user.findUnique({ where: { email: 'superadmin@imopanorama.mg' } });
    console.log(`   ℹ️  Super Admin already exists: superadmin@imopanorama.mg`);
  }

  // Agent
  try {
    await authInstance.api.signUpEmail({
      body: {
        email: 'agent@imopanorama.mg',
        password: 'Agent123!',
        name: 'Agent Immobilier',
      }
    });
    
    users.agent = await prisma.user.update({
      where: { email: 'agent@imopanorama.mg' },
      data: {
        firstName: 'Agent',
        lastName: 'Immobilier',
        role: Role.AGENT,
        phone: '+261 34 00 00 02',
        emailVerified: true,
      },
    });
    console.log(`   ✅ Agent created: ${users.agent.email}`);
  } catch (error) {
    users.agent = await prisma.user.findUnique({ where: { email: 'agent@imopanorama.mg' } });
    console.log(`   ℹ️  Agent already exists: agent@imopanorama.mg`);
  }

  // Client
  try {
    await authInstance.api.signUpEmail({
      body: {
        email: 'client@imopanorama.mg',
        password: 'Client123!',
        name: 'Client Test',
      }
    });
    
    users.client = await prisma.user.update({
      where: { email: 'client@imopanorama.mg' },
      data: {
        firstName: 'Client',
        lastName: 'Test',
        role: Role.CLIENT,
        phone: '+261 34 00 00 03',
        emailVerified: true,
      },
    });
    console.log(`   ✅ Client created: ${users.client.email}`);
  } catch (error) {
    users.client = await prisma.user.findUnique({ where: { email: 'client@imopanorama.mg' } });
    console.log(`   ℹ️  Client already exists: client@imopanorama.mg`);
  }

  // User standard (for testing)
  try {
    await authInstance.api.signUpEmail({
      body: {
        email: 'user@imopanorama.mg',
        password: 'User123!',
        name: 'User Test',
      }
    });
    
    users.user = await prisma.user.update({
      where: { email: 'user@imopanorama.mg' },
      data: {
        firstName: 'User',
        lastName: 'Test',
        role: Role.CLIENT,
        phone: '+261 34 00 00 05',
        emailVerified: true,
      },
    });
    console.log(`   ✅ User created: ${users.user.email}`);
  } catch (error) {
    users.user = await prisma.user.findUnique({ where: { email: 'user@imopanorama.mg' } });
    console.log(`   ℹ️  User already exists: user@imopanorama.mg`);
  }

  return users;
}
