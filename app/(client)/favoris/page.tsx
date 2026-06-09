import type { Metadata } from 'next'
import FavorisPage from './FavorisPageClient'

export const metadata: Metadata = {
  title: 'Mes favoris',
  description: 'Retrouvez toutes vos propriétés favorites sauvegardées sur ImoPanorama Madagascar.',
}

export { FavorisPage as default }
