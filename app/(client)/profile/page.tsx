import type { Metadata } from 'next'
import ProfilePage from './ProfilePageClient'

export const metadata: Metadata = {
  title: 'Mon profil',
  description: 'Gérez votre profil et vos préférences sur ImoPanorama Madagascar.',
}

export { ProfilePage as default }
