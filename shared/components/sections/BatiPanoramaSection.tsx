'use client'

import Link from 'next/link'
import Image from 'next/image'
import { m } from 'framer-motion'
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  BoltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    icon: BuildingOffice2Icon,
    title: 'Construction clé en main',
    description: "On coordonne chaque étape, de la première idée jusqu'à la remise des clés.",
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

export default function BatiPanoramaSection() {
  return (
    <section id="batipanorama" className="py-10 sm:py-20 md:py-28 bg-background relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Label */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6 sm:mb-14"
        >
          <div className="h-px w-12 bg-primary-500" />
          <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
            Notre partenaire construction
          </span>
          <span className="ml-1 px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-black">
            BP
          </span>
        </m.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 items-center">
          {/* Left — image */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[200px] sm:h-[380px] lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
                alt="Construction BatiPanorama"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
            </div>

            {/* Floating stat chips — masqués sur mobile */}
            <div className="hidden sm:flex absolute bottom-6 left-6 right-6 gap-3">
              <div className="flex-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-2xl font-black text-foreground">15 ans</div>
                <div className="text-xs text-muted-foreground mt-0.5">sur le terrain</div>
              </div>
              <div className="flex-1 bg-primary-600 rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-2xl font-black text-white">100+</div>
                <div className="text-xs text-primary-200 mt-0.5">projets livrés</div>
              </div>
            </div>
          </m.div>

          {/* Right — content */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1.05] mb-3 sm:mb-5 wrap-break-word">
              Construire avec un{' '}
              <span className="bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                vrai suivi
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-4 sm:mb-10">
              ImoPanorama et BatiPanorama vous accompagnent du choix du terrain à la construction, avec des échanges clairs et un suivi régulier.
            </p>

            {/* Service list — 2 items sur mobile, 4 sur desktop */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-8 mb-5 sm:mb-12">
              {services.slice(0, 4).map((service, index) => {
                const Icon = service.icon
                return (
                  <m.li
                    key={service.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.07 }}
                    className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`}
                  >
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-600 flex items-center justify-center mt-0.5">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{service.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed hidden sm:block">
                        {service.description}
                      </p>
                    </div>
                  </m.li>
                )
              })}
            </ul>

            {/* CTAs */}
            <div className="flex flex-row sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/batipanorama"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/30 flex-1 sm:flex-none"
              >
                Découvrir
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 sm:px-7 py-2.5 sm:py-3.5 text-sm font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all flex-1 sm:flex-none"
              >
                Mon projet
              </Link>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
