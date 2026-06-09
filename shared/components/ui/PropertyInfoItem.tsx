'use client'

import { m } from 'framer-motion'

interface PropertyInfoItemProps {
  /** Icon component or emoji string */
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  /** Tailwind color token: 'primary', 'blue', 'green', 'purple', 'pink', 'amber', 'emerald' */
  color?: string
  delay?: number
  className?: string
}

const COLOR_MAP: Record<string, string> = {
  primary: 'bg-primary-100 dark:bg-primary-900/30',
  blue:    'bg-primary-100 dark:bg-primary-900/30',
  green:   'bg-green-100 dark:bg-green-900/30',
  purple:  'bg-purple-100 dark:bg-purple-900/30',
  pink:    'bg-pink-100 dark:bg-pink-900/30',
  amber:   'bg-amber-100 dark:bg-amber-900/30',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
  slate:   'bg-slate-100 dark:bg-slate-900/30',
  orange:  'bg-orange-100 dark:bg-orange-900/30',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/30',
}

export function PropertyInfoItem({ icon, label, value, color = 'primary', delay = 0, className }: PropertyInfoItemProps) {
  const iconBg = COLOR_MAP[color] ?? COLOR_MAP.primary

  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors${className ? ` ${className}` : ''}`}
    >
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
        {typeof icon === 'string'
          ? <span className="text-xl">{icon}</span>
          : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-muted-foreground mb-0.5">{label}</div>
        <div className="text-lg font-bold text-foreground">{value}</div>
      </div>
    </m.div>
  )
}
