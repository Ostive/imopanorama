import type { Metadata } from 'next'
import UnauthorizedPage from './UnauthorizedPageClient'

export const metadata: Metadata = {
  title: 'Accès non autorisé',
  description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
}

export { UnauthorizedPage as default }
