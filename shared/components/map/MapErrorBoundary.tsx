'use client'

import React, { Component, type ReactNode } from 'react'
import { WifiIcon, ExclamationTriangleIcon, ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryProps {
  children: ReactNode
  height?: string
  fallbackMessage?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Class component car les error boundaries ne supportent pas les hooks
class MapErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erreur carte:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <MapFallback
          height={this.props.height}
          message={this.props.fallbackMessage || "Impossible de charger la carte"}
          onRetry={this.handleRetry}
          icon="error"
        />
      )
    }

    return this.props.children
  }
}

// Fallback UI réutilisable
export function MapFallback({
  height = '400px',
  message,
  subtitle,
  onRetry,
  icon = 'offline'
}: {
  height?: string
  message: string
  subtitle?: string
  onRetry?: () => void
  icon?: 'offline' | 'error' | 'location'
}) {
  const IconComponent = icon === 'offline' ? WifiIcon : icon === 'error' ? ExclamationTriangleIcon : MapPinIcon
  const iconBgColor = icon === 'offline' ? 'bg-amber-100 dark:bg-amber-900/30' : icon === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
  const iconColor = icon === 'offline' ? 'text-amber-500' : icon === 'error' ? 'text-red-500' : 'text-primary-500'

  return (
    <div
      className="w-full bg-muted/50 rounded-2xl flex items-center justify-center border border-border"
      style={{ height }}
    >
      <div className="text-center px-6 max-w-sm">
        <div className={`w-16 h-16 ${iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className={`w-8 h-8 ${iconColor}`} />
        </div>
        <p className="font-semibold text-foreground text-base">
          {message}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
        {onRetry && (
          <button type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Réessayer
          </button>
        )}
      </div>
    </div>
  )
}

export default MapErrorBoundaryInner
