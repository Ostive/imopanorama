import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Maisons et villas à vendre à Madagascar',
  description: 'Découvrez des maisons et villas à vendre à Madagascar avec ImoPanorama.',
}

export default function HousesForSalePage() {
  return (
    <SeoLandingPage
      eyebrow="Maisons à vendre"
      title="Maisons et villas à vendre à Madagascar"
      description="Trouvez une maison familiale, une villa ou un bien avec terrain selon votre ville, votre budget et votre rythme de vie."
      image="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=SALE&propertyType=VILLA,HOUSE,TOWNHOUSE,COUNTRY_HOUSE"
      primaryLabel="Voir les maisons"
      secondaryHref="/contact"
      secondaryLabel="Décrire ma recherche"
      points={[
        'Maisons familiales et villas',
        'Recherche par ville, surface et budget',
        'Informations détaillées sur chaque bien',
        'Contact direct pour organiser une visite',
      ]}
      sections={[
        { title: 'Emplacement', text: 'Le quartier, l’accès et les services autour du bien sont essentiels pour une maison agréable au quotidien.' },
        { title: 'Surface', text: 'Surface habitable, terrain, pièces et annexes doivent être regardés ensemble.' },
        { title: 'État du bien', text: 'Neuf, bon état ou à rénover: chaque situation change le budget final.' },
        { title: 'Visite', text: 'Une visite bien préparée permet de vérifier les détails importants avant d’avancer.' },
      ]}
    />
  )
}
