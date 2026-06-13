import 'dotenv/config';
import { NewsCategory, PrismaClient } from '@prisma/client';
import { prisma } from '../infrastructure/database/prisma';

type BlogSeedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images?: string[];
  category: NewsCategory;
  tags: string[];
  publishedDaysAgo: number;
};

const image = {
  buy: '/images/news/news-1.jpg',
  sell: '/images/news/news-2.jpg',
  build: '/images/news/news-3.jpg',
  cityAntananarivo: '/images/seo/cities/antananarivo.jpg',
  cityNosyBe: '/images/seo/cities/nosy-be.jpg',
  cityTamatave: '/images/seo/cities/tamatave.jpg',
  property: '/images/properties/featured/property-1.jpg',
  project: '/images/batipanorama/projects/project-1.jpg',
};

const cta = (href: string, label: string) => `
  <p class="my-8">
    <a href="${href}" class="inline-flex rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">${label}</a>
  </p>`;

const article = (
  intro: string,
  sections: Array<{ title: string; body: string }>,
  href: string,
  label: string,
) => `<article class="space-y-6">
  <p class="text-lg leading-8">${intro}</p>
  ${sections
    .map(
      (section) => `
  <h2>${section.title}</h2>
  <p>${section.body}</p>`,
    )
    .join('\n')}
  ${cta(href, label)}
</article>`;

const articles: BlogSeedArticle[] = [
  {
    title: 'Acheter une maison a Antananarivo: le parcours simple en 7 etapes',
    slug: 'acheter-maison-antananarivo-parcours-7-etapes',
    excerpt: 'Un guide pratique pour transformer une recherche immobiliere a Antananarivo en parcours clair, depuis le budget jusqu a la visite.',
    coverImage: image.cityAntananarivo,
    category: NewsCategory.IMMOBILIER,
    tags: ['achat', 'antananarivo', 'maison', 'guide'],
    publishedDaysAgo: 1,
    content: article(
      'Acheter a Antananarivo demande de comparer les quartiers, de verifier les documents et de garder un budget realiste pour les frais annexes.',
      [
        { title: '1. Fixer le budget complet', body: 'Le prix du bien ne suffit pas. Il faut integrer les frais de verification, les travaux eventuels, le demenagement et une marge de negociation.' },
        { title: '2. Choisir les quartiers selon le rythme de vie', body: 'Ivandry, Ambatobe, Ankorondrano ou Alasora ne repondent pas aux memes besoins. Le bon choix depend des trajets, des ecoles, du calme recherche et du type de bien.' },
        { title: '3. Verifier avant de s engager', body: 'Un achat sain commence par la lecture des pieces foncieres, la coherence entre surface annoncee et surface reelle, puis une visite avec questions precises.' },
      ],
      '/proprietes?transactionType=SALE&city=Antananarivo',
      'Voir les biens a vendre a Antananarivo',
    ),
  },
  {
    title: 'Vendre un terrain a Madagascar: preparer un dossier qui rassure',
    slug: 'vendre-terrain-madagascar-dossier-rassurant',
    excerpt: 'Les points a reunir pour donner confiance aux acheteurs et accelerer la vente d un terrain.',
    coverImage: image.sell,
    category: NewsCategory.IMMOBILIER,
    tags: ['vente', 'terrain', 'documents', 'proprietaire'],
    publishedDaysAgo: 3,
    content: article(
      'Un terrain bien presente attire plus de contacts qualifies. Les acheteurs veulent comprendre le statut juridique, l acces et le potentiel de construction.',
      [
        { title: 'Clarifier le statut foncier', body: 'Titre, cadastre, bail long terme ou dossier en cours: la transparence evite les pertes de temps et les negociations fragiles.' },
        { title: 'Montrer l acces et les reperes', body: 'Des photos propres, un point GPS, les distances aux axes principaux et les services proches rendent l annonce beaucoup plus concrete.' },
        { title: 'Positionner le prix', body: 'Le prix doit etre compare a la zone, a la surface utilisable et au niveau de securite documentaire. Un prix lisible cree plus de visites.' },
      ],
      '/vendre',
      'Preparer la vente de mon bien',
    ),
  },
  {
    title: 'Location a Antananarivo: comment trouver un appartement sans perdre de temps',
    slug: 'location-antananarivo-trouver-appartement',
    excerpt: 'Une methode directe pour filtrer les annonces de location et obtenir des visites vraiment utiles.',
    coverImage: image.property,
    category: NewsCategory.IMMOBILIER,
    tags: ['location', 'appartement', 'antananarivo', 'visite'],
    publishedDaysAgo: 5,
    content: article(
      'La location avance vite dans les quartiers demandes. Le secret consiste a preparer ses criteres avant de contacter les annonces.',
      [
        { title: 'Prioriser trois criteres', body: 'Budget mensuel, quartier et type de bien doivent passer avant les details secondaires. Cela evite de multiplier les visites inutiles.' },
        { title: 'Lire les charges', body: 'Parking, gardiennage, eau, groupe electrogene ou internet peuvent changer le cout reel d un logement.' },
        { title: 'Agir vite mais proprement', body: 'Quand un bien est coherent, demandez les conditions, programmez la visite et confirmez par ecrit les points importants.' },
      ],
      '/proprietes?transactionType=RENT&city=Antananarivo',
      'Voir les locations disponibles',
    ),
  },
  {
    title: 'Investir dans l immobilier a Madagascar: ou chercher du rendement',
    slug: 'investir-immobilier-madagascar-rendement',
    excerpt: 'Zones, typologies et reflexes pour reperer les biens qui peuvent generer de la valeur.',
    coverImage: image.cityNosyBe,
    category: NewsCategory.IMMOBILIER,
    tags: ['investissement', 'rendement', 'nosy be', 'antananarivo'],
    publishedDaysAgo: 7,
    content: article(
      'Un bon investissement immobilier ne depend pas seulement du prix d achat. Il depend surtout de la demande locale, de la liquidite et du niveau de risque documentaire.',
      [
        { title: 'Comparer usage et localisation', body: 'Antananarivo peut convenir a la location longue duree, Nosy Be au saisonnier, Toamasina a des profils lies a l activite economique.' },
        { title: 'Regarder la sortie avant l entree', body: 'Un bien revendable, facile a visiter et simple a expliquer aura plus de valeur qu une opportunite trop complexe.' },
        { title: 'Chiffrer les travaux', body: 'Le rendement apparent peut disparaitre si les travaux, les delais ou les charges ne sont pas anticipes.' },
      ],
      '/investir-a-madagascar',
      'Explorer les opportunites d investissement',
    ),
  },
  {
    title: 'Construire a Madagascar: les decisions qui evitent les surcouts',
    slug: 'construire-madagascar-eviter-surcouts',
    excerpt: 'Avant de lancer un chantier, ces choix structurent le budget, le planning et la qualite finale.',
    coverImage: image.build,
    category: NewsCategory.CONSTRUCTION,
    tags: ['construction', 'budget', 'chantier', 'batipanorama'],
    publishedDaysAgo: 9,
    content: article(
      'La construction est plus fluide quand les decisions importantes sont prises avant le premier achat de materiaux.',
      [
        { title: 'Stabiliser le programme', body: 'Nombre de pieces, surface, niveau de finition et contraintes du terrain doivent etre definis avant de demander un devis.' },
        { title: 'Garder une marge', body: 'Transport, meteo, disponibilite des materiaux et reprises techniques justifient une marge budgetaire prudente.' },
        { title: 'Suivre par jalons', body: 'Fondations, gros oeuvre, toiture et finitions doivent etre valides et documentes pour limiter les surprises.' },
      ],
      '/batipanorama/contact',
      'Demander un devis construction',
    ),
  },
  {
    title: 'Estimer son bien avant de vendre: les criteres qui comptent vraiment',
    slug: 'estimer-bien-avant-vendre-criteres',
    excerpt: 'Prix du marche, etat, emplacement, documents: les variables qui influencent une estimation fiable.',
    coverImage: image.sell,
    category: NewsCategory.IMMOBILIER,
    tags: ['estimation', 'vente', 'prix', 'marche'],
    publishedDaysAgo: 11,
    content: article(
      'Une estimation credible aide a vendre plus vite, sans bloquer la discussion avec un prix trop eloigne du marche.',
      [
        { title: 'Partir du comparable', body: 'Les annonces similaires donnent une base, mais il faut corriger selon l etat, la rue, la surface utile et les documents disponibles.' },
        { title: 'Integrer les freins', body: 'Acces difficile, travaux lourds, charges floues ou statut foncier incomplet reduisent naturellement le prix acceptable.' },
        { title: 'Definir une strategie', body: 'Un prix d appel, une marge de negociation et un calendrier de baisse eventuelle rendent la vente plus pilotee.' },
      ],
      '/estimation',
      'Lancer une estimation',
    ),
  },
  {
    title: 'Toamasina: pourquoi la demande immobiliere reste active',
    slug: 'toamasina-demande-immobiliere-active',
    excerpt: 'Port, commerce, mobilite: les moteurs qui rendent Toamasina interessante pour habiter ou investir.',
    coverImage: image.cityTamatave,
    category: NewsCategory.IMMOBILIER,
    tags: ['toamasina', 'tamatave', 'investissement', 'ville'],
    publishedDaysAgo: 13,
    content: article(
      'Toamasina combine activite economique, mobilite portuaire et besoins residentiels. Cette dynamique soutient la recherche de maisons, terrains et locaux.',
      [
        { title: 'Une ville de flux', body: 'Les activites commerciales creent des besoins de logement, de bureaux, de stockage et de terrains bien places.' },
        { title: 'Des profils varies', body: 'Familles, entrepreneurs et investisseurs ne cherchent pas les memes surfaces, ce qui ouvre plusieurs strategies.' },
        { title: 'La verification reste essentielle', body: 'Comme ailleurs, la qualite du dossier et l emplacement exact comptent autant que le prix affiche.' },
      ],
      '/immobilier/tamatave',
      'Decouvrir l immobilier a Toamasina',
    ),
  },
  {
    title: 'Guide rapide pour acheter un terrain constructible',
    slug: 'acheter-terrain-constructible-guide-rapide',
    excerpt: 'Les questions a poser avant de signer pour un terrain destine a la construction.',
    coverImage: image.project,
    category: NewsCategory.CONSTRUCTION,
    tags: ['terrain', 'construction', 'achat', 'verification'],
    publishedDaysAgo: 15,
    content: article(
      'Un terrain constructible doit etre juge sur plus que sa surface. L acces, la pente, les reseaux et le statut juridique changent tout.',
      [
        { title: 'Verifier l usage possible', body: 'Demandez si la zone accepte le type de projet envisage: maison, villa, commerce ou projet mixte.' },
        { title: 'Observer le sol et l eau', body: 'La pente, le drainage et les remblais possibles influencent fortement les fondations et le cout final.' },
        { title: 'Anticiper le chantier', body: 'Un terrain difficile d acces peut compliquer la livraison des materiaux et augmenter le budget.' },
      ],
      '/proprietes?propertyType=TERRAIN_RESIDENTIAL',
      'Voir les terrains disponibles',
    ),
  },
];

async function findAuthor(client: PrismaClient) {
  const author = await client.user.findFirst({
    where: { role: { in: ['SUPER_ADMIN', 'ADMIN', 'AGENT'] }, isActive: true },
    orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
  });

  if (!author) {
    throw new Error('Aucun auteur actif trouve. Lancez d abord le seed users ou creez un admin.');
  }

  return author;
}

async function seedBlogProd(client: PrismaClient) {
  console.log('Seeding production blog articles...');

  const author = await findAuthor(client);
  const now = Date.now();

  for (const item of articles) {
    const publishedAt = new Date(now - item.publishedDaysAgo * 24 * 60 * 60 * 1000);

    const saved = await client.news.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        images: item.images ?? [item.coverImage],
        category: item.category,
        tags: item.tags,
        isPublished: true,
        publishedAt,
        authorId: author.id,
      },
      create: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        images: item.images ?? [item.coverImage],
        category: item.category,
        tags: item.tags,
        isPublished: true,
        publishedAt,
        authorId: author.id,
      },
    });

    console.log(`- ${saved.slug}`);
  }

  console.log(`Seed blog prod termine: ${articles.length} articles publies.`);
}

seedBlogProd(prisma)
  .catch((error) => {
    console.error('Seed blog prod failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
