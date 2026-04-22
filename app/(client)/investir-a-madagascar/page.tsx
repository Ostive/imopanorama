import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Investir dans l’immobilier à Madagascar',
  description: 'Comprendre les opportunités immobilières à Madagascar: terrains, maisons, locations et construction.',
}

export default function InvestMadagascarPage() {
  return (
    <SeoLandingPage
      eyebrow="Investissement immobilier"
      title="Investir à Madagascar avec une lecture claire du marché"
      description="Terrain, location, construction ou revente: chaque projet a ses avantages, ses risques et ses points à vérifier."
      image="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=SALE"
      primaryLabel="Voir les opportunités"
      secondaryHref="/contact"
      secondaryLabel="Discuter investissement"
      points={[
        'Identifier le bon emplacement avant le bon prix',
        'Comparer rendement, potentiel et liquidité',
        'Anticiper documents, travaux et délais',
        'Se faire accompagner localement',
      ]}
      sections={[
        { title: 'Terrains', text: 'Les terrains peuvent offrir un potentiel intéressant, surtout lorsque l’accès, la zone et le projet futur sont bien étudiés.' },
        { title: 'Location', text: 'Un bien destiné à la location doit être pensé selon la demande réelle du quartier et le niveau de gestion nécessaire.' },
        { title: 'Construction', text: 'Construire peut permettre de maîtriser le produit final, à condition d’avoir un suivi sérieux.' },
        { title: 'Sécurité', text: 'Un investissement immobilier se prépare avec des vérifications administratives et une analyse de terrain.' },
      ]}
    />
  )
}
