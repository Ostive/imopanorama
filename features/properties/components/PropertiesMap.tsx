'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Property } from '../types'
import { PROPERTY_TYPE_LABELS } from '../types'
import Link from 'next/link'
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus'
import MapErrorBoundary, { MapFallback } from '@/shared/components/map/MapErrorBoundary'
import { getSafeImageSrc, markImageFailed } from '@/shared/hooks/useImageFallback'

interface PropertiesMapProps {
  properties: Property[]
  height?: string
  onPropertyClick?: (propertyId: string) => void
}

function getMarkerSrc(property: Property) {
  const proTypes = new Set(['OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'])
  return proTypes.has(property.propertyType)
    ? '/images/markers/marker-pro.svg'
    : '/images/markers/marker-estate.svg'
}

function PropertiesMapInner({
  properties,
  height = '600px',
  onPropertyClick
}: PropertiesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { isOnline } = useNetworkStatus()

  const validProperties = properties.filter(p => {
    if (!p.coordinates) return false
    try {
      const coords = typeof p.coordinates === 'string'
        ? JSON.parse(p.coordinates)
        : p.coordinates
      return coords && coords.lat && coords.lng
    } catch {
      return false
    }
  })

  const initMap = useCallback(() => {
    // Cleanup previous
    markers.current.forEach(marker => marker.remove())
    markers.current = []
    if (map.current) {
      map.current.remove()
      map.current = null
    }
    setMapError(null)
    setMapLoaded(false)

    if (!mapContainer.current || validProperties.length === 0) return

    try {
      const coordinates = validProperties.map(p => {
        const coords = typeof p.coordinates === 'string'
          ? JSON.parse(p.coordinates)
          : p.coordinates
        return [coords.lng, coords.lat] as [number, number]
      })

      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      )

      const center = bounds.getCenter()

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [center.lng, center.lat],
        zoom: 12,
        attributionControl: false,
      })

      map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

      map.current.on('load', () => {
        setMapLoaded(true)
        setMapError(null)

        if (coordinates.length > 1) {
          map.current?.fitBounds(bounds, { padding: 50, maxZoom: 15 })
        }

        validProperties.forEach((property) => {
          const coords = typeof property.coordinates === 'string'
            ? JSON.parse(property.coordinates)
            : property.coordinates

          if (!coords || !coords.lat || !coords.lng) return

          const el = document.createElement('div')
          el.className = 'property-marker'
          el.style.width = '48px'
          el.style.height = '56px'
          el.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.28))'
          el.style.cursor = 'pointer'
          el.style.display = 'flex'
          el.style.alignItems = 'center'
          el.style.justifyContent = 'center'
          el.style.transformOrigin = 'center bottom'
          el.style.transition = 'transform 0.2s, filter 0.2s'
          el.innerHTML = `
            <img src="${getMarkerSrc(property)}" alt="" width="48" height="56" style="width:48px;height:56px;display:block;pointer-events:none;" />
          `

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)'
            el.style.filter = 'drop-shadow(0 6px 14px rgba(0,0,0,0.36))'
          })

          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)'
            el.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.28))'
          })

          const formatPrice = (price: number) => {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
            }).format(price)
          }

          const popupContent = `
            <div class="property-popup" style="min-width: 250px;">
              <div style="position: relative; width: 100%; height: 150px; margin: -12px -12px 12px -12px; border-radius: 8px 8px 0 0; overflow: hidden;">
                <img
                  src="${getSafeImageSrc(property.images && property.images.length > 0 ? property.images[0] : '')}"
                  alt="${property.title || 'Propriété'}"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  onerror="this.onerror=null;this.src='/images/properties/property-placeholder.jpg'"
                />
                <div style="position: absolute; top: 8px; left: 8px;">
                  <span style="background-color: #0ea5e9; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                    ${PROPERTY_TYPE_LABELS[property.propertyType] || 'Bien immobilier'}
                  </span>
                </div>
              </div>
              <h3 style="margin: 0 0 8px 0; font-weight: 700; font-size: 16px; color: #111827; line-height: 1.3;">
                ${property.title || 'Propriété sans titre'}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
                <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ${property.city || 'Localisation non renseignée'}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <div>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0ea5e9;">
                    ${property.price ? formatPrice(property.price) : 'Prix sur demande'}
                  </p>
                  ${property.pricePerM2 ? `
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #9ca3af;">
                      ${Math.round(property.pricePerM2).toLocaleString()}€/m²
                    </p>
                  ` : ''}
                </div>
                <a
                  href="/proprietes/${property.id}"
                  style="background-color: #0ea5e9; color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-block; transition: background-color 0.2s;"
                  onmouseover="this.style.backgroundColor='#0284c7'"
                  onmouseout="this.style.backgroundColor='#0ea5e9'"
                >
                  Voir détails
                </a>
              </div>
            </div>
          `

          const popup = new maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
          }).setHTML(popupContent)

          const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([coords.lng, coords.lat])
            .setPopup(popup)
            .addTo(map.current!)

          markers.current.push(marker)

          el.addEventListener('click', () => {
            setSelectedProperty(property)
            if (onPropertyClick) {
              onPropertyClick(property.id)
            }
          })
        })
      })

      map.current.on('error', (e) => {
        const msg = e.error?.message || ''
        if (msg.includes('404') || msg.includes('tile')) return
        console.error('Erreur MapLibre PropertiesMap:', e)
        if (!mapLoaded) {
          setMapError('Erreur lors du chargement de la carte')
        }
      })

      const timeout = setTimeout(() => {
        if (!map.current?.loaded()) {
          setMapError('Le chargement de la carte est trop long')
        }
      }, 15000)

      return () => clearTimeout(timeout)
    } catch (err) {
      console.error('Erreur initialisation PropertiesMap:', err)
      setMapError('Impossible d\'initialiser la carte')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, onPropertyClick, retryCount])

  useEffect(() => {
    const cleanup = initMap()
    return () => {
      cleanup?.()
      markers.current.forEach(marker => marker.remove())
      markers.current = []
      map.current?.remove()
      map.current = null
    }
  }, [initMap])

  // Retry auto quand on revient en ligne
  useEffect(() => {
    if (isOnline && mapError) {
      setRetryCount(c => c + 1)
    }
  }, [isOnline, mapError])

  const handleRetry = () => setRetryCount(c => c + 1)

  if (!properties || properties.length === 0) {
    return (
      <MapFallback
        height={height}
        message="Aucune propriété à afficher sur la carte"
        subtitle="Les propriétés sans coordonnées ne peuvent pas être affichées."
        icon="location"
      />
    )
  }

  if (!isOnline && !mapLoaded) {
    return (
      <MapFallback
        height={height}
        message="Pas de connexion internet"
        subtitle="La carte nécessite une connexion pour afficher les propriétés. Reconnectez-vous pour voir la carte."
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
      {/* Bannière offline quand la carte est déjà chargée */}
      {!isOnline && mapLoaded && (
        <div className="absolute top-14 left-4 z-20 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          Mode hors-ligne
        </div>
      )}

      <div
        ref={mapContainer}
        className="w-full rounded-2xl overflow-hidden shadow-lg"
        style={{ height }}
      />

      {/* Map Info Badge */}
      <div className="absolute top-4 left-4 bg-card rounded-xl shadow-lg px-4 py-2 z-10 border border-border">
        <p className="text-sm font-semibold text-foreground">
          {validProperties.length} propriété{validProperties.length !== 1 ? 's' : ''} sur la carte
        </p>
      </div>
    </div>
  )
}

export default function PropertiesMap(props: PropertiesMapProps) {
  return (
    <MapErrorBoundary height={props.height}>
      <PropertiesMapInner {...props} />
    </MapErrorBoundary>
  )
}
