'use client'

import { useState, useEffect, useEffectEvent } from 'react'

interface NetworkStatus {
  isOnline: boolean
  wasOffline: boolean // true si l'utilisateur était offline et vient de revenir
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  )
  const [wasOffline, setWasOffline] = useState(false)

  const handleOnline = useEffectEvent(() => {
    setIsOnline(true)
    setWasOffline(true)
    // Reset wasOffline après 5s
    setTimeout(() => setWasOffline(false), 5000)
  })

  const handleOffline = useEffectEvent(() => {
    setIsOnline(false)
  })

  useEffect(() => {
    // Initialiser avec le statut réel
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}
