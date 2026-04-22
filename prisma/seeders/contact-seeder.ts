import { PrismaClient } from '@prisma/client';

export async function seedContacts(prisma: PrismaClient, terrains: any, users: any) {
  console.log('\n📧 Seeding contacts...');

  // Get first two properties to attach contacts to
  const properties = await prisma.property.findMany({ take: 2 });
  
  if (properties.length < 2) {
    console.log('   ⚠️  Not enough properties to create contacts. Skipping...');
    return { contact1: null, contact2: null };
  }

  const clientUser = users.client;

  const contact1 = await prisma.propertyContact.create({
    data: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+261 34 11 22 33',
      message: 'Bonjour, je suis intéressé par cette propriété. Pouvez-vous me contacter pour plus d\'informations ?',
      propertyId: properties[0].id,
      isRead: false,
    },
  });
  console.log(`   ✅ Contact created: ${contact1.firstName} ${contact1.lastName}`);

  const contact2 = await prisma.propertyContact.create({
    data: {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phone: '+261 34 44 55 66',
      message: 'Je souhaite visiter cette propriété. Quelles sont vos disponibilités ?',
      propertyId: properties[1].id,
      isRead: true,
      userId: clientUser?.id,
    },
  });
  console.log(`   ✅ Contact created: ${contact2.firstName} ${contact2.lastName}`);

  return { contact1, contact2 };
}
