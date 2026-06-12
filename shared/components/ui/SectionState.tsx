'use client'

import { m } from 'framer-motion'
import { WifiIcon, ArrowPathIcon, InboxIcon } from '@heroicons/react/24/outline'

interface SectionStateProps {
  variant: 'error' | 'empty'
  title: string
  description: string
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
  className?: string
}

export default function SectionState({
  variant,
  title,
  description,
  icon,
  action,
  className = '',
}: SectionStateProps) {
  const defaultIcon =
    variant === 'error' ? (
      <WifiIcon className="w-7 h-7 text-primary-500" />
    ) : (
      <InboxIcon className="w-7 h-7 text-primary-500" />
    )

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex justify-center py-10 ${className}`}
    >
      <div className="bg-primary-50/60 dark:bg-primary-900/20 rounded-2xl px-10 py-10 max-w-md w-full text-center space-y-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 mx-auto">
          {icon ?? defaultIcon}
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            {action.label}
          </button>
        )}
      </div>
    </m.div>
  )
}
