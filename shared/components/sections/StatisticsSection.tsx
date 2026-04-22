'use client'

import { HomeIcon, BuildingOfficeIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'

export default function StatisticsSection() {
  const statistics = [
    {
      id: 1,
      value: 500,
      label: 'Propriétés',
      icon: HomeIcon,
      suffix: '+',
      accent: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      id: 2,
      value: 10,
      label: "Années d'expérience",
      icon: BuildingOfficeIcon,
      suffix: '+',
      accent: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      id: 3,
      value: 1500,
      label: 'Clients satisfaits',
      icon: UserGroupIcon,
      suffix: '+',
      accent: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      id: 4,
      value: 98,
      label: 'Taux de satisfaction',
      icon: CheckBadgeIcon,
      suffix: '%',
      accent: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {statistics.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.accent}`} />
                </div>
                <div className={`text-4xl font-black tabular-nums ${stat.accent}`}>
                  <CountUp end={stat.value} duration={2.5} separator=" " delay={0.3} />
                  {stat.suffix}
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
