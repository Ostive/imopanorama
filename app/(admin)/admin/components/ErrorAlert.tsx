'use client'

import { m } from 'framer-motion'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ErrorAlertProps {
  title: string
  message: string
  onClose: () => void
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({ title, message, onClose, onRetry, className }: ErrorAlertProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-linear-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg ${className ?? ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-800">{title}</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            {onRetry && (
              <button type="button"
                onClick={onRetry}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
        <button type="button"
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Fermer"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </m.div>
  )
}
