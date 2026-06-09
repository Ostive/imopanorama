import type { Metadata } from 'next'
import EstimationPage from './EstimationPageClient'

export const metadata: Metadata = {
  title: 'Estimation immobilière',
  description: 'Obtenez une estimation gratuite de votre bien immobilier à Madagascar. Nos experts analysent votre propriété et vous recontactent rapidement.',
}

export { EstimationPage as default }
