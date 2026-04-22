import { PrismaClient } from '@prisma/client';

export async function seedNews(prisma: PrismaClient, users: any) {
  console.log('\n📰 Seeding news articles...');

  const { admin, superAdmin, agent } = users;

  // Article 1 - Nouveau projet immobilier
  const news1 = await prisma.news.upsert({
    where: { slug: 'nouveau-projet-immobilier-antananarivo' },
    update: {},
    create: {
      title: 'Nouveau projet immobilier à Antananarivo',
      slug: 'nouveau-projet-immobilier-antananarivo',
      content: `<div class="article-content">
  <h1 class="text-3xl font-bold mb-6">Nouveau projet immobilier à Antananarivo</h1>

  <p class="mb-6 text-lg">Nous sommes ravis de vous annoncer le lancement de notre nouveau projet immobilier dans le quartier d'Ankadimbahoaka à Antananarivo.</p>

  <h2 class="text-2xl font-semibold mb-4 text-primary-600">Un emplacement stratégique</h2>

  <p class="mb-6">Situé à seulement 15 minutes du centre-ville, ce nouveau lotissement offre un cadre de vie exceptionnel avec vue sur les collines environnantes.</p>

  <h2 class="text-2xl font-semibold mb-4 text-primary-600">Des terrains pour tous les projets</h2>

  <p class="mb-4">Notre projet propose des terrains de différentes superficies :</p>
  <ul class="list-disc pl-6 mb-6">
    <li class="mb-2">Lots résidentiels de 300 à 500 m²</li>
    <li class="mb-2">Lots commerciaux de 500 à 1000 m²</li>
  </ul>

  <h2 class="text-2xl font-semibold mb-4 text-primary-600">Infrastructures et commodités</h2>

  <p class="mb-4">Tous les terrains sont viabilisés avec accès à l'eau et à l'électricité. Le projet inclut également :</p>
  <ul class="list-disc pl-6 mb-6">
    <li class="mb-2">Des espaces verts</li>
    <li class="mb-2">Une aire de jeux pour enfants</li>
    <li class="mb-2">Un centre commercial à proximité</li>
  </ul>

  <div class="bg-primary-50 border-l-4 border-primary-500 p-4 my-6">
    <p class="font-semibold">Contactez-nous dès maintenant pour réserver votre terrain !</p>
  </div>
</div>`,
      excerpt: 'Découvrez notre nouveau projet immobilier dans le quartier d\'Ankadimbahoaka à Antananarivo.',
      coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80',
      images: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80',
        'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ],
      category: 'IMMOBILIER',
      tags: ['projet', 'antananarivo', 'terrain', 'investissement'],
      isPublished: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });
  console.log(`   ✅ Article created: ${news1.title}`);

  // Article 2 - Inauguration bureau
  const news2 = await prisma.news.upsert({
    where: { slug: 'inauguration-nouveau-bureau' },
    update: {},
    create: {
      title: 'Inauguration de notre nouveau bureau',
      slug: 'inauguration-nouveau-bureau',
      content: `<div class="article-content">
  <h1 class="text-3xl font-bold mb-6 text-primary-800">Inauguration de notre nouveau bureau à Toamasina</h1>
  
  <div class="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
    <p class="text-lg">C'est avec une grande fierté que nous vous annonçons l'ouverture de notre nouveau bureau à Toamasina, la capitale économique de Madagascar.</p>
  </div>

  <h2 class="text-2xl font-semibold mb-4 text-primary-700">Un espace moderne et accueillant</h2>
  <p class="mb-6">Notre nouveau bureau a été conçu pour offrir un espace de travail optimal à notre équipe et un accueil chaleureux à nos clients.</p>

  <div class="bg-primary-600 text-white p-6 rounded-lg text-center">
    <h2 class="text-2xl font-bold mb-2">Nous vous attendons !</h2>
    <p>Venez découvrir nos nouveaux locaux et rencontrer notre équipe.</p>
  </div>
</div>`,
      excerpt: 'Nous sommes heureux de vous annoncer l\'inauguration de notre nouveau bureau à Toamasina.',
      coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
      images: [
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ],
      category: 'ENTREPRISE',
      tags: ['bureau', 'toamasina', 'expansion', 'équipe'],
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      authorId: superAdmin.id,
    },
  });
  console.log(`   ✅ Article created: ${news2.title}`);

  // Article 3 - Salon immobilier
  const news3 = await prisma.news.upsert({
    where: { slug: 'salon-immobilier-2025' },
    update: {},
    create: {
      title: 'Salon de l\'immobilier 2025',
      slug: 'salon-immobilier-2025',
      content: `<div class="article-content">
  <h1 class="text-3xl font-bold mb-6 text-primary-800">Salon de l'immobilier 2025 à Madagascar</h1>
  
  <div class="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg mb-8 border-l-4 border-primary-500">
    <p class="text-lg">ImoPanorama sera présent au Salon de l'Immobilier 2025 qui se tiendra du 15 au 18 octobre 2025 au Centre de Conférences International d'Ivato.</p>
  </div>

  <h2 class="text-2xl font-semibold mb-4 text-primary-700">Un événement incontournable</h2>
  <p class="mb-4">Le Salon de l'Immobilier est le rendez-vous annuel des professionnels et des particuliers intéressés par le secteur immobilier à Madagascar.</p>

  <div class="bg-primary-600 text-white p-6 rounded-lg text-center">
    <h2 class="text-2xl font-bold mb-2">Nous espérons vous y voir nombreux !</h2>
    <p>Venez échanger avec notre équipe et découvrir nos offres exclusives.</p>
  </div>
</div>`,
      excerpt: 'Retrouvez-nous au salon de l\'immobilier de Madagascar du 15 au 18 octobre 2025.',
      coverImage: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      images: [
        'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ],
      category: 'EVENEMENT',
      tags: ['salon', 'immobilier', 'événement', '2025'],
      isPublished: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      authorId: admin.id,
    },
  });
  console.log(`   ✅ Article created: ${news3.title}`);

  // Article 4 - Construction durable
  const news4 = await prisma.news.upsert({
    where: { slug: 'nouvelles-techniques-construction-durable' },
    update: {},
    create: {
      title: 'Nouvelles techniques de construction durable',
      slug: 'nouvelles-techniques-construction-durable',
      content: `<div class="article-content">
  <h1 class="text-3xl font-bold mb-6 text-primary-800">Nouvelles techniques de construction durable à Madagascar</h1>
  
  <div class="intro bg-gray-50 p-6 rounded-lg mb-8">
    <p class="text-lg">Découvrez les dernières innovations en matière de construction durable adaptées au contexte malgache.</p>
  </div>

  <h2 class="text-2xl font-semibold mb-4 text-primary-700">Matériaux locaux revisités</h2>
  <p class="mb-4">Les techniques traditionnelles malgaches sont aujourd'hui revisitées avec une approche moderne pour créer des bâtiments durables et résistants.</p>

  <div class="bg-primary-50 border-l-4 border-primary-500 p-4 my-6">
    <p class="font-semibold">Contactez-nous pour organiser une visite ou en savoir plus sur ces techniques innovantes !</p>
  </div>
</div>`,
      excerpt: 'Découvrez les innovations en matière de construction durable adaptées au climat tropical de Madagascar.',
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80',
      images: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1489&q=80',
        'https://images.unsplash.com/photo-1518005068251-37900150dfca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80'
      ],
      category: 'CONSTRUCTION',
      tags: ['construction', 'durable', 'écologie', 'innovation'],
      isPublished: true,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      authorId: agent.id,
    },
  });
  console.log(`   ✅ Article created: ${news4.title}`);

  // Article 5 - Guide investissement (draft)
  const news5 = await prisma.news.upsert({
    where: { slug: 'guide-investissement-immobilier-madagascar' },
    update: {},
    create: {
      title: 'Guide d\'investissement immobilier à Madagascar',
      slug: 'guide-investissement-immobilier-madagascar',
      content: `<div class="article-content">
  <h1 class="text-3xl font-bold mb-6">Guide complet d'investissement immobilier à Madagascar</h1>

  <p class="mb-6">L'immobilier reste l'un des investissements les plus sûrs et rentables à Madagascar. Dans ce guide, nous vous présentons les informations essentielles pour réussir votre projet d'investissement.</p>

  <h2 class="text-2xl font-semibold mb-4">Les zones à fort potentiel</h2>
  <p class="mb-4">Plusieurs régions se démarquent par leur potentiel de croissance à Madagascar.</p>

  <h2 class="text-2xl font-semibold mb-4">Contactez nos experts</h2>
  <p>Notre équipe de conseillers en investissement immobilier est à votre disposition pour vous accompagner dans votre projet.</p>
</div>`,
      excerpt: 'Tout ce que vous devez savoir pour investir dans l\'immobilier à Madagascar : zones prometteuses, rendements, aspects juridiques et fiscaux.',
      coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      images: [
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        'https://images.unsplash.com/photo-1542856391-010fb87dcfed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      ],
      category: 'IMMOBILIER',
      tags: ['investissement', 'guide', 'rendement', 'fiscalité'],
      isPublished: false, // Draft
      publishedAt: null,
      authorId: superAdmin.id,
    },
  });
  console.log(`   ✅ Article created (draft): ${news5.title}`);

  return { news1, news2, news3, news4, news5 };
}
