import { ProjectDetail } from '@/features/batipanorama/types/projects.types';

export const mockProjects: ProjectDetail[] = [
  {
    id: 1,
    title: 'Villa Moderne Antananarivo',
    slug: 'villa-moderne-antananarivo',
    description: 'Cette villa contemporaine de 180 m² allie confort moderne et adaptation au climat tropical. Construite sur un terrain de 800 m², elle comprend 4 chambres, un salon spacieux, une cuisine américaine et une piscine à débordement avec vue panoramique sur la ville.',
    location: 'Antananarivo, Madagascar',
    client: 'Famille Rakoto',
    year: 2023,
    surface: '180 m²',
    category: 'residential',
    status: 'completed',
    tags: ['villa', 'moderne', 'piscine', 'vue panoramique'],
    coverImage: '/images/batipanorama/projects/project-1.jpg',
    images: [
      {
        id: 1,
        src: '/images/batipanorama/projects/project-1.jpg',
        alt: 'Vue extérieure de la villa moderne',
        title: 'Façade principale',
        description: 'Façade avant avec entrée principale et jardin paysager',
        featured: true
      },
      {
        id: 2,
        src: '/images/batipanorama/projects/project-2.jpg',
        alt: 'Salon spacieux avec grandes baies vitrées',
        title: 'Espace de vie',
        description: 'Salon ouvert avec vue sur la piscine et la terrasse'
      },
      {
        id: 3,
        src: '/images/batipanorama/projects/project-3.jpg',
        alt: 'Cuisine américaine équipée',
        title: 'Cuisine moderne',
        description: 'Cuisine ouverte avec îlot central et équipements haut de gamme'
      },
      {
        id: 4,
        src: '/images/batipanorama/projects/project-4.jpg',
        alt: 'Chambre principale avec dressing',
        title: 'Suite parentale',
        description: 'Chambre principale avec salle de bain privative et dressing'
      },
      {
        id: 5,
        src: '/images/batipanorama/projects/project-5.jpg',
        alt: 'Piscine à débordement avec terrasse',
        title: 'Espace extérieur',
        description: 'Piscine à débordement avec vue sur la ville et espace détente'
      }
    ],
    features: [
      'Construction antisismique',
      'Panneaux solaires',
      'Récupération d\'eau de pluie',
      'Domotique intégrée',
      'Matériaux locaux de qualité'
    ],
    testimonial: {
      quote: 'BatiPanorama a transformé notre rêve en réalité. La qualité de construction et l\'attention aux détails sont exceptionnelles.',
      author: 'Jean Rakoto',
      position: 'Propriétaire'
    },
    architecte: 'Studio Archipel',
    budget: '150 000 €'
  },
  {
    id: 2,
    title: 'Centre Commercial Toamasina',
    slug: 'centre-commercial-toamasina',
    description: 'Ce centre commercial de 1200 m² offre un espace moderne pour 15 boutiques sur deux niveaux. Le projet comprend un parking souterrain de 50 places, un food court et des espaces verts. La façade vitrée et les matériaux durables en font un bâtiment emblématique de la ville.',
    location: 'Toamasina, Madagascar',
    client: 'Groupe Retail Mada',
    year: 2024,
    surface: '1200 m²',
    category: 'commercial',
    status: 'completed',
    tags: ['centre commercial', 'boutiques', 'parking', 'food court'],
    coverImage: '/images/batipanorama/projects/project-3.jpg',
    images: [
      {
        id: 1,
        src: '/images/batipanorama/projects/project-3.jpg',
        alt: 'Façade principale du centre commercial',
        title: 'Entrée principale',
        description: 'Façade vitrée avec entrée principale et enseigne',
        featured: true
      },
      {
        id: 2,
        src: '/images/batipanorama/projects/project-1.jpg',
        alt: 'Galerie marchande intérieure',
        title: 'Galerie marchande',
        description: 'Espace de circulation avec boutiques de part et d\'autre'
      },
      {
        id: 3,
        src: '/images/batipanorama/projects/project-4.jpg',
        alt: 'Food court avec restaurants',
        title: 'Espace restauration',
        description: 'Zone de restauration avec différentes enseignes et places assises'
      },
      {
        id: 4,
        src: '/images/batipanorama/projects/project-2.jpg',
        alt: 'Parking souterrain',
        title: 'Parking',
        description: 'Parking souterrain avec 50 places et accès direct au centre'
      },
      {
        id: 5,
        src: '/images/batipanorama/projects/project-5.jpg',
        alt: 'Vue aérienne du centre commercial',
        title: 'Vue d\'ensemble',
        description: 'Vue aérienne montrant l\'intégration du bâtiment dans son environnement'
      }
    ],
    features: [
      'Structure en acier et béton',
      'Façade vitrée à haute performance énergétique',
      'Système de climatisation centralisé',
      'Escalators et ascenseurs panoramiques',
      'Toiture végétalisée'
    ],
    testimonial: {
      quote: 'Un projet livré dans les délais avec une qualité exceptionnelle. Notre centre attire désormais des enseignes internationales.',
      author: 'Sophie Ratsiraka',
      position: 'Directrice Groupe Retail Mada'
    },
    architecte: 'Cabinet Urbania',
    budget: '1 200 000 €'
  },
  {
    id: 3,
    title: 'Résidence Éco-responsable',
    slug: 'residence-eco-responsable',
    description: 'Cette résidence de 150 m² est un modèle d\'habitat durable adapté au climat tropical. Construite avec des matériaux locaux et recyclés, elle intègre des solutions énergétiques autonomes. La maison produit sa propre électricité et récupère l\'eau de pluie pour un impact environnemental minimal.',
    location: 'Nosy Be, Madagascar',
    client: 'M. et Mme Rabemananjara',
    year: 2023,
    surface: '150 m²',
    category: 'residential',
    status: 'completed',
    tags: ['éco-responsable', 'énergie solaire', 'matériaux recyclés', 'autonomie'],
    coverImage: '/images/batipanorama/projects/project-2.jpg',
    images: [
      {
        id: 1,
        src: '/images/batipanorama/projects/project-2.jpg',
        alt: 'Vue extérieure de la résidence éco-responsable',
        title: 'Vue d\'ensemble',
        description: 'Maison intégrée dans son environnement naturel',
        featured: true
      },
      {
        id: 2,
        src: '/images/batipanorama/projects/project-5.jpg',
        alt: 'Panneaux solaires sur le toit',
        title: 'Installation solaire',
        description: 'Système de panneaux solaires couvrant les besoins énergétiques'
      },
      {
        id: 3,
        src: '/images/batipanorama/projects/project-1.jpg',
        alt: 'Intérieur avec matériaux naturels',
        title: 'Salon écologique',
        description: 'Espace de vie avec matériaux naturels et ventilation passive'
      },
      {
        id: 4,
        src: '/images/batipanorama/projects/project-4.jpg',
        alt: 'Système de récupération d\'eau',
        title: 'Gestion de l\'eau',
        description: 'Système de récupération et filtration d\'eau de pluie'
      },
      {
        id: 5,
        src: '/images/batipanorama/projects/project-3.jpg',
        alt: 'Jardin potager intégré',
        title: 'Potager',
        description: 'Jardin potager permaculture intégré à la résidence'
      }
    ],
    features: [
      'Autonomie énergétique complète',
      'Matériaux locaux et recyclés',
      'Système de ventilation naturelle',
      'Récupération et filtration d\'eau de pluie',
      'Potager en permaculture'
    ],
    testimonial: {
      quote: 'Nous vivons en harmonie avec la nature tout en profitant du confort moderne. Notre empreinte carbone est minimale et nos factures aussi!',
      author: 'Hery Rabemananjara',
      position: 'Propriétaire'
    },
    architecte: 'EcoDesign Madagascar',
    budget: '120 000 €'
  },
  {
    id: 4,
    title: 'Complexe Hôtelier Baobab',
    slug: 'complexe-hotelier-baobab',
    description: 'Ce complexe hôtelier 4 étoiles comprend 30 bungalows, un restaurant, une piscine et un spa. Situé en bord de mer, il s\'intègre parfaitement dans le paysage avec une architecture inspirée des traditions locales tout en offrant un confort moderne.',
    location: 'Majunga, Madagascar',
    client: 'Groupe Hôtelier Océan Indien',
    year: 2022,
    surface: '5000 m²',
    category: 'commercial',
    status: 'completed',
    tags: ['hôtel', 'bungalows', 'spa', 'restaurant', 'plage'],
    coverImage: '/images/batipanorama/projects/project-4.jpg',
    images: [
      {
        id: 1,
        src: '/images/batipanorama/projects/project-4.jpg',
        alt: 'Vue aérienne du complexe hôtelier',
        title: 'Vue d\'ensemble',
        description: 'Vue aérienne montrant les bungalows et la piscine centrale',
        featured: true
      },
      {
        id: 2,
        src: '/images/batipanorama/projects/project-1.jpg',
        alt: 'Bungalow de luxe',
        title: 'Hébergement',
        description: 'Intérieur d\'un bungalow de luxe avec vue sur mer'
      },
      {
        id: 3,
        src: '/images/batipanorama/projects/project-3.jpg',
        alt: 'Restaurant avec vue panoramique',
        title: 'Restaurant',
        description: 'Espace de restauration avec terrasse et vue sur l\'océan'
      },
      {
        id: 4,
        src: '/images/batipanorama/projects/project-5.jpg',
        alt: 'Piscine à débordement',
        title: 'Piscine',
        description: 'Piscine à débordement avec bar aquatique et transats'
      },
      {
        id: 5,
        src: '/images/batipanorama/projects/project-2.jpg',
        alt: 'Spa et espace bien-être',
        title: 'Spa',
        description: 'Espace bien-être avec salles de massage et jacuzzi'
      }
    ],
    features: [
      'Architecture bioclimatique',
      'Matériaux locaux nobles',
      'Traitement d\'eau écologique pour la piscine',
      'Jardins tropicaux avec espèces endémiques',
      'Accès direct à la plage privée'
    ],
    testimonial: {
      quote: 'BatiPanorama a su créer un lieu qui respecte l\'environnement tout en offrant le luxe que nos clients recherchent.',
      author: 'Marc Randriamahefa',
      position: 'Directeur Général du Groupe Hôtelier Océan Indien'
    },
    architecte: 'Atelier Tropical Design',
    budget: '3 500 000 €'
  },
  {
    id: 5,
    title: 'Rénovation Bâtiment Colonial',
    slug: 'renovation-batiment-colonial',
    description: 'Ce projet de rénovation a transformé un bâtiment colonial historique en bureaux modernes tout en préservant son caractère patrimonial. Les 800 m² ont été entièrement repensés pour offrir des espaces de travail fonctionnels tout en mettant en valeur les éléments architecturaux d\'origine.',
    location: 'Antananarivo, Madagascar',
    client: 'Cabinet d\'avocats Razafindrakoto',
    year: 2023,
    surface: '800 m²',
    category: 'renovation',
    status: 'completed',
    tags: ['rénovation', 'patrimoine', 'bureaux', 'colonial'],
    coverImage: '/images/batipanorama/projects/project-5.jpg',
    images: [
      {
        id: 1,
        src: '/images/batipanorama/projects/project-5.jpg',
        alt: 'Façade rénovée du bâtiment colonial',
        title: 'Façade restaurée',
        description: 'Façade d\'origine restaurée avec ses détails architecturaux',
        featured: true
      },
      {
        id: 2,
        src: '/images/batipanorama/projects/project-2.jpg',
        alt: 'Hall d\'entrée avec escalier d\'origine',
        title: 'Hall d\'entrée',
        description: 'Hall d\'entrée avec escalier en bois restauré et sol en marbre'
      },
      {
        id: 3,
        src: '/images/batipanorama/projects/project-3.jpg',
        alt: 'Espace de bureaux moderne',
        title: 'Espace de travail',
        description: 'Bureaux modernes intégrés dans l\'architecture d\'origine'
      },
      {
        id: 4,
        src: '/images/batipanorama/projects/project-1.jpg',
        alt: 'Salle de réunion avec moulures d\'origine',
        title: 'Salle de conférence',
        description: 'Grande salle de réunion avec plafonds à moulures restaurés'
      },
      {
        id: 5,
        src: '/images/batipanorama/projects/project-4.jpg',
        alt: 'Cour intérieure aménagée',
        title: 'Patio',
        description: 'Cour intérieure transformée en espace de détente végétalisé'
      }
    ],
    features: [
      'Restauration des éléments architecturaux d\'origine',
      'Mise aux normes électriques et informatiques',
      'Installation d\'un ascenseur discret',
      'Isolation thermique et acoustique',
      'Climatisation centralisée'
    ],
    testimonial: {
      quote: 'BatiPanorama a su préserver l\'âme de ce bâtiment historique tout en créant des espaces de travail fonctionnels et élégants.',
      author: 'Maître Razafindrakoto',
      position: 'Fondateur du cabinet'
    },
    architecte: 'Heritage Architects',
    budget: '950 000 €'
  }
];

export const getProjectBySlug = (slug: string): ProjectDetail | undefined => {
  return mockProjects.find(project => project.slug === slug);
};

export const getAllProjectSlugs = (): string[] => {
  return mockProjects.map(project => project.slug);
};

export const getProjectsByCategory = (category: string = 'all'): ProjectDetail[] => {
  if (category === 'all') {
    return mockProjects;
  }
  return mockProjects.filter(project => project.category === category);
};
