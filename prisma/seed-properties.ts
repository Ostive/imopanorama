import { PropertyType, PropertyStatus, TransactionType, PropertyCondition } from '@prisma/client';
import { prisma } from '../infrastructure/database/prisma';

const propertiesData = [
  // Villas
  {
    title: "Villa Moderne avec Piscine - Ivandry",
    description: "Magnifique villa contemporaine de 350m² avec piscine, jardin paysager et vue panoramique. 5 chambres, 4 salles de bain, cuisine équipée haut de gamme, salon spacieux avec cheminée. Garage pour 2 voitures, système de sécurité complet.",
    propertyType: PropertyType.VILLA,
    transactionType: TransactionType.SALE,
    location: "Ivandry, Antananarivo",
    city: "Antananarivo",
    address: "Lot II K 45 Ivandry",
    zipCode: "101",
    coordinates: { lat: -18.8792, lng: 47.5079 },
    price: 450000,
    pricePerM2: 1285.71,
    totalSize: 350,
    livingSize: 280,
    landSize: 800,
    bedrooms: 5,
    bathrooms: 4,
    rooms: 8,
    floors: 2,
    yearBuilt: 2020,
    condition: PropertyCondition.EXCELLENT,
    features: ["Piscine", "Jardin", "Garage", "Sécurité 24/7", "Vue panoramique"],
    amenities: ["Piscine chauffée", "Jardin paysager", "Garage 2 voitures", "Portail automatique", "Système d'alarme", "Cuisine équipée", "Cheminée", "Terrasse"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    isPublished: true,
    views: 245,
    reference: "VIL-IVA-2024-001",
    energyClass: "B",
    emissions: "C",
  },
  
  // Appartements
  {
    title: "Appartement F4 Standing - Ankorondrano",
    description: "Superbe appartement de 120m² au 5ème étage avec ascenseur. 3 chambres, 2 salles de bain, grand salon lumineux avec balcon. Immeuble sécurisé avec parking souterrain.",
    propertyType: PropertyType.APARTMENT,
    transactionType: TransactionType.SALE,
    location: "Ankorondrano, Antananarivo",
    city: "Antananarivo",
    address: "Immeuble Le Prestige, Ankorondrano",
    zipCode: "101",
    coordinates: { lat: -18.9067, lng: 47.5267 },
    price: 180000,
    pricePerM2: 1500,
    totalSize: 120,
    livingSize: 120,
    bedrooms: 3,
    bathrooms: 2,
    rooms: 5,
    floor: 5,
    floors: 1,
    yearBuilt: 2019,
    condition: PropertyCondition.EXCELLENT,
    features: ["Ascenseur", "Parking", "Sécurité", "Balcon"],
    amenities: ["Parking souterrain", "Ascenseur", "Interphone", "Balcon", "Cuisine équipée", "Climatisation"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    isPublished: true,
    views: 189,
    reference: "APP-ANK-2024-002",
    energyClass: "C",
    charges: 150,
  },

  // Terrains
  {
    title: "Terrain Résidentiel 1000m² - Ambohimanarina",
    description: "Magnifique terrain plat de 1000m² dans un quartier résidentiel calme. Viabilisé (eau, électricité). Idéal pour construction villa. Titre foncier en règle.",
    propertyType: PropertyType.TERRAIN_RESIDENTIAL,
    transactionType: TransactionType.SALE,
    location: "Ambohimanarina, Antananarivo",
    city: "Antananarivo",
    address: "Lot VK 234 Ambohimanarina",
    zipCode: "101",
    coordinates: { lat: -18.8945, lng: 47.5389 },
    price: 80000,
    pricePerM2: 80,
    totalSize: 1000,
    landSize: 1000,
    features: ["Viabilisé", "Plat", "Titre foncier", "Quartier calme"],
    amenities: ["Eau", "Électricité", "Route goudronnée", "Éclairage public"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: false,
    isPublished: true,
    views: 156,
    reference: "TER-AMB-2024-003",
  },

  // Maisons
  {
    title: "Maison Familiale 4 Chambres - Ambatobe",
    description: "Belle maison familiale de 200m² sur terrain de 500m². 4 chambres, 3 salles de bain, grand salon, cuisine moderne, jardin avec espace barbecue. Garage et parking.",
    propertyType: PropertyType.HOUSE,
    transactionType: TransactionType.SALE,
    location: "Ambatobe, Antananarivo",
    city: "Antananarivo",
    address: "Lot II J 78 Ambatobe",
    zipCode: "102",
    coordinates: { lat: -18.8567, lng: 47.5456 },
    price: 280000,
    pricePerM2: 1400,
    totalSize: 200,
    livingSize: 180,
    landSize: 500,
    bedrooms: 4,
    bathrooms: 3,
    rooms: 7,
    floors: 1,
    yearBuilt: 2018,
    condition: PropertyCondition.GOOD,
    features: ["Jardin", "Garage", "Parking", "Cuisine moderne"],
    amenities: ["Jardin", "Garage", "Parking 2 voitures", "Espace barbecue", "Cuisine équipée", "Buanderie"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: false,
    isPublished: true,
    views: 134,
    reference: "MAI-AMB-2024-004",
    energyClass: "C",
  },

  // Location
  {
    title: "Villa Meublée à Louer - Ivato",
    description: "Superbe villa meublée de 250m² disponible à la location. 4 chambres, 3 salles de bain, salon/salle à manger, cuisine équipée, jardin, piscine. Idéal pour expatriés.",
    propertyType: PropertyType.VILLA,
    transactionType: TransactionType.RENT,
    location: "Ivato, Antananarivo",
    city: "Antananarivo",
    address: "Lot VA 12 Ivato",
    zipCode: "105",
    coordinates: { lat: -18.7967, lng: 47.4789 },
    price: 2500,
    rentPrice: 2500,
    pricePerM2: 10,
    totalSize: 250,
    livingSize: 220,
    landSize: 600,
    bedrooms: 4,
    bathrooms: 3,
    rooms: 7,
    floors: 2,
    yearBuilt: 2021,
    condition: PropertyCondition.EXCELLENT,
    features: ["Meublé", "Piscine", "Jardin", "Sécurité", "Proche aéroport"],
    amenities: ["Piscine", "Jardin", "Garage 2 voitures", "Cuisine équipée", "Meublé complet", "Climatisation", "Wifi", "Gardien"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    isPublished: true,
    views: 298,
    reference: "VIL-IVA-LOC-2024-005",
  },

  // Commercial
  {
    title: "Local Commercial 150m² - Analakely",
    description: "Local commercial de 150m² en plein centre-ville d'Analakely. Vitrine sur rue passante, idéal pour commerce, bureau ou showroom. Parking disponible.",
    propertyType: PropertyType.SHOP,
    transactionType: TransactionType.RENT,
    location: "Analakely, Antananarivo",
    city: "Antananarivo",
    address: "Avenue de l'Indépendance, Analakely",
    zipCode: "101",
    coordinates: { lat: -18.9134, lng: 47.5267 },
    price: 3000,
    rentPrice: 3000,
    pricePerM2: 20,
    totalSize: 150,
    livingSize: 150,
    bathrooms: 2,
    rooms: 3,
    floor: 0,
    yearBuilt: 2015,
    condition: PropertyCondition.GOOD,
    features: ["Centre-ville", "Vitrine", "Parking", "Passage important"],
    amenities: ["Vitrine sur rue", "Parking", "Climatisation", "Toilettes", "Arrière-boutique"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: false,
    isPublished: true,
    views: 167,
    reference: "COM-ANA-2024-006",
    charges: 200,
  },

  // Terrain Commercial
  {
    title: "Terrain Commercial 2000m² - By-Pass",
    description: "Terrain commercial stratégique de 2000m² en bordure du By-Pass. Excellente visibilité, idéal pour centre commercial, showroom automobile ou station-service.",
    propertyType: PropertyType.TERRAIN_COMMERCIAL,
    transactionType: TransactionType.SALE,
    location: "By-Pass, Antananarivo",
    city: "Antananarivo",
    address: "RN2 By-Pass",
    zipCode: "102",
    coordinates: { lat: -18.8789, lng: 47.5567 },
    price: 400000,
    pricePerM2: 200,
    totalSize: 2000,
    landSize: 2000,
    features: ["Bordure route", "Haute visibilité", "Titre foncier", "Viabilisé"],
    amenities: ["Eau", "Électricité", "Égouts", "Accès direct route nationale"],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
    isPublished: true,
    views: 223,
    reference: "TER-BYP-2024-007",
  },

  // Studio
  {
    title: "Studio Meublé - Behoririka",
    description: "Studio meublé de 35m² au 3ème étage. Kitchenette équipée, salle de bain, balcon. Idéal étudiant ou jeune actif. Charges comprises.",
    propertyType: PropertyType.STUDIO,
    transactionType: TransactionType.RENT,
    location: "Behoririka, Antananarivo",
    city: "Antananarivo",
    address: "Immeuble Résidence, Behoririka",
    zipCode: "101",
    coordinates: { lat: -18.9178, lng: 47.5289 },
    price: 400,
    rentPrice: 400,
    pricePerM2: 11.43,
    totalSize: 35,
    livingSize: 35,
    bedrooms: 1,
    bathrooms: 1,
    rooms: 1,
    floor: 3,
    yearBuilt: 2017,
    condition: PropertyCondition.GOOD,
    features: ["Meublé", "Charges comprises", "Balcon"],
    amenities: ["Meublé", "Kitchenette équipée", "Balcon", "Eau chaude", "Wifi"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    status: PropertyStatus.AVAILABLE,
    isFeatured: false,
    isPublished: true,
    views: 89,
    reference: "STU-BEH-2024-008",
    charges: 50,
  },
];

async function main() {
  console.log('🌱 Starting property seeding...');

  for (const propertyData of propertiesData) {
    const property = await prisma.property.create({
      data: propertyData,
    });
    console.log(`✅ Created property: ${property.title} (${property.id})`);
  }

  console.log('🎉 Property seeding completed!');
  console.log(`📊 Total properties created: ${propertiesData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding properties:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
