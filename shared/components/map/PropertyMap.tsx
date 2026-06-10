'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Property } from '@/features/properties/types'
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus'
import MapErrorBoundary, { MapFallback } from './MapErrorBoundary'

interface PropertyMapProps {
  property: Property
  height?: string
}

function PropertyMapInner({ property, height = '400px' }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { isOnline } = useNetworkStatus()

  const initMap = useCallback(() => {
    if (map.current) {
      map.current.remove()
      map.current = null
    }
    setMapError(null)
    setMapLoaded(false)

    if (!mapContainer.current) return

    // Parse coordinates
    let coordinates: { lat: number; lng: number } | null = null

    if (property.coordinates) {
      try {
        if (typeof property.coordinates === 'string') {
          coordinates = JSON.parse(property.coordinates)
        } else {
          coordinates = property.coordinates as any
        }
      } catch (error) {
        console.error('Error parsing coordinates:', error)
        setMapError('Coordonnées invalides pour cette propriété')
        return
      }
    }

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return
    }

    try {
      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [coordinates.lng, coordinates.lat],
        zoom: 14
      })
      map.current = mapInstance

      mapInstance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
      mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')

      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '48px'
      el.style.height = '56px'
      el.style.backgroundImage = 'url(/images/markers/marker-estate.svg)'
      el.style.backgroundSize = 'contain'
      el.style.backgroundRepeat = 'no-repeat'
      el.style.cursor = 'pointer'

      new maplibregl.Marker({ element: el })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${property.title || 'Propriété sans titre'}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${property.location || ''}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${property.city || 'Localisation non renseignée'}</p>
            </div>`
          )
        )
        .addTo(mapInstance)

      mapInstance.on('load', () => {
        setMapLoaded(true)
        setMapError(null)
      })

      mapInstance.on('error', (e) => {
        const msg = e.error?.message || ''
        if (msg.includes('404') || msg.includes('tile')) return
        console.error('Erreur MapLibre PropertyMap:', e)
        if (!mapInstance.loaded()) {
          setMapError('Erreur lors du chargement de la carte')
        }
      })

      const timeout = setTimeout(() => {
        if (!mapInstance.loaded()) {
          setMapError('Le chargement de la carte est trop long')
        }
      }, 15000)

      return () => {
        clearTimeout(timeout)
        mapInstance.remove()
        map.current = null
      }
    } catch (err) {
      console.error('Erreur initialisation PropertyMap:', err)
      setMapError('Impossible d\'initialiser la carte')
    }
  }, [property])

  useEffect(() => {
    const cleanup = initMap()
    return () => {
      cleanup?.()
    }
  }, [initMap, retryCount])

  // Retry auto quand on revient en ligne
  useEffect(() => {
    if (isOnline && mapError) {
      setRetryCount(c => c + 1)
    }
  }, [isOnline, mapError])

  const handleRetry = () => setRetryCount(c => c + 1)

  if (!property.coordinates) {
    return (
      <MapFallback
        height={height}
        message="Localisation non disponible"
        subtitle="Cette propriété n'a pas de coordonnées GPS enregistrées."
        icon="location"
      />
    )
  }

  if (!isOnline && !mapLoaded) {
    return (
      <MapFallback
        height={height}
        message="Pas de connexion internet"
        subtitle="La carte nécessite une connexion pour s'afficher. Reconnectez-vous pour voir la localisation."
        onRetry={handleRetry}
        icon="offline"
      />
    )
  }

  if (mapError && !mapLoaded) {
    return (
      <MapFallback
        height={height}
        message={mapError}
        subtitle="Vérifiez votre connexion internet et réessayez."
        onRetry={handleRetry}
        icon="error"
      />
    )
  }

  return (
    <div className="relative">
      {!isOnline && mapLoaded && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          Mode hors-ligne
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height }}
      />
    </div>
  )
}

export default function PropertyMap(props: PropertyMapProps) {
  return (
    <MapErrorBoundary height={props.height}>
      <PropertyMapInner {...props} />
    </MapErrorBoundary>
  )
}
