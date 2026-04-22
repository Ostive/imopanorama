import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Guide location immobilière à Madagascar',
  description: 'Conseils pour louer une maison, un appartement ou un local à Madagascar avec les bons critères.',
}

export default function RentingGuidePage() {
  return (
    <SeoLandingPage
      eyebrow="Guide location"
      title="Louer un bien adapté à votre quotidien"
      description="Une bonne location ne se résume pas au loyer. Emplacement, accès, sécurité, charges et état du bien comptent tout autant."
      image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=RENT"
      primaryLabel="Voir les biens à louer"
      secondaryHref="/contact"
      secondaryLabel="Être accompagné"
      points={[
        'Comparer le loyer avec les charges et frais annexes',
        'Vérifier l’état du bien avant engagement',
        'Évaluer l’accès, le quartier et les services autour',
        'Poser les bonnes questions avant de signer',
      ]}
      sections={[
        { title: 'Budget mensuel', text: 'Le bon budget inclut le loyer, les charges, l’entretien, les déplacements et les éventuels frais d’installation.' },
        { title: 'Visite du bien', text: 'Pendant la visite, regardez la luminosité, l’eau, l’électricité, l’accès, les nuisances et l’état général.' },
        { title: 'Quartier', text: 'Un logement peut être beau mais mal placé pour votre quotidien. L’environnement compte autant que le bien.' },
        { title: 'Accompagnement', text: 'Nous vous aidons à identifier les biens cohérents avant de multiplier les visites inutiles.' },
      ]}
    />
  )
}
