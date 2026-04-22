import { PropertyType, isTerrainType, isCommercialType } from '@/features/properties/types/properties.types'

/**
 * Returns which filters make sense given the currently selected property types.
 *
 * Rules:
 * - When no type is selected → all filters visible
 * - Terrains → hide bedrooms / bathrooms / rooms / floor / yearBuilt / condition structure
 * - Commercial → hide bedrooms (restaurants/hotels can keep rooms though)
 * - Apartment family (studio, penthouse, duplex, loft, apartment) → show floor
 */
export interface FilterApplicability {
  bedrooms: boolean
  bathrooms: boolean
  rooms: boolean
  floor: boolean
  yearBuilt: boolean
  condition: boolean
  amenities: boolean
}

const APARTMENT_LIKE: PropertyType[] = ['APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT']
const HAS_BEDROOMS: PropertyType[] = [
  'VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE',
  'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT',
  'HOTEL',
]

export function getFilterApplicability(selectedTypes: PropertyType[]): FilterApplicability {
  // No type selected → everything is available
  if (selectedTypes.length === 0) {
    return {
      bedrooms: true,
      bathrooms: true,
      rooms: true,
      floor: true,
      yearBuilt: true,
      condition: true,
      amenities: true,
    }
  }

  const allTerrains = selectedTypes.every(isTerrainType)
  const allCommercial = selectedTypes.every(isCommercialType)
  const anyApartmentLike = selectedTypes.some(t => APARTMENT_LIKE.includes(t))
  const anyHasBedrooms = selectedTypes.some(t => HAS_BEDROOMS.includes(t))

  return {
    // Chambres : uniquement si au moins un type a des chambres
    bedrooms: anyHasBedrooms && !allTerrains,
    // Salles de bain : pas pour les terrains
    bathrooms: !allTerrains,
    // Pièces : pas pour les terrains
    rooms: !allTerrains,
    // Étage : uniquement pour appartement-like
    floor: anyApartmentLike,
    // Année de construction : pas pour les terrains
    yearBuilt: !allTerrains,
    // Condition/État : pas pour les terrains
    condition: !allTerrains,
    // Équipements : pas pertinent pour les terrains nus
    amenities: !allTerrains,
  }
}

/**
 * Équipements courants pour le filtre client.
 * Les `value` correspondent EXACTEMENT aux strings stockées en base
 * (identiques à AMENITIES_LIST dans PropertyForm.tsx).
 */
export const COMMON_AMENITIES: { value: string; label: string }[] = [
  { value: 'Parking', label: 'Parking' },
  { value: 'Garage', label: 'Garage' },
  { value: 'Piscine', label: 'Piscine' },
  { value: 'Jardin', label: 'Jardin' },
  { value: 'Terrasse', label: 'Terrasse' },
  { value: 'Balcon', label: 'Balcon' },
  { value: 'Ascenseur', label: 'Ascenseur' },
  { value: 'Sécurité 24/7', label: 'Sécurité 24/7' },
  { value: 'Résidence sécurisée', label: 'Résidence sécurisée' },
  { value: 'Vidéosurveillance', label: 'Vidéosurveillance' },
  { value: 'Salle de sport', label: 'Salle de sport' },
  { value: 'Spa/Jacuzzi', label: 'Spa/Jacuzzi' },
  { value: 'Groupe électrogène', label: 'Groupe électrogène' },
  { value: 'Rooftop', label: 'Rooftop' },
]
