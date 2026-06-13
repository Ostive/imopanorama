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
  citySainteMarie: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
  property: '/images/properties/featured/property-1.jpg',
  project: '/images/batipanorama/projects/project-1.jpg',
};

const cta = (href: string, label: string) => `
  <p class="my-8">
    <a href="${href}" class="inline-flex rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700">${label}</a>
  </p>`;

const sources = (items: Array<{ label: string; href: string }>) => `
  <aside class="mt-10 rounded-lg border border-border bg-muted/40 p-5">
    <h2>Sources utilisees</h2>
    <ul>
      ${items.map((item) => `<li><a href="${item.href}" rel="nofollow noopener" target="_blank">${item.label}</a></li>`).join('\n      ')}
    </ul>
  </aside>`;

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
    title: 'Sainte-Marie: l eco-tourisme haut de gamme relance l interet pour Nosy Boraha',
    slug: 'sainte-marie-eco-tourisme-haut-de-gamme-nosy-boraha',
    excerpt: 'Une actualite 2025 met en avant l arrivee d une offre eco-luxe a Sainte-Marie, un signal interessant pour l immobilier touristique et la construction responsable.',
    coverImage: image.citySainteMarie,
    category: NewsCategory.IMMOBILIER,
    tags: ['sainte-marie', 'nosy boraha', 'eco-tourisme', 'investissement', 'actualite'],
    publishedDaysAgo: 2,
    content: `${article(
      'Sainte-Marie, aussi appelee Nosy Boraha, attire de nouveau l attention grace a un positionnement eco-touristique: nature preservee, plages, foret, lagon et hebergements plus qualitatifs.',
      [
        { title: 'Ce qui change pour l immobilier local', body: 'Quand une destination gagne en visibilite touristique, les recherches augmentent autour des terrains bien places, des villas, des maisons d hotes et des projets d hebergement responsables.' },
        { title: 'Un signal, pas une promesse de rendement', body: 'Cette dynamique ne suffit pas a garantir un rendement. Avant d acheter, il faut verifier le statut foncier, l acces, l eau, l energie, l assainissement et les contraintes environnementales.' },
        { title: 'Pourquoi c est SEO important', body: 'Les requetes Sainte-Marie immobilier, Nosy Boraha investissement, terrain Sainte-Marie Madagascar et construction ecolodge Madagascar peuvent capter des profils tres qualifies.' },
      ],
      '/immobilier/sainte-marie',
      'Decouvrir l immobilier a Sainte-Marie',
    )}
${sources([
      { label: 'Financial Times - reportage 2025 sur Madagascar et Voaara a Sainte-Marie', href: 'https://www.ft.com/content/2cf9f904-5435-4789-a897-cad95de8fe7e' },
      { label: 'Nosy Boraha / Sainte-Marie - informations geographiques et touristiques', href: 'https://en.wikipedia.org/wiki/Nosy_Boraha' },
    ])}`,
  },
  {
    title: 'Saison des baleines a Sainte-Marie: un moteur pour la location saisonniere',
    slug: 'saison-baleines-sainte-marie-location-saisonniere',
    excerpt: 'Chaque hiver austral, les baleines a bosse renforcent l attractivite touristique de Sainte-Marie et soutiennent les projets de location saisonniere bien prepares.',
    coverImage: image.citySainteMarie,
    category: NewsCategory.IMMOBILIER,
    tags: ['sainte-marie', 'baleines', 'location saisonniere', 'tourisme', 'nosy boraha'],
    publishedDaysAgo: 4,
    content: `${article(
      'Le canal de Sainte-Marie est connu pour l observation des baleines a bosse pendant l hiver austral. Cette saisonnalite peut soutenir la demande en hebergements courts sejours.',
      [
        { title: 'Un actif touristique naturel', body: 'Les visiteurs ne viennent pas seulement pour une plage: ils recherchent une experience, entre baleines, lagon, histoire pirate, plongee et Ile aux Nattes.' },
        { title: 'Ce que cela implique pour un bien', body: 'Une villa ou une maison d hote doit etre pensee pour l exploitation: acces, confort, maintenance, eau, electricite, gestion a distance et qualite des photos.' },
        { title: 'La prudence reste indispensable', body: 'Un projet saisonnier doit etre chiffre avec les periodes creuses, les frais d entretien en milieu marin et les autorisations necessaires.' },
      ],
      '/proprietes?country=MG&city=Sainte-Marie',
      'Voir les opportunites a Sainte-Marie',
    )}
${sources([
      { label: 'Nosy Boraha - whale watching et tourisme', href: 'https://en.wikipedia.org/wiki/Nosy_Boraha' },
      { label: 'Ile Sainte-Marie - destination baleines et patrimoine', href: 'https://fr.wikipedia.org/wiki/%C3%8Ele_Sainte-Marie' },
    ])}`,
  },
  {
    title: 'Ile aux Nattes: pourquoi ce micro-marche interesse les projets touristiques',
    slug: 'ile-aux-nattes-micro-marche-projets-touristiques',
    excerpt: 'L Ile aux Nattes, au sud de Sainte-Marie, attire par son image preservee. Un contexte interessant, mais a analyser avec methode avant tout projet.',
    coverImage: image.citySainteMarie,
    category: NewsCategory.IMMOBILIER,
    tags: ['ile aux nattes', 'sainte-marie', 'terrain', 'tourisme', 'ecolodge'],
    publishedDaysAgo: 6,
    content: `${article(
      'L Ile aux Nattes, aussi appelee Nosy Nato, se situe au sud de Sainte-Marie. Son image de petite ile preservee peut attirer des projets touristiques tres cibles.',
      [
        { title: 'Un positionnement different de la grande ile', body: 'L absence ou la limitation des infrastructures classiques peut devenir un argument de charme, mais aussi une contrainte operationnelle forte pour construire et exploiter.' },
        { title: 'Les points a verifier', body: 'Avant toute decision, il faut regarder l acces, la logistique chantier, les limites foncieres, l approvisionnement, l assainissement et les impacts environnementaux.' },
        { title: 'Le bon format de projet', body: 'Les petites structures bien integrees, les maisons d hotes sobres et les concepts eco-touristiques ont souvent plus de coherence qu un projet trop lourd pour le site.' },
      ],
      '/batipanorama/contact',
      'Etudier un projet de construction touristique',
    )}
${sources([
      { label: 'Ile aux Nattes - situation et caracteristiques', href: 'https://en.wikipedia.org/wiki/%C3%8Ele_aux_Nattes' },
      { label: 'Ile Sainte-Marie - contexte touristique et geographique', href: 'https://fr.wikipedia.org/wiki/%C3%8Ele_Sainte-Marie' },
    ])}`,
  },
  {
    title: 'Construire a Sainte-Marie: les contraintes a anticiper avant un chantier',
    slug: 'construire-sainte-marie-contraintes-chantier',
    excerpt: 'Sur une ile comme Sainte-Marie, le chantier doit anticiper logistique, humidite, air marin, acces, energie et entretien.',
    coverImage: image.build,
    category: NewsCategory.CONSTRUCTION,
    tags: ['sainte-marie', 'construction', 'chantier', 'batipanorama', 'nosy boraha'],
    publishedDaysAgo: 8,
    content: `${article(
      'Construire a Sainte-Marie peut creer un bien tres attractif, mais le contexte insulaire impose une preparation plus stricte qu un chantier urbain classique.',
      [
        { title: 'Logistique et delais', body: 'Materiaux, main d oeuvre, transport maritime et stockage doivent etre organises avant le lancement. Un retard logistique peut vite bloquer plusieurs corps de metier.' },
        { title: 'Choix techniques', body: 'Air marin, humidite, vents, toiture, ventilation, evacuation des eaux et corrosion doivent guider les materiaux et les finitions.' },
        { title: 'Exploitation apres livraison', body: 'Une maison destinee a la location saisonniere doit etre simple a entretenir, securisee et equipee pour limiter les interventions d urgence.' },
      ],
      '/batipanorama/contact',
      'Demander un accompagnement BatiPanorama',
    )}
${sources([
      { label: 'Nosy Boraha - transport, port, aeroport et geographie', href: 'https://en.wikipedia.org/wiki/Nosy_Boraha' },
      { label: 'Financial Times - exemple 2025 de projet eco-touristique a Sainte-Marie', href: 'https://www.ft.com/content/2cf9f904-5435-4789-a897-cad95de8fe7e' },
    ])}`,
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
