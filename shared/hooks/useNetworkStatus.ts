'use client'

import { useState, useEffect, useCallback } from 'react'

interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean // true si l'utilisateur était offline et vient de revenir
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  const handleOnline = useCallback(() => {
    setIsOnline(true)
    setWasOffline(true)
    // Reset wasOffline après 5s
    setTimeout(() => setWasOffline(false), 5000)
  }, [])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
  }, [])

  useEffect(() => {
    // Initialiser avec le statut réel
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  return { isOnline, wasOffline }
}
