import {
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
  PROPERTY_CONDITION_LABELS,
  PropertyType,
  TransactionType,
  PropertyCondition,
} from '@/features/properties/types/properties.types'

/**
 * Subset of Property fields used to produce the embedding text.
 * Price intentionally omitted — it changes often and doesn't carry semantic meaning.
 */
export interface EmbeddingTextSource {
  title: string
  description?: string | null
  propertyType: PropertyType
  transactionType: TransactionType
  city: string
  location: string
  address?: string | null
  totalSize: number
  livingSize?: number | null
  landSize?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  rooms?: number | null
  floor?: number | null
  yearBuilt?: number | null
  condition?: PropertyCondition | null
  amenities?: string[] | null
  features?: string[] | null
}

/**
 * Builds a compact, semantically rich text representation of a property
 * for embedding. Same input → same text → same vector (deterministic).
 */
export function buildEmbeddingText(p: EmbeddingTextSource): string {
  const parts: string[] = []

  parts.push(p.title)
  if (p.description) parts.push(p.description)

  parts.push(
    `${PROPERTY_TYPE_LABELS[p.propertyType]} en ${TRANSACTION_TYPE_LABELS[p.transactionType].toLowerCase()}`
  )

  const loc = [p.location, p.city, p.address].filter(Boolean).join(', ')
  if (loc) parts.push(`Localisation: ${loc}`)

  const sizes: string[] = [`${p.totalSize} m² au total`]
  if (p.livingSize) sizes.push(`${p.livingSize} m² habitables`)
  if (p.landSize) sizes.push(`terrain ${p.landSize} m²`)
  parts.push(sizes.join(', '))

  const rooms: string[] = []
  if (p.bedrooms) rooms.push(`${p.bedrooms} chambre${p.bedrooms > 1 ? 's' : ''}`)
  if (p.bathrooms) rooms.push(`${p.bathrooms} salle${p.bathrooms > 1 ? 's' : ''} de bain`)
  if (p.rooms) rooms.push(`${p.rooms} pièce${p.rooms > 1 ? 's' : ''} au total`)
  if (p.floor !== null && p.floor !== undefined) rooms.push(`étage ${p.floor}`)
  if (rooms.length) parts.push(rooms.join(', '))

  if (p.yearBuilt) parts.push(`Construit en ${p.yearBuilt}`)
  if (p.condition) parts.push(`État: ${PROPERTY_CONDITION_LABELS[p.condition]}`)

  if (p.amenities && p.amenities.length > 0) {
    parts.push(`Équipements: ${p.amenities.join(', ')}`)
  }
  if (p.features && p.features.length > 0) {
    parts.push(`Caractéristiques: ${p.features.join(', ')}`)
  }

  return parts.join('. ')
}
