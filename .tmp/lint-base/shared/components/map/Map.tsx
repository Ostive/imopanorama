'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import MapErrorBoundary, { MapFallback } from './MapErrorBoundary';

type MarkerStyle = 'default' | 'pro' | 'estate';

interface MapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  markers?: Array<{
    id: string;
    longitude: number;
    latitude: number;
    title?: string;
    onClick?: () => void;
    markerStyle?: MarkerStyle;
  }>;
  height?: string;
  width?: string;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
  interactive?: boolean;
  defaultMarkerStyle?: MarkerStyle;
}

// Définition des styles de marqueurs
const markerStyles = {
  default: {
    url: '/images/markers/marker.svg',
    width: 32,
    height: 40
  },
  pro: {
    url: '/images/markers/marker-pro.svg',
    width: 40,
    height: 48
  },
  estate: {
    url: '/images/markers/marker-estate.svg',
    width: 48,
    height: 56
  }
};
const EMPTY_MARKERS: NonNullable<MapProps['markers']> = [];

const MapInner: React.FC<MapProps> = ({
  center = [47.5079, -18.8792], // Antananarivo, Madagascar par défaut
  zoom = 12,
  markers = EMPTY_MARKERS,
  height = '400px',
  width = '100%',
  onMapClick,
  interactive = true,
  defaultMarkerStyle = 'estate',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerRefs = useRef<Record<string, maplibregl.Marker>>({});
  const onMapClickRef = useRef(onMapClick);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const { isOnline } = useNetworkStatus();
  const mapErrorRef = useRef(mapError);
  mapErrorRef.current = mapError;

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const initMap = useCallback(() => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapError(null);
    setMapLoaded(false);

    if (!mapContainer.current) return;

    try {
      const mapInstance = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: center,
        zoom: zoom,
        interactive: interactive !== false,
        attributionControl: false
      } as maplibregl.MapOptions);

      // Ajouter les contrôles
      mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');
      mapInstance.addControl(new maplibregl.FullscreenControl(), 'top-right');
      mapInstance.addControl(new maplibregl.ScaleControl(), 'bottom-right');
      mapInstance.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

      map.current = mapInstance;

      mapInstance.on('click', (e) => {
        onMapClickRef.current?.({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      });

      mapInstance.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
      });

      // Gestion des erreurs de chargement (tiles, style, etc.)
      mapInstance.on('error', (e) => {
        const msg = e.error?.message || '';
        // Ignorer les erreurs de tiles individuelles (la carte reste utilisable)
        if (msg.includes('404') || msg.includes('tile')) return;
        console.error('Erreur MapLibre:', e);
        if (!map.current?.loaded()) {
          setMapError('Erreur lors du chargement de la carte');
        }
      });

      // Timeout si la carte ne charge pas en 15s
      const timeout = setTimeout(() => {
        if (!map.current?.loaded()) {
          setMapError('Le chargement de la carte est trop long. Vérifiez votre connexion internet.');
        }
      }, 15000);

      return () => {
        clearTimeout(timeout);
        mapInstance.remove();
        map.current = null;
      };
    } catch (err) {
      console.error('Erreur initialisation carte:', err);
      setMapError('Impossible d\'initialiser la carte');
    }
  }, [center, zoom, interactive]);

  // Initialisation de la carte
  const cleanupRef = useRef<(() => void) | void>(undefined);
  useEffect(() => {
    cleanupRef.current = initMap();
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
    };
  }, [initMap]);

  const handleRetry = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = initMap();
  }, [initMap]);

  // Retry automatique quand on revient en ligne
  useEffect(() => {
    const handleOnline = () => {
      if (mapErrorRef.current) {
        handleRetry();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [handleRetry]);

  // Pas de synchronisation séparée centre/zoom : initMap dépend de [center, zoom]
  // et recrée la carte avec les nouvelles valeurs quand ces props changent.

  // Gestion des marqueurs avec optimisation pour éviter les réactualisations inutiles
  const previousMarkersRef = useRef<Array<{
    id: string;
    longitude: number;
    latitude: number;
    title?: string;
    onClick?: () => void;
    markerStyle?: MarkerStyle;
  }>>([]);
  
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Vérifier si les marqueurs ont réellement changé
    const markersChanged = markers.length !== previousMarkersRef.current.length ||
      markers.some((marker, index) => {
        const prevMarker = previousMarkersRef.current[index];
        return !prevMarker ||
          prevMarker.id !== marker.id ||
          prevMarker.longitude !== marker.longitude ||
          prevMarker.latitude !== marker.latitude;
      });

    // Ne mettre à jour les marqueurs que s'ils ont changé
    if (!markersChanged) {
      return;
    }

    console.log(`Ajout/mise à jour de ${markers.length} marqueurs sur la carte`);
    previousMarkersRef.current = [...markers];

    // D'abord, supprimer tous les marqueurs existants
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};

    // Store map instance for use in forEach callback
    const mapInstance = map.current;

    // Ajouter les nouveaux marqueurs
    markers.forEach((marker) => {
      const { id, longitude, latitude, title, onClick } = marker;
      const markerStyle = marker.markerStyle || defaultMarkerStyle;
      
      if (!longitude || !latitude) {
        console.error(`Marqueur ${id} avec coordonnées invalides: [${longitude}, ${latitude}]`);
        return;
      }
      
      try {
        // Créer un élément DOM pour le marqueur
        const el = document.createElement('div');
        el.className = `marker marker-${markerStyle}`;
        
        // Appliquer des styles inline pour garantir la visibilité
        el.style.cssText = [
          'width: 30px',
          'height: 30px',
          `background-image: url('/images/markers/marker-${markerStyle}.svg')`,
          'background-size: contain',
          'background-repeat: no-repeat',
          'background-position: center',
          'cursor: grab',
        ].join('; ');
        
        if (title) {
          el.setAttribute('title', title);
        }
        
        if (onClick) {
          el.addEventListener('click', onClick);
        }
        
        // Vérifier si nous sommes dans la page d'édition (LocationPicker)
        const isLocationPicker = id === 'terrain-location';
        
        // Créer le marqueur MapLibre
        const newMarker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
          // Rendre le marqueur déplaçable uniquement dans LocationPicker
          draggable: isLocationPicker
        })
        .setLngLat([longitude, latitude]);
        
        // Si c'est un marqueur déplaçable, ajouter l'événement de fin de glisser-déposer
        if (isLocationPicker) {
          newMarker.on('dragend', () => {
            const lngLat = newMarker.getLngLat();
            console.log(`Marqueur déplacé à [${lngLat.lng}, ${lngLat.lat}]`);
            
            // Déclencher l'événement onClick avec les nouvelles coordonnées
            onMapClickRef.current?.(lngLat);
          });
        }

        newMarker.addTo(mapInstance);
        markerRefs.current[id] = newMarker;
        
        console.log(`Marqueur ${id} ajouté à la position [${longitude}, ${latitude}]`);
      } catch (error) {
        console.error(`Erreur lors de la création du marqueur ${id}:`, error);
      }
    });

    return () => {
      Object.values(markerRefs.current).forEach(marker => marker.remove());
      markerRefs.current = {};
    };
  }, [markers, mapLoaded, defaultMarkerStyle]);

  // Afficher le fallback offline
  if (!isOnline && !mapLoaded) {
    return (
      <MapFallback
        height={height}
        message="Pas de connexion internet"
        subtitle="La carte nécessite une connexion internet pour charger les tuiles. Reconnectez-vous pour voir la carte."
        onRetry={handleRetry}
        icon="offline"
      />
    );
  }

  // Afficher le fallback erreur
  if (mapError && !mapLoaded) {
    return (
      <MapFallback
        height={height}
        message={mapError}
        subtitle="Vérifiez votre connexion internet et réessayez."
        onRetry={handleRetry}
        icon="error"
      />
    );
  }

  return (
    <>
      <style>{`
        .marker {
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          cursor: pointer;
        }
        .marker-default {
          background-image: url('/images/markers/marker.svg');
          width: 32px;
          height: 40px;
        }
        .marker-pro {
          background-image: url('/images/markers/marker-pro.svg');
          width: 40px;
          height: 48px;
        }
        .marker-estate {
          background-image: url('/images/markers/marker-estate.svg');
          width: 48px;
          height: 56px;
        }
      `}</style>

      <div className="relative">
        {/* Bannière offline quand la carte est déjà chargée mais qu'on perd la connexion */}
        {!isOnline && mapLoaded && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            Mode hors-ligne — la carte peut ne pas se mettre à jour
          </div>
        )}
        <div
          ref={mapContainer}
          className="rounded-lg overflow-hidden border border-gray-300"
          style={{
            width: width || '100%',
            height: height || '400px',
          }}
        />
      </div>
    </>
  );
};

// Wrapper avec Error Boundary
const Map: React.FC<MapProps> = (props) => (
  <MapErrorBoundary height={props.height}>
    <MapInner {...props} />
  </MapErrorBoundary>
);

export default Map;
