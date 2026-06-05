import { Metadata } from 'next'
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'

export const metadata: Metadata = {
  title: 'Témoignages clients',
  description: 'Découvrez les retours de clients accompagnés par ImoPanorama à Madagascar.',
}

const testimonials = [
  {
    name: 'Hery R.',
    role: 'Achat terrain',
    text: "L'équipe nous a aidés à clarifier les points importants avant de visiter. On a gagné du temps et évité de se disperser.",
  },
  {
    name: 'Miora A.',
    role: 'Recherche location',
    text: "Les échanges étaient simples et rapides. On a pu comparer plusieurs biens sans pression.",
  },
  {
    name: 'David N.',
    role: 'Projet construction',
    text: "Le lien entre terrain et construction avec BatiPanorama nous a permis de mieux visualiser le projet complet.",
  },
  {
    name: 'Sarah L.',
    role: 'Vente maison',
    text: "La présentation du bien était plus claire et les demandes mieux suivies. C'est exactement ce qu'on attendait.",
  },
]

export default function TestimonialsPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            Témoignages
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-foreground md:text-6xl">
            Des clients accompagnés avec sérieux et simplicité
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Chaque projet est différent. Notre rôle est de rendre les étapes plus claires, que ce soit pour acheter, louer, vendre ou construire.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-gray-800">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-5 w-5" />
                ))}
              </div>
              <p className="mt-5 text-lg leading-relaxed text-foreground">“{testimonial.text}”</p>
              <div className="mt-6 border-t border-gray-100 pt-4 dark:border-border">
                <p className="font-black text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gray-950 p-8 text-white">
          <h2 className="text-3xl font-black">Vous avez un projet immobilier ?</h2>
          <p className="mt-3 max-w-2xl text-gray-300">
            Expliquez-nous votre besoin, même s’il n’est pas encore totalement clair. On vous aide à poser les bonnes questions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700">
              Contacter l’équipe
            </Link>
            <Link href="/proprietes" className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">
              Voir les biens
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
