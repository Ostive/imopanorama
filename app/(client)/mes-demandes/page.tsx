import type { Metadata } from 'next'
import MesDemandesPage from './MesDemandesPageClient'

export const metadata: Metadata = {
  title: 'Mes demandes',
  description: 'Consultez et gérez toutes vos demandes de contact et visites sur ImoPanorama Madagascar.',
}

export { MesDemandesPage as default }
