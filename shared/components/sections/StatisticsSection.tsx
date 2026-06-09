'use client'

import CountUp from 'react-countup'
import { m } from 'framer-motion'

const statistics = [
  { id: 1, value: 500,  suffix: '+', label: 'Propriétés' },
  { id: 2, value: 10,   suffix: '+', label: "Années d'expérience" },
  { id: 3, value: 1500, suffix: '+', label: 'Clients satisfaits' },
  { id: 4, value: 98,   suffix: '%', label: 'Taux de satisfaction' },
]

export default function StatisticsSection() {
  return (
    <section className="bg-primary-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgb(14_165_233/0.18)_0%,transparent_65%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
          {statistics.map((stat, index) => (
            <m.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center py-10 px-3 sm:py-14 sm:px-6 gap-2"
            >
              <div className="text-4xl sm:text-5xl md:text-7xl font-black text-white tabular-nums leading-none whitespace-nowrap">
                <CountUp end={stat.value} duration={2.5} separator=" " delay={0.3} />
                <span className="text-primary-400">{stat.suffix}</span>
              </div>
              <p className="text-primary-300/60 text-xs font-semibold tracking-widest uppercase mt-1">
                {stat.label}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
