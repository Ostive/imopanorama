import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Services immobiliers à Madagascar',
  description: 'Achat, vente, location, estimation, accompagnement administratif et construction avec ImoPanorama.',
}

export default function ServicesPage() {
  return (
    <SeoLandingPage
      eyebrow="Services ImoPanorama"
      title="Un accompagnement complet pour votre projet immobilier"
      description="Acheter, vendre, louer ou construire demande des réponses claires. ImoPanorama vous accompagne avec une approche simple, humaine et structurée."
      image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/contact"
      primaryLabel="Parler de mon projet"
      secondaryHref="/proprietes"
      secondaryLabel="Voir les biens"
      points={[
        'Recherche de biens à acheter ou louer',
        'Accompagnement vendeur et estimation',
        'Construction avec BatiPanorama',
        'Conseils pour les démarches importantes',
      ]}
      sections={[
        { title: 'Achat', text: 'Nous vous aidons à trouver un bien cohérent avec votre budget, votre localisation et votre projet de vie ou d’investissement.' },
        { title: 'Vente', text: 'Nous cadrons les informations utiles, la présentation et le suivi des contacts pour mieux valoriser votre bien.' },
        { title: 'Location', text: 'Nous facilitons la recherche de maisons, appartements ou locaux adaptés à vos besoins.' },
        { title: 'Construction', text: 'Avec BatiPanorama, vous pouvez passer du terrain au projet construit avec un accompagnement dédié.' },
      ]}
    />
  )
}
