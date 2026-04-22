import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Appartements à louer à Madagascar',
  description: 'Trouvez un appartement ou studio à louer à Madagascar avec ImoPanorama.',
}

export default function ApartmentsForRentPage() {
  return (
    <SeoLandingPage
      eyebrow="Appartements à louer"
      title="Appartements et studios à louer à Madagascar"
      description="Trouvez un logement adapté à votre quotidien: emplacement, budget, pièces, accès et services autour du quartier."
      image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=RENT&propertyType=APARTMENT,STUDIO,PENTHOUSE,DUPLEX,LOFT"
      primaryLabel="Voir les appartements"
      secondaryHref="/guide-location"
      secondaryLabel="Lire le guide location"
      points={[
        'Appartements, studios, duplex et lofts',
        'Recherche par ville, budget et surface',
        'Biens en grille, liste ou carte',
        'Contact rapide pour vérifier la disponibilité',
      ]}
      sections={[
        { title: 'Budget', text: 'Le loyer doit être évalué avec les charges, l’accès et les frais d’installation.' },
        { title: 'Quartier', text: 'La localisation influence fortement le confort quotidien et les déplacements.' },
        { title: 'Équipements', text: 'Parking, sécurité, balcon, ascenseur ou générateur peuvent faire une vraie différence.' },
        { title: 'Disponibilité', text: 'Un échange rapide permet de confirmer si le bien est toujours disponible.' },
      ]}
    />
  )
}
