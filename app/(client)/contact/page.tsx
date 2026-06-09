import type { Metadata } from 'next'
import ContactPage from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contactez-nous',
  description: 'Prenez contact avec ImoPanorama Madagascar pour toute question sur la vente, la location ou l\'estimation d\'un bien immobilier.',
}

export { ContactPage as default }
