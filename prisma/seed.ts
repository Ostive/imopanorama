/**
 * Main seed file - Orchestrates all seeders
 */

import 'dotenv/config';
import { seedUsers } from './seeders/user-seeder';
import { seedFaqs } from './seeders/faq-seeder';
import { seedContacts } from './seeders/contact-seeder';
import { seedNews } from './seeders/news-seeder';
import { seedBatiPanorama } from './seeders/batipanorama-seeder';
import { seedProperties } from './seeders/property-seeder';
import { prisma } from '../infrastructure/database/prisma';

async function main() {
  console.log('===============================');
  console.log('🌱 DÉBUT DU SEEDING - ' + new Date().toISOString());
  console.log('===============================');

  try {
    // Step 1: Seed Users
    const users = await seedUsers(prisma);

    await Promise.all([
      seedFaqs(prisma),
      seedContacts(prisma, {}, users),
      seedProperties(prisma, users),
      seedNews(prisma, users),
      seedBatiPanorama(prisma),
    ]);

    console.log('\n===============================');
    console.log('✅ SEEDING TERMINÉ AVEC SUCCÈS !');
    console.log('===============================\n');

    console.log('📝 Credentials de test:');
    console.log('   👑 Admin: admin@imopanorama.mg / Admin123!');
    console.log('   🔑 Super Admin: superadmin@imopanorama.mg / SuperAdmin123!');
    console.log('   👔 Agent: agent@imopanorama.mg / Agent123!');
    console.log('   👤 Client: client@imopanorama.mg / Client123!');
    console.log('   👤 User: user@imopanorama.mg / User123!');
    console.log('\n🚀 Accédez à l\'application: http://localhost:3000/login\n');

  } catch (error) {
    console.error('\n❌ Erreur lors du seeding:', error);
    throw error;
  }
}

// Execute main function and handle results
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Connexion à la base de données fermée');
  });
