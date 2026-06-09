import type { Metadata } from 'next'
import PropertiesPage from './PropertiesPageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Propriétés à vendre et à louer à Madagascar',
  description: 'Parcourez toutes nos propriétés disponibles à Madagascar : terrains, villas, appartements et locaux commerciaux. Filtrez par ville, type et budget.',
}

export { PropertiesPage as default }
