/**
 * Production seeder — only essential data, no fake/test records.
 *
 * Required env vars:
 *   SEED_SUPER_ADMIN_EMAIL     (default: superadmin@imopanorama.mg)
 *   SEED_SUPER_ADMIN_PASSWORD  (required)
 *   SEED_ADMIN_EMAIL           (default: admin@imopanorama.mg)
 *   SEED_ADMIN_PASSWORD        (required)
 *   BETTER_AUTH_URL
 *   BETTER_AUTH_SECRET
 *   DATABASE_URL
 */

import 'dotenv/config';
import { Role } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../infrastructure/database/prisma';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function seedAdmins() {
  console.log('\n👥 Seeding admin accounts...');

  const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    secret: requireEnv('BETTER_AUTH_SECRET'),
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
  });

  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@imopanorama.mg';
  const superAdminPassword = requireEnv('SEED_SUPER_ADMIN_PASSWORD');
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@imopanorama.mg';
  const adminPassword = requireEnv('SEED_ADMIN_PASSWORD');

  // Super Admin
  const existingSuperAdmin = await prisma.user.findUnique({ where: { email: superAdminEmail } });
  if (existingSuperAdmin) {
    console.log(`   ℹ️  Super Admin already exists: ${superAdminEmail}`);
  } else {
    await auth.api.signUpEmail({
      body: { email: superAdminEmail, password: superAdminPassword, name: 'Super Admin' },
    });
    await prisma.user.update({
      where: { email: superAdminEmail },
      data: { role: Role.SUPER_ADMIN, emailVerified: true },
    });
    console.log(`   ✅ Super Admin created: ${superAdminEmail}`);
  }

  // Admin
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingAdmin) {
    console.log(`   ℹ️  Admin already exists: ${adminEmail}`);
  } else {
    await auth.api.signUpEmail({
      body: { email: adminEmail, password: adminPassword, name: 'Admin' },
    });
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: Role.ADMIN, emailVerified: true },
    });
    console.log(`   ✅ Admin created: ${adminEmail}`);
  }
}

async function seedFaqs() {
  console.log('\n❓ Seeding FAQs...');

  const faqs = [
    {
      id: '1',
      question: "Quels sont les documents nécessaires pour acheter un bien immobilier à Madagascar ?",
      answer: "Pour acheter un bien immobilier à Madagascar, vous aurez besoin de votre pièce d'identité, d'un justificatif de domicile, d'un relevé bancaire récent, et éventuellement d'une attestation de financement si vous recourez à un prêt. Notre équipe vous accompagne dans la préparation de tous les documents administratifs nécessaires.",
      category: 'achat',
      order: 1,
    },
    {
      id: '2',
      question: "Les étrangers peuvent-ils acheter des propriétés à Madagascar ?",
      answer: "Les étrangers ne peuvent pas acheter directement des terrains à Madagascar, mais ils peuvent acquérir des biens immobiliers via un bail emphytéotique (de 18 à 99 ans) ou en créant une société de droit malgache. Notre équipe juridique peut vous conseiller sur la meilleure option selon votre situation.",
      category: 'achat',
      order: 2,
    },
    {
      id: '3',
      question: "Quels sont les frais supplémentaires lors de l'achat d'un bien immobilier ?",
      answer: "Lors de l'achat d'un bien immobilier à Madagascar, vous devrez prévoir des frais supplémentaires tels que les frais de notaire (environ 6% du prix d'achat), les droits d'enregistrement, les frais de dossier, et éventuellement la commission d'agence. Nous vous fournissons toujours une estimation détaillée de tous ces frais avant toute transaction.",
      category: 'frais',
      order: 3,
    },
    {
      id: '4',
      question: "Combien de temps prend le processus d'achat complet ?",
      answer: "Le processus d'achat complet à Madagascar prend généralement entre 2 et 4 mois, depuis la signature du compromis de vente jusqu'à la remise des clés. Ce délai peut varier en fonction de la complexité de la transaction, des vérifications administratives nécessaires et du mode de financement choisi.",
      category: 'processus',
      order: 4,
    },
    {
      id: '5',
      question: "Comment se passe la visite d'un terrain ?",
      answer: "La visite d'un terrain se fait sur rendez-vous avec l'un de nos agents immobiliers. Nous vous accompagnons sur place pour vous présenter le terrain, ses caractéristiques, son environnement et répondre à toutes vos questions. Nous pouvons également organiser des visites virtuelles pour les clients éloignés.",
      category: 'visite',
      order: 5,
    },
    {
      id: '6',
      question: "Proposez-vous des services d'accompagnement pour la construction ?",
      answer: "Oui, nous proposons des services d'accompagnement pour la construction via notre partenaire BatiPanorama. Nous pouvons vous mettre en relation avec des architectes, des entrepreneurs et des fournisseurs de matériaux de qualité. Nous assurons également un suivi de chantier pour garantir la bonne exécution des travaux.",
      category: 'services',
      order: 6,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: {},
      create: faq,
    });
    console.log(`   ✅ FAQ: ${faq.question.substring(0, 60)}...`);
  }
}

async function main() {
  console.log('===============================');
  console.log('🚀 PRODUCTION SEED - ' + new Date().toISOString());
  console.log('===============================');

  await seedAdmins();
  await seedFaqs();

  console.log('\n===============================');
  console.log('✅ PRODUCTION SEED TERMINÉ');
  console.log('===============================\n');
}

main()
  .catch((e) => {
    console.error('❌ Production seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
