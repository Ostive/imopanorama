'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Property } from '@/features/properties/types/properties.types'
import PropertyCard from './PropertyCard'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus'
import MapErrorBoundary, { MapFallback } from '@/shared/components/map/MapErrorBoundary'
import { getSafeImageSrc } from '@/shared/hooks/useImageFallback'

const markerStyles = `
  /* IMPORTANT: don't set 'position' here — MapLibre adds .maplibregl-marker
     which sets position:absolute. Overriding it breaks marker positioning. */
  .property-marker-container {
    width: 48px;
    height: 48px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .property-marker-container:hover {
    z-index: 1000 !important;
  }

  .property-marker-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #0ea5e9;
    border: 4px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s, box-shadow 0.2s;
    transform-origin: center center;
    will-change: transform;
  }

  .property-marker-container:hover .property-marker-inner {
    transform: scale(1.2);
    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
  }

  .property-marker-inner.selected {
    transform: scale(1.3);
    box-shadow: 0 8px 20px rgba(0,0,0,0.5);
    background-color: #f59e0b;
  }

  .maplibregl-popup {
    z-index: 100 !important;
  }

  .maplibregl-popup-content {
    padding: 0 !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
    overflow: hidden;
  }

  .maplibregl-popup-close-button {
    font-size: 20px !important;
    padding: 4px 8px !important;
    color: #6b7280 !important;
    right: 4px !important;
    top: 4px !important;
    z-index: 10;
    position: absolute;
  }

  .maplibregl-popup-close-button:hover {
    background-color: rgba(0,0,0,0.1) !important;
    border-radius: 4px;
  }

  .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
    border-top-color: white !important;
  }
  .maplibregl-popup-anchor-top .maplibregl-popup-tip {
    border-bottom-color: white !important;
  }
  .maplibregl-popup-anchor-left .maplibregl-popup-tip {
    border-right-color: white !important;
  }
  .maplibregl-popup-anchor-right .maplibregl-popup-tip {
    border-left-color: white !important;
  }
`

interface PropertiesMapViewProps {
  properties: Property[]
  height?: string
}

function PropertiesMapViewInner({
  properties,
  height = '600px'
}: PropertiesMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map())
  const popup = useRef<maplibregl.Popup | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { isOnline } = useNetworkStatus()

  const initMap = useCallback(() => {
    if (popup.current) { popup.current.remove(); popup.current = null }
    markers.current.forEach(marker => marker.remove())
    markers.current.clear()
    if (map.current) { map.current.remove(); map.current = null }
    setMapError(null)
    setMapLoaded(false)

    if (!mapContainer.current) return

    if (!document.querySelector('[data-map-styles]')) {
      const styleElement = document.createElement('style')
      styleElement.setAttribute('data-map-styles', 'true')
      styleElement.innerHTML = markerStyles
      document.head.appendChild(styleElement)
    }

    const validProperties = properties.filter(p => {
      if (!p.coordinates) return false
      try {
        const coords = typeof p.coordinates === 'string' ? JSON.parse(p.coordinates) : p.coordinates
        return coords && coords.lat && coords.lng
      } catch { return false }
    })

    if (validProperties.length === 0) return

    try {
      const coordinates = validProperties.map(p => {
        const coords = typeof p.coordinates === 'string' ? JSON.parse(p.coordinates) : p.coordinates
        return [coords.lng, coords.lat] as [number, number]
      })

      const bounds = coordinates.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      )
      const center = bounds.getCenter()

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [center.lng, center.lat],
        zoom: 12
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
          if (!coords?.lat || !coords?.lng) return

          const el = document.createElement('div')
          el.className = 'property-marker-container'
          el.dataset.propertyId = property.id

          const inner = document.createElement('div')
          inner.className = 'property-marker-inner'
          inner.innerHTML = '🏠'
          el.appendChild(inner)

          el.addEventListener('click', (e) => {
            e.stopPropagation()
            setSelectedProperty(property)

            if (popup.current) popup.current.remove()

            const formattedPrice = property.price
              ? new Intl.NumberFormat('fr-FR', {
                  style: 'currency', currency: 'EUR',
                  minimumFractionDigits: 0, maximumFractionDigits: 0,
                }).format(property.price)
              : 'Prix sur demande'

            const typeLabels: Record<string, string> = {
              TERRAIN_RESIDENTIAL: 'Terrain résidentiel', TERRAIN_COMMERCIAL: 'Terrain commercial',
              TERRAIN_AGRICULTURAL: 'Terrain agricole', TERRAIN_INDUSTRIAL: 'Terrain industriel',
              VILLA: 'Villa', HOUSE: 'Maison', TOWNHOUSE: 'Maison de ville',
              COUNTRY_HOUSE: 'Maison de campagne', APARTMENT: 'Appartement', STUDIO: 'Studio',
              PENTHOUSE: 'Penthouse', DUPLEX: 'Duplex', LOFT: 'Loft', OFFICE: 'Bureau',
              SHOP: 'Commerce', WAREHOUSE: 'Entrepôt', BUILDING: 'Immeuble',
              HOTEL: 'Hôtel', RESTAURANT: 'Restaurant',
            }

            const imgHTML = property.coverImage ? `
              <div style="position:relative;height:140px;overflow:hidden;">
                <img src="${getSafeImageSrc(property.coverImage)}"
                  alt="${property.title || ''}"
                  style="width:100%;height:100%;object-fit:cover;"
                  onerror="this.onerror=null;this.src='/images/placeholders/property.jpg'"
                />
                <div style="position:absolute;top:8px;right:8px;background:white;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;">
                  ${property.transactionType === 'SALE' ? 'À vendre' : 'À louer'}
                </div>
              </div>` : ''

            const popupHTML = `
              <div style="width:280px;background:white;border-radius:12px;overflow:hidden;">
                ${imgHTML}
                <div style="padding:12px;">
                  <p style="font-size:11px;color:#6b7280;margin:0 0 4px;">${typeLabels[property.propertyType] || property.propertyType}</p>
                  <h3 style="font-weight:700;font-size:14px;color:#111827;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                    ${property.title || 'Propriété sans titre'}
                  </h3>
                  <p style="font-size:12px;color:#6b7280;margin:0 0 8px;">📍 ${property.city || 'Localisation non renseignée'}</p>
                  <p style="font-size:18px;font-weight:700;color:#0284c7;margin:0 0 8px;">
                    ${formattedPrice}
                    ${property.pricePerM2 ? `<span style="font-size:11px;font-weight:400;color:#6b7280;"> · ${Math.round(property.pricePerM2)}€/m²</span>` : ''}
                  </p>
                  <div style="display:flex;gap:10px;font-size:12px;color:#6b7280;margin-bottom:10px;">
                    ${property.totalSize ? `<span>📏 ${property.totalSize}m²</span>` : ''}
                    ${property.bedrooms ? `<span>🛏️ ${property.bedrooms}</span>` : ''}
                    ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
                  </div>
                  <a href="/proprietes/${property.id}"
                    style="display:block;width:100%;background:#0284c7;color:white;text-align:center;padding:8px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;">
                    Voir les détails →
                  </a>
                </div>
              </div>`

            // Determine popup anchor based on marker position in viewport
            const mapCanvas = map.current?.getCanvas()
            const markerPx = map.current?.project([coords.lng, coords.lat])
            const canvasHeight = mapCanvas?.clientHeight ?? 600
            const anchor = markerPx && markerPx.y < canvasHeight / 2 ? 'top' : 'bottom'

            popup.current = new maplibregl.Popup({
              offset: (anchor === 'bottom' ? [0, -52] : [0, 10]) as [number, number],
              closeButton: true,
              closeOnClick: false,
              maxWidth: 'none',
              anchor,
            })
              .setLngLat([coords.lng, coords.lat])
              .setHTML(popupHTML)
              .addTo(map.current!)

            map.current?.easeTo({
              center: [coords.lng, coords.lat],
              duration: 600
            })
          })

          const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current!)

          markers.current.set(property.id, marker)
        })
      })

      map.current.on('error', (e) => {
        const msg = e.error?.message || ''
        if (msg.includes('404') || msg.includes('tile')) return
        if (!mapLoaded) setMapError('Erreur lors du chargement de la carte')
      })

      const timeout = setTimeout(() => {
        if (!map.current?.loaded()) setMapError('Le chargement de la carte est trop long')
      }, 15000)

      return () => clearTimeout(timeout)
    } catch (err) {
      console.error('Erreur initialisation PropertiesMapView:', err)
      setMapError('Impossible d\'initialiser la carte')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, retryCount])

  useEffect(() => {
    const cleanup = initMap()
    return () => {
      cleanup?.()
      if (popup.current) { popup.current.remove(); popup.current = null }
      markers.current.forEach(marker => marker.remove())
      markers.current.clear()
      map.current?.remove()
      map.current = null
    }
  }, [initMap])

  useEffect(() => {
    if (isOnline && mapError) setRetryCount(c => c + 1)
  }, [isOnline, mapError])

  // Fix z-index: update both the marker element AND MapLibre's wrapper parent
  useEffect(() => {
    markers.current.forEach((marker, propertyId) => {
      const el = marker.getElement()
      if (!el) return
      const inner = el.querySelector('.property-marker-inner')
      if (!inner) return

      const isActive = propertyId === selectedProperty?.id || propertyId === hoveredPropertyId
      if (isActive) {
        inner.classList.add('selected')
        el.style.zIndex = '2000'
        if (el.parentElement) el.parentElement.style.zIndex = '2000'
      } else {
        inner.classList.remove('selected')
        el.style.zIndex = '1'
        if (el.parentElement) el.parentElement.style.zIndex = '1'
      }
    })
  }, [hoveredPropertyId, selectedProperty])

  const validProperties = properties.filter(p => {
    if (!p.coordinates) return false
    try {
      const coords = typeof p.coordinates === 'string' ? JSON.parse(p.coordinates) : p.coordinates
      return coords && coords.lat && coords.lng
    } catch { return false }
  })

  if (!properties || properties.length === 0) {
    return <MapFallback height={height} message="Aucune propriété à afficher sur la carte" subtitle="Les propriétés sans coordonnées ne peuvent pas être affichées." icon="location" />
  }
  if (validProperties.length === 0) {
    return <MapFallback height={height} message="Aucune propriété avec coordonnées GPS" subtitle={`${properties.length} propriété${properties.length !== 1 ? 's' : ''} disponible${properties.length !== 1 ? 's' : ''}, mais aucune n'a de coordonnées GPS.`} icon="location" />
  }
  if (!isOnline && !mapLoaded) {
    return <MapFallback height={height} message="Pas de connexion internet" subtitle="La carte nécessite une connexion pour afficher les propriétés." onRetry={() => setRetryCount(c => c + 1)} icon="offline" />
  }
  if (mapError && !mapLoaded) {
    return <MapFallback height={height} message={mapError} subtitle="Vérifiez votre connexion internet et réessayez." onRetry={() => setRetryCount(c => c + 1)} icon="error" />
  }

  return (
    <div className="relative flex flex-col lg:flex-row gap-4 w-full" style={{ height }}>
      {/* Map Section */}
      <div className="relative w-full lg:w-[70%] h-full">
        {!isOnline && mapLoaded && (
          <div className="absolute top-14 left-4 z-20 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            Mode hors-ligne
          </div>
        )}

        {/* overflow-hidden retiré → le popup MapLibre n'est plus coupé */}
        <div
          ref={mapContainer}
          className="w-full h-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        />

        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2 z-10 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {validProperties.length} propriété{validProperties.length !== 1 ? 's' : ''} sur la carte
          </p>
        </div>
      </div>

      {/* Property Cards Section — desktop only */}
      <div className="hidden lg:flex lg:w-[30%] flex-col h-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedProperty ? 'Propriété sélectionnée' : 'Propriétés disponibles'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedProperty
                ? 'Cliquez sur la carte pour voir d\'autres propriétés'
                : 'Cliquez sur un marqueur pour voir les détails'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {selectedProperty ? (
                <motion.div
                  key={selectedProperty.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Propriété sélectionnée</span>
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg px-2 py-1 transition-colors"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                      Fermer
                    </button>
                  </div>
                  <PropertyCard property={selectedProperty} variant="compact" />
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {validProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setHoveredPropertyId(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      onClick={() => {
                        setSelectedProperty(property)
                        const coords = typeof property.coordinates === 'string'
                          ? JSON.parse(property.coordinates)
                          : property.coordinates
                        map.current?.flyTo({ center: [coords.lng, coords.lat], zoom: 15, duration: 1000 })
                      }}
                      className={`cursor-pointer transition-all duration-200 ${hoveredPropertyId === property.id ? 'ring-2 ring-primary-500 rounded-2xl' : ''}`}
                    >
                      <PropertyCard property={property} variant="compact" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertiesMapView(props: PropertiesMapViewProps) {
  return (
    <MapErrorBoundary height={props.height}>
      <PropertiesMapViewInner {...props} />
    </MapErrorBoundary>
  )
}
