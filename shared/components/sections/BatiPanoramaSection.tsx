'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export default function BatiPanoramaSection() {
  const services = [
    {
      icon: BuildingOffice2Icon,
      title: 'Construction clé en main',
      description: 'On coordonne chaque étape, de la première idée jusqu’à la remise des clés.',
    },
    {
      icon: HomeModernIcon,
      title: 'Maisons sur mesure',
      description: 'Imaginez une maison pensée pour votre mode de vie, votre terrain et le climat local.',
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Bâtiments professionnels',
      description: "Des solutions solides pour donner de l'espace à votre activité.",
    },
    {
      icon: BoltIcon,
      title: 'Solutions solaires',
      description: 'Des options durables pour rendre votre projet plus autonome et plus responsable.',
    },
  ]

  return (
    <section
      id="batipanorama"
      className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden"
    >
      {/* Decorative background blob */}
      <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-100 dark:bg-primary-900/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
            <span className="font-black">BP</span> · Notre partenaire construction
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — image with overlay stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
                alt="Construction BatiPanorama"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
              <div className="flex-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-2xl font-black text-gray-900 dark:text-white">15 ans</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">sur le terrain</div>
              </div>
              <div className="flex-1 bg-primary-600 rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-2xl font-black text-white">100+</div>
                <div className="text-xs text-primary-200 mt-0.5">projets livrés</div>
              </div>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              Construire votre projet avec un{' '}
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500 bg-clip-text text-transparent">
                vrai suivi
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10">
              ImoPanorama et BatiPanorama vous accompagnent du choix du terrain à la construction, avec des échanges clairs et un suivi régulier.
            </p>

            {/* Service list */}
            <ul className="grid sm:grid-cols-2 gap-3 mb-10">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.07 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{service.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/batipanorama"
                className="group inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/30"
              >
                Découvrir l’accompagnement
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-7 py-3.5 font-semibold text-primary-700 dark:text-primary-400 border-2 border-primary-200 dark:border-primary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                Parler de mon projet
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
