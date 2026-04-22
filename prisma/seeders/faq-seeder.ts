import { PrismaClient } from '@prisma/client';

export async function seedFaqs(prisma: PrismaClient) {
  console.log('\n❓ Seeding FAQs...');

  const faq1 = await prisma.faq.upsert({
    where: { id: '1' },
    update: {},
    create: {
      question: 'Quels sont les documents nécessaires pour acheter un bien immobilier à Madagascar ?',
      answer: 'Pour acheter un bien immobilier à Madagascar, vous aurez besoin de votre pièce d\'identité, d\'un justificatif de domicile, d\'un relevé bancaire récent, et éventuellement d\'une attestation de financement si vous recourez à un prêt. Notre équipe vous accompagne dans la préparation de tous les documents administratifs nécessaires.',
      category: 'achat',
      order: 1,
    },
  });
  console.log(`   ✅ FAQ created: ${faq1.question.substring(0, 50)}...`);

  const faq2 = await prisma.faq.upsert({
    where: { id: '2' },
    update: {},
    create: {
      question: 'Les étrangers peuvent-ils acheter des propriétés à Madagascar ?',
      answer: 'Les étrangers ne peuvent pas acheter directement des terrains à Madagascar, mais ils peuvent acquérir des biens immobiliers via un bail emphytéotique (de 18 à 99 ans) ou en créant une société de droit malgache. Notre équipe juridique peut vous conseiller sur la meilleure option selon votre situation.',
      category: 'achat',
      order: 2,
    },
  });
  console.log(`   ✅ FAQ created: ${faq2.question.substring(0, 50)}...`);

  const faq3 = await prisma.faq.upsert({
    where: { id: '3' },
    update: {},
    create: {
      question: 'Quels sont les frais supplémentaires lors de l\'achat d\'un bien immobilier ?',
      answer: 'Lors de l\'achat d\'un bien immobilier à Madagascar, vous devrez prévoir des frais supplémentaires tels que les frais de notaire (environ 6% du prix d\'achat), les droits d\'enregistrement, les frais de dossier, et éventuellement la commission d\'agence. Nous vous fournissons toujours une estimation détaillée de tous ces frais avant toute transaction.',
      category: 'frais',
      order: 3,
    },
  });
  console.log(`   ✅ FAQ created: ${faq3.question.substring(0, 50)}...`);

  const faq4 = await prisma.faq.upsert({
    where: { id: '4' },
    update: {},
    create: {
      question: 'Combien de temps prend le processus d\'achat complet ?',
      answer: 'Le processus d\'achat complet à Madagascar prend généralement entre 2 et 4 mois, depuis la signature du compromis de vente jusqu\'à la remise des clés. Ce délai peut varier en fonction de la complexité de la transaction, des vérifications administratives nécessaires et du mode de financement choisi.',
      category: 'processus',
      order: 4,
    },
  });
  console.log(`   ✅ FAQ created: ${faq4.question.substring(0, 50)}...`);

  const faq5 = await prisma.faq.upsert({
    where: { id: '5' },
    update: {},
    create: {
      question: 'Comment se passe la visite d\'un terrain ?',
      answer: 'La visite d\'un terrain se fait sur rendez-vous avec l\'un de nos agents immobiliers. Nous vous accompagnons sur place pour vous présenter le terrain, ses caractéristiques, son environnement et répondre à toutes vos questions. Nous pouvons également organiser des visites virtuelles pour les clients éloignés.',
      category: 'visite',
      order: 5,
    },
  });
  console.log(`   ✅ FAQ created: ${faq5.question.substring(0, 50)}...`);

  const faq6 = await prisma.faq.upsert({
    where: { id: '6' },
    update: {},
    create: {
      question: 'Proposez-vous des services d\'accompagnement pour la construction ?',
      answer: 'Oui, nous proposons des services d\'accompagnement pour la construction via notre partenaire BatiPanorama. Nous pouvons vous mettre en relation avec des architectes, des entrepreneurs et des fournisseurs de matériaux de qualité. Nous assurons également un suivi de chantier pour garantir la bonne exécution des travaux.',
      category: 'services',
      order: 6,
    },
  });
  console.log(`   ✅ FAQ created: ${faq6.question.substring(0, 50)}...`);

  return { faq1, faq2, faq3, faq4, faq5, faq6 };
}
