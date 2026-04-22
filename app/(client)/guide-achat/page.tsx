import { Metadata } from 'next'
import SeoLandingPage from '@/shared/components/sections/SeoLandingPage'

export const metadata: Metadata = {
  title: 'Guide achat immobilier à Madagascar',
  description: 'Les étapes pour acheter un terrain, une maison ou un appartement à Madagascar avec plus de sérénité.',
}

export default function BuyingGuidePage() {
  return (
    <SeoLandingPage
      eyebrow="Guide achat"
      title="Acheter un bien à Madagascar sans avancer à l’aveugle"
      description="Avant de signer, il faut comprendre le bien, les documents, le quartier, le budget et les étapes. Voici les points essentiels à garder en tête."
      image="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1600&auto=format&fit=crop"
      primaryHref="/proprietes?transactionType=SALE"
      primaryLabel="Voir les biens à vendre"
      secondaryHref="/contact"
      secondaryLabel="Poser une question"
      points={[
        'Définir votre budget réel avant les visites',
        'Vérifier les documents et la situation du bien',
        'Comparer le quartier, l’accès et le potentiel',
        'Se faire accompagner avant de s’engager',
      ]}
      sections={[
        { title: 'Clarifier le besoin', text: 'Terrain, villa, appartement ou local commercial: le bon choix dépend autant de votre usage que du prix affiché.' },
        { title: 'Vérifier le dossier', text: 'Un bien intéressant doit être regardé avec attention: documents, localisation, accès, occupation et contraintes éventuelles.' },
        { title: 'Préparer le budget', text: 'Le prix du bien n’est qu’une partie du projet. Il faut aussi anticiper les frais et travaux possibles.' },
        { title: 'Avancer avec méthode', text: 'Une décision immobilière se prend mieux avec des informations claires et un interlocuteur fiable.' },
      ]}
    />
  )
}
