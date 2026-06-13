export type MadagascarCitySeo = {
  slug: string;
  city: string;
  region: string;
  headline: string;
  description: string;
  image: string;
  districts: string[];
  opportunities: string[];
  checklist: string[];
  searchHref: string;
};

export const MADAGASCAR_CITY_SEO: MadagascarCitySeo[] = [
  {
    slug: 'antananarivo',
    city: 'Antananarivo',
    region: 'Analamanga',
    headline: 'Immobilier a Antananarivo',
    description: 'Maisons, appartements, terrains et locaux commerciaux dans les quartiers les plus recherches de la capitale malgache.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
    districts: ['Ivandry', 'Ambatobe', 'Ankorondrano', 'Analakely', 'Ambohimanarina', 'Ivato'],
    opportunities: [
      'Forte demande locative pour les familles, expatriés et entreprises',
      'Quartiers résidentiels recherchés au nord et a l’est de la capitale',
      'Terrains et maisons a verifier avec attention cote acces et documents',
    ],
    checklist: ['Titre foncier ou situation cadastrale', 'Acces routier en saison des pluies', 'Eau, electricite et assainissement', 'Servitudes et voisinage'],
    searchHref: '/proprietes?country=MG&city=Antananarivo',
  },
  {
    slug: 'tamatave',
    city: 'Toamasina',
    region: 'Atsinanana',
    headline: 'Immobilier a Tamatave / Toamasina',
    description: 'Biens residentiels, terrains et opportunites commerciales dans la principale ville portuaire de Madagascar.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    districts: ['Centre-ville', 'Tanambao', 'Salazamay', 'Mangabe', 'Ambalamanasy'],
    opportunities: [
      'Marché porte par le port, la logistique et les activites commerciales',
      'Potentiel locatif autour des axes d’activite et zones administratives',
      'Vigilance sur zones inondables, acces et entretien du bati',
    ],
    checklist: ['Situation fonciere claire', 'Risque d’inondation', 'Acces poids lourds si usage commercial', 'Etat de la toiture et humidite'],
    searchHref: '/proprietes?country=MG&city=Toamasina',
  },
  {
    slug: 'majunga',
    city: 'Mahajanga',
    region: 'Boeny',
    headline: 'Immobilier a Majunga / Mahajanga',
    description: 'Maisons, terrains et biens proches du littoral pour habiter, investir ou developper un projet touristique.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    districts: ['Amborovy', 'Mangarivotra', 'Mahabibo', 'Tsaramandroso', 'Centre-ville'],
    opportunities: [
      'Attractivite touristique et demande saisonniere',
      'Terrains residentiels et projets proches des axes vers Amborovy',
      'Attention particuliere aux limites, au bornage et aux acces',
    ],
    checklist: ['Bornage visible', 'Distance reelle a la mer', 'Acces eau et electricite', 'Documents du proprietaire'],
    searchHref: '/proprietes?country=MG&city=Mahajanga',
  },
  {
    slug: 'fianarantsoa',
    city: 'Fianarantsoa',
    region: 'Haute Matsiatra',
    headline: 'Immobilier a Fianarantsoa',
    description: 'Terrains, maisons familiales et biens commerciaux dans une ville universitaire et administrative du centre de Madagascar.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop',
    districts: ['Ville Haute', 'Tsianolondroa', 'Anjoma', 'Talatamaty', 'Ambatomena'],
    opportunities: [
      'Demande stable liee aux etudiants, familles et services publics',
      'Maisons de ville et terrains sur relief a etudier techniquement',
      'Bon potentiel pour location longue duree bien positionnee',
    ],
    checklist: ['Stabilite du terrain', 'Acces en pente', 'Proximite ecoles et services', 'Regles de voisinage'],
    searchHref: '/proprietes?country=MG&city=Fianarantsoa',
  },
  {
    slug: 'nosy-be',
    city: 'Nosy Be',
    region: 'Diana',
    headline: 'Immobilier a Nosy Be',
    description: 'Villas, terrains et projets touristiques dans l’une des destinations les plus recherchees de Madagascar.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
    districts: ['Hell-Ville', 'Ambatoloaka', 'Dzamandzar', 'Andilana', 'Madirokely'],
    opportunities: [
      'Forte attractivite touristique et location saisonniere',
      'Villas et terrains a fort potentiel si les documents sont solides',
      'Verification indispensable des servitudes, acces plage et autorisations',
    ],
    checklist: ['Droit d’usage et propriete', 'Acces route et plage', 'Autorisation projet touristique', 'Gestion eau et assainissement'],
    searchHref: '/proprietes?country=MG&city=Nosy%20Be',
  },
  {
    slug: 'sainte-marie',
    city: 'Sainte-Marie',
    region: 'Analanjirofo',
    headline: 'Immobilier a Sainte-Marie / Nosy Boraha',
    description: 'Villas, terrains et projets touristiques sur une ile preservee de la cote est de Madagascar, connue pour ses plages, son lagon et la saison des baleines.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
    districts: ['Ambodifotatra', 'Ile aux Nattes', 'Ravoraha', 'Vohilava', 'Coco Bay', 'Ilot Madame'],
    opportunities: [
      'Destination touristique reconnue pour les baleines, les plages et le patrimoine pirate',
      'Potentiel pour villas, ecolodges, maisons d hotes et location saisonniere',
      'Marche insulaire ou l acces, l eau, l electricite et les autorisations doivent etre verifies',
    ],
    checklist: ['Statut foncier et limites du terrain', 'Acces route, bateau ou piste', 'Gestion eau et assainissement', 'Contraintes littorales et environnementales'],
    searchHref: '/proprietes?country=MG&city=Sainte-Marie',
  },
  {
    slug: 'diego-suarez',
    city: 'Antsiranana',
    region: 'Diana',
    headline: 'Immobilier a Diego-Suarez / Antsiranana',
    description: 'Biens residentiels, terrains et opportunites proches des zones touristiques et portuaires du nord de Madagascar.',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop',
    districts: ['Centre-ville', 'Ramena', 'Scama', 'Tanambao', 'Joffreville'],
    opportunities: [
      'Potentiel touristique autour de Ramena et de la baie',
      'Demande residentielle et commerciale dans la ville portuaire',
      'Documents, acces et exposition aux vents a controler avec soin',
    ],
    checklist: ['Titre ou bail clair', 'Acces permanent', 'Exposition et entretien', 'Potentiel locatif reel'],
    searchHref: '/proprietes?country=MG&city=Antsiranana',
  },
];

export function getMadagascarCitySeo(slug: string) {
  return MADAGASCAR_CITY_SEO.find((city) => city.slug === slug);
}
