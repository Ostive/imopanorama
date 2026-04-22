import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Terrains à vendre à Madagascar',
  description: 'Découvrez des terrains résidentiels, commerciaux ou agricoles à vendre à Madagascar.',
}

export default function LandForSalePage() {
  return (
    <SeoLandingPage
      eyebrow="Terrains à vendre"
      title="Trouvez un terrain pour construire ou investir"
      description="Un terrain se choisit avec attention: accès, surface, quartier, documents et potentiel de construction doivent être étudiés ensemble."
      image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=SALE&propertyType=TERRAIN_RESIDENTIAL,TERRAIN_COMMERCIAL,TERRAIN_AGRICULTURAL,TERRAIN_INDUSTRIAL"
      primaryLabel="Voir les terrains"
      secondaryHref="/batipanorama"
      secondaryLabel="Construire ensuite"
      points={[
        'Terrains résidentiels, commerciaux ou agricoles',
        'Recherche par ville, budget et surface',
        'Possibilité de relier terrain et construction',
        'Accompagnement pour poser les bonnes questions',
      ]}
      sections={[
        { title: 'Projet de maison', text: 'Le choix du terrain influence directement le budget, le style de construction et les délais.' },
        { title: 'Investissement', text: 'Un terrain bien placé peut être une base solide pour un projet futur.' },
        { title: 'Accès', text: 'Routes, eau, électricité et environnement sont à analyser avant de décider.' },
        { title: 'Documents', text: 'Il est essentiel de vérifier la situation administrative avant toute avancée sérieuse.' },
      ]}
    />
  )
}
