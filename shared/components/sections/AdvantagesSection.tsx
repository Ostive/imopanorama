'use client'

import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AdvantagesSection() {
  const features = [
    {
      id: 1,
      title: 'Un vrai choix, sans tourner en rond',
      description:
        'Découvrez des terrains, appartements, maisons et villas sélectionnés pour des projets concrets à Madagascar.',
      icon: GlobeAltIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 2,
      title: 'Des démarches plus rassurantes',
      description:
        "On vous accompagne avec transparence, des premières questions jusqu'aux vérifications importantes.",
      icon: ShieldCheckIcon,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 3,
      title: 'Des opportunités qui ont du sens',
      description:
        "Vous profitez de notre lecture du marché pour repérer les biens adaptés à vos objectifs et à votre budget.",
      icon: CurrencyDollarIcon,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      id: 4,
      title: 'Administratif simplifié',
      description:
        'Titres fonciers, bornages, permis ou régularisations : on vous aide à garder le fil sans stress inutile.',
      icon: ClipboardDocumentCheckIcon,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      id: 5,
      title: 'Une équipe réactive',
      description:
        'Vous avancez avec des réponses claires, des suivis réguliers et une équipe disponible quand ça compte.',
      icon: ClockIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — sticky header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-5">
              Pourquoi avancer avec nous
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              Un accompagnement simple, humain et{' '}
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500 bg-clip-text text-transparent">
                efficace
              </span>
              , au même endroit.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
              Acheter, louer ou construire à Madagascar soulève beaucoup de questions. Notre rôle est de vous aider à y voir clair, sans jargon et sans pression.
            </p>
            <Link
              href="/proprietes"
              className="group inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/30"
            >
              Voir les biens disponibles
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — feature list */}
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex items-start gap-5 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:bg-white dark:hover:bg-gray-800/80 transition-all group"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
