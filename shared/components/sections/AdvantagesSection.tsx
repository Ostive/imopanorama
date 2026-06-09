'use client'

import { m } from 'framer-motion'
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const features = [
  {
    title: 'Un vrai choix, sans tourner en rond',
    description: 'Découvrez des terrains, appartements, maisons et villas sélectionnés pour des projets concrets à Madagascar.',
    icon: GlobeAltIcon,
    accent: 'text-primary-500',
  },
  {
    title: 'Des démarches plus rassurantes',
    description: "On vous accompagne avec transparence, des premières questions jusqu'aux vérifications importantes.",
    icon: ShieldCheckIcon,
    accent: 'text-secondary-500',
  },
  {
    title: 'Des opportunités qui ont du sens',
    description: "Profitez de notre lecture du marché pour repérer les biens adaptés à vos objectifs et à votre budget.",
    icon: CurrencyDollarIcon,
    accent: 'text-accent-500',
  },
  {
    title: 'Administratif simplifié',
    description: 'Titres fonciers, bornages, permis ou régularisations : on vous aide à garder le fil sans stress inutile.',
    icon: ClipboardDocumentCheckIcon,
    accent: 'text-purple-500',
  },
  {
    title: 'Une équipe réactive',
    description: "Vous avancez avec des réponses claires, des suivis réguliers et une équipe disponible quand ça compte.",
    icon: ClockIcon,
    accent: 'text-green-500',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-20 items-start">

          {/* Left — sticky editorial header */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary-500" />
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
                Pourquoi nous choisir
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1.05] mb-8 wrap-break-word">
              Un accompagnement{' '}
              <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                simple
              </span>{' '}
              et humain, au même endroit.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm">
              Acheter, louer ou construire à Madagascar soulève beaucoup de questions. Notre rôle est de vous aider à y voir clair, sans jargon.
            </p>
          </m.div>

          {/* Right — editorial numbered list */}
          <div>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <m.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group flex gap-5 py-8 border-b border-border/50 last:border-0 hover:translate-x-1 transition-transform duration-300"
                >
                  {/* Decorative number */}
                  <span className="shrink-0 text-4xl sm:text-5xl font-black text-foreground/15 dark:text-white/12 group-hover:text-primary-300/40 dark:group-hover:text-primary-700/40 transition-colors tabular-nums leading-none pt-1 w-10 sm:w-14 text-right select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 shrink-0 ${feature.accent}`} />
                      <h3 className="font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </m.div>
              )
            })}
          </div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link
            href="/proprietes"
            className="group inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:gap-3 transition-all"
          >
            Voir les biens disponibles
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </m.div>
      </div>
    </section>
  )
}
