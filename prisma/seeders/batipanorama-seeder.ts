/**
 * BatiPanorama Seeder - Seeds projects, services, and process steps
 */

import { PrismaClient, ProjectStatus } from '@prisma/client';

export async function seedBatiPanorama(prisma: PrismaClient) {
  console.log('\n🏗️  Seeding BatiPanorama data...');

  // Clear existing data
  await prisma.batiProcess.deleteMany({});
  await prisma.batiService.deleteMany({});
  await prisma.batiProject.deleteMany({});

  // Seed Projects
  const projects = await prisma.batiProject.createMany({
    data: [
      {
        title: 'Villa Moderne Antananarivo',
        description: 'Villa contemporaine de luxe avec piscine à débordement et jardin tropical. Architecture moderne alliant confort et élégance, avec des matériaux de haute qualité et des finitions exceptionnelles.',
        location: 'Antananarivo, Madagascar',
        category: 'Résidentiel',
        surface: 250.0,
        duration: '8 mois',
        budget: '180 000 €',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        status: ProjectStatus.COMPLETED,
        isPublished: true,
        order: 1,
        client: 'Famille Rakoto',
        year: 2023,
        tags: ['villa', 'moderne', 'piscine', 'luxe'],
        features: [
          'Construction antisismique',
          'Panneaux solaires',
          'Récupération d\'eau de pluie',
          'Domotique intégrée',
          'Matériaux locaux de qualité'
        ]
      },
      {
        title: 'Centre Commercial Toamasina',
        description: 'Complexe commercial moderne de 15 boutiques avec parking souterrain. Design contemporain optimisant la circulation et l\'expérience client, avec des espaces lumineux et fonctionnels.',
        location: 'Toamasina, Madagascar',
        category: 'Commercial',
        surface: 1200.0,
        duration: '14 mois',
        budget: '850 000 €',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        status: ProjectStatus.COMPLETED,
        isPublished: true,
        order: 2,
        client: 'Groupe Retail Mada',
        year: 2024,
        tags: ['commercial', 'shopping', 'parking', 'moderne'],
        features: [
          'Parking souterrain 50 places',
          'Food court moderne',
          'Façade vitrée',
          'Climatisation centralisée',
          'Espaces verts aménagés'
        ]
      },
      {
        title: 'Résidence Les Jacarandas',
        description: 'Ensemble résidentiel de 12 villas avec espaces verts communs et sécurité 24/7. Conception harmonieuse intégrant nature et modernité pour un cadre de vie exceptionnel.',
        location: 'Antsirabe, Madagascar',
        category: 'Résidentiel',
        surface: 180.0,
        duration: '12 mois',
        budget: '1 200 000 €',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        status: ProjectStatus.IN_PROGRESS,
        isPublished: true,
        order: 3,
        client: 'Promoteur Immobilier Antsirabe',
        year: 2025,
        tags: ['résidentiel', 'ensemble', 'sécurisé', 'villas'],
        features: [
          'Sécurité 24/7',
          'Espaces verts communs',
          'Piscine commune',
          'Aire de jeux pour enfants',
          'Parking privé'
        ]
      },
      {
        title: 'Hôtel Eco-Lodge Nosy Be',
        description: 'Hôtel écologique de 25 bungalows avec vue sur mer. Construction durable utilisant des matériaux locaux et des technologies vertes pour un tourisme responsable.',
        location: 'Nosy Be, Madagascar',
        category: 'Hôtellerie',
        surface: 800.0,
        duration: '18 mois',
        budget: '2 500 000 €',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        status: ProjectStatus.PLANNED,
        isPublished: true,
        order: 4,
        client: 'Nosy Be Resort Group',
        year: 2026,
        tags: ['hôtel', 'écologique', 'bungalows', 'mer'],
        features: [
          'Matériaux écologiques',
          'Panneaux solaires',
          'Bungalows avec vue mer',
          'Restaurant panoramique',
          'Spa et centre de bien-être'
        ]
      },
      {
        title: 'Immeuble de Bureaux Ankorondrano',
        description: 'Immeuble de bureaux moderne de 6 étages avec parking et espaces de coworking. Architecture contemporaine offrant des espaces de travail lumineux et modulables.',
        location: 'Antananarivo, Madagascar',
        category: 'Commercial',
        surface: 2400.0,
        duration: '20 mois',
        budget: '3 200 000 €',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        status: ProjectStatus.IN_PROGRESS,
        isPublished: true,
        order: 5,
        client: 'Business Center Tana',
        year: 2025,
        tags: ['bureaux', 'coworking', 'moderne', 'parking'],
        features: [
          'Espaces de coworking',
          'Salles de réunion équipées',
          'Fibre optique',
          'Parking sécurisé',
          'Restaurant d\'entreprise'
        ]
      },
      {
        title: 'Villa Contemporaine Ivato',
        description: 'Villa d\'architecte avec piscine et home cinema. Design minimaliste et épuré, intégrant domotique et équipements haut de gamme.',
        location: 'Ivato, Madagascar',
        category: 'Résidentiel',
        surface: 320.0,
        duration: '10 mois',
        budget: '280 000 €',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'
        ],
        coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        status: ProjectStatus.COMPLETED,
        isPublished: true,
        order: 6,
        client: 'Famille Andriamana',
        year: 2024,
        tags: ['villa', 'contemporaine', 'domotique', 'cinéma'],
        features: [
          'Home cinema 4K',
          'Domotique complète',
          'Piscine chauffée',
          'Garage 3 voitures',
          'Système de sécurité avancé'
        ]
      }
    ]
  });

  console.log(`   ✅ ${projects.count} projets créés`);

  // Seed Services
  const services = await prisma.batiService.createMany({
    data: [
      {
        title: 'Construction de Piscines',
        description: 'Conception et construction de piscines sur mesure. Nous créons des espaces aquatiques uniques adaptés à votre terrain et à vos envies, avec des finitions de qualité et un système de filtration performant.',
        icon: '🏊',
        features: [
          'Étude de faisabilité et conception',
          'Piscines enterrées ou semi-enterrées',
          'Système de filtration moderne',
          'Éclairage LED subaquatique',
          'Margelles et plages personnalisées',
          'Garantie décennale'
        ],
        isActive: true,
        order: 1
      },
      {
        title: 'Construction de Villas',
        description: 'Construction de villas modernes et luxueuses. Nous réalisons des maisons d\'exception alliant confort, élégance et fonctionnalité, avec des matériaux haut de gamme et des finitions soignées.',
        icon: '🏡',
        features: [
          'Architecture personnalisée',
          'Matériaux de qualité supérieure',
          'Espaces optimisés',
          'Domotique intégrée',
          'Jardin et aménagements extérieurs',
          'Suivi de chantier professionnel'
        ],
        isActive: true,
        order: 2
      },
      {
        title: 'Design & Décoration Intérieure',
        description: 'Design d\'intérieur sur mesure pour sublimer vos espaces de vie. Nos décorateurs créent des ambiances uniques en harmonie avec votre personnalité, en optimisant chaque pièce.',
        icon: '🎨',
        features: [
          'Conception d\'ambiances personnalisées',
          'Choix des couleurs et matériaux',
          'Mobilier et agencement',
          'Éclairage d\'ambiance',
          'Décoration murale et textile',
          'Suivi et coordination des artisans'
        ],
        isActive: true,
        order: 3
      },
      {
        title: 'Plans Architecturaux & Modélisation 3D',
        description: 'Élaboration de plans architecturaux détaillés et visualisations 3D réalistes. Nous donnons vie à votre projet avant même sa construction grâce à des rendus photoréalistes.',
        icon: '📐',
        features: [
          'Plans architecturaux complets',
          'Modélisation 3D photoréaliste',
          'Vues intérieures et extérieures',
          'Visite virtuelle immersive',
          'Plans techniques détaillés',
          'Révisions illimitées'
        ],
        isActive: true,
        order: 4
      }
    ]
  });

  console.log(`   ✅ ${services.count} services créés`);

  // Seed Process Steps
  const processSteps = await prisma.batiProcess.createMany({
    data: [
      {
        step: 1,
        title: 'Consultation initiale',
        description: 'Rencontre pour comprendre vos besoins et définir votre budget',
        icon: '📋',
        isActive: true
      },
      {
        step: 2,
        title: 'Conception & Plans',
        description: 'Élaboration des plans architecturaux et validation du projet',
        icon: '📐',
        isActive: true
      },
      {
        step: 3,
        title: 'Devis détaillé',
        description: 'Présentation d\'un devis complet avec planning de réalisation',
        icon: '📄',
        isActive: true
      },
      {
        step: 4,
        title: 'Construction',
        description: 'Réalisation des travaux avec suivi régulier et reporting',
        icon: '🏗️',
        isActive: true
      },
      {
        step: 5,
        title: 'Livraison',
        description: 'Remise des clés avec garanties et manuel d\'utilisation',
        icon: '🔑',
        isActive: true
      }
    ]
  });

  console.log(`   ✅ ${processSteps.count} étapes de processus créées`);

  console.log('✅ BatiPanorama seeding terminé !');
}
