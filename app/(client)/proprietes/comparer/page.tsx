import type { Metadata } from 'next'
import ComparerPage from './ComparerPageClient'

export const metadata: Metadata = {
  title: 'Comparer des propriétés',
  description: 'Comparez plusieurs propriétés côte à côte pour trouver le bien immobilier qui correspond le mieux à vos critères à Madagascar.',
}

export { ComparerPage as default }
