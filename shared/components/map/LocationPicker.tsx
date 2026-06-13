'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Map from './Map';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationData {
  address?: string;
  city?: string;
  suburb?: string;
  postcode?: string;
}

interface LocationPickerProps {
  initialCoordinates?: Coordinates;
  onCoordinatesChange: (coordinates: Coordinates) => void;
  onLocationDataChange?: (data: LocationData) => void;
  height?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialCoordinates,
  onCoordinatesChange,
  onLocationDataChange,
  height = '400px'
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates>(
    initialCoordinates || { lat: -18.8792, lng: 47.5079 }
  );
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const { isOnline } = useNetworkStatus();
  const coordinatesRef = useRef(coordinates);
  const geocodeErrorRef = useRef(geocodeError);

  coordinatesRef.current = coordinates;
  geocodeErrorRef.current = geocodeError;



  // Récupérer l'adresse à partir des coordonnées (géocodage inverse)
  const fetchAddressFromCoordinates = useCallback(async (coords: Coordinates) => {
    setGeocodeError(null);

    if (!navigator.onLine) {
      setGeocodeError('Pas de connexion — l\'adresse sera récupérée automatiquement quand vous serez en ligne.');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'adresse');
      }

      const data = await response.json();
      // Extract location data from the response
      if (data.address && onLocationDataChange) {
        // 1. Construct detailed address
        // Try to find the most specific "street" identifying part
        const street = data.address.road ||
          data.address.pedestrian ||
          data.address.highway ||
          data.address.residential ||
          data.address.village ||
          data.address.hamlet || '';

        // Try to find a building or place name
        const place = data.address.building ||
          data.address.amenity ||
          data.address.house_name || '';

        let detailedAddress = street;

        // Prepend place name if available and not same as street
        if (place && place !== street) {
          detailedAddress = detailedAddress ? `${place}, ${detailedAddress}` : place;
        }

        // Prepend house number
        if (data.address.house_number && detailedAddress) {
          detailedAddress = `${data.address.house_number} ${detailedAddress}`;
        }

        // If we still have nothing, maybe use the display_name's first part? 
        // But better to leave empty for user to fill than put "Madagascar"

        // 2. Resolve City / Town
        // Hierarchy: City > Town > Village > Municipality > City District > County
        const resolvedCity = data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          data.address.city_district ||
          data.address.county ||
          data.address.state || ''; // State as last resort for city-states or sparse regions

        // 3. Resolve Suburb / Quartier
        // Hierarchy: Suburb > Neighbourhood > Quarter > District > City District (if not used as city)
        let resolvedSuburb = data.address.suburb ||
          data.address.neighbourhood ||
          data.address.quarter ||
          data.address.district || '';

        // If suburb is empty and we used a "village" or "hamlet" as street/address, we might not want to repeat it.
        // But if we have no suburb, maybe "village" or "town" IS the suburb in a larger metro context.
        if (!resolvedSuburb && !resolvedCity && data.address.village) {
          resolvedSuburb = data.address.village;
        }

        const locationData: LocationData = {
          address: detailedAddress,
          city: resolvedCity,
          suburb: resolvedSuburb,
          postcode: data.address.postcode || '',
        };

        console.log('OpenStreetMap Address Data:', data.address);
        console.log('Parsed Location Data:', locationData);
        onLocationDataChange(locationData);
      }
    } catch (error) {
      console.error('Erreur de géocodage inverse:', error);
      if (!navigator.onLine) {
        setGeocodeError('Connexion perdue — l\'adresse sera récupérée quand vous serez en ligne.');
      } else {
        setGeocodeError('Impossible de récupérer l\'adresse. Réessayez plus tard.');
      }
    }
  }, [onLocationDataChange]);

  // Retry geocoding quand le navigateur signale le retour en ligne
  useEffect(() => {
    const handleOnline = () => {
      if (geocodeErrorRef.current) {
        fetchAddressFromCoordinates(coordinatesRef.current);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchAddressFromCoordinates]);

  // Gérer le clic sur la carte
  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    const newCoordinates = { lat: lngLat.lat, lng: lngLat.lng };
    setCoordinates(newCoordinates);
    onCoordinatesChange(newCoordinates);
    fetchAddressFromCoordinates(newCoordinates);
  };

  // Stabilise la référence pour éviter que le marker effect se déclenche sur chaque re-render
  const mapMarkers = useMemo(() => [{
    id: 'terrain-location',
    longitude: coordinates.lng,
    latitude: coordinates.lat,
    markerStyle: 'estate' as const,
    title: 'Position du terrain'
  }], [coordinates.lng, coordinates.lat]);

  return (
    <div className="location-picker">


      {/* Instructions pour la carte */}
      <div className="text-sm text-gray-600 mb-2">
        <p>Cliquez sur la carte pour définir l'emplacement du terrain</p>
        <p className="mt-1 font-medium text-primary-600">Vous pouvez aussi déplacer directement le marqueur par glisser-déposer</p>
      </div>

      {/* Avertissement offline / erreur geocoding */}
      {geocodeError && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm rounded-xl px-4 py-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p>{geocodeError}</p>
        </div>
      )}

      {!isOnline && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm rounded-xl px-4 py-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <p>Mode hors-ligne — vous pouvez placer le marqueur, l'adresse sera résolue automatiquement à la reconnexion.</p>
        </div>
      )}

      {/* Carte interactive */}
      <Map
        center={[coordinates.lng, coordinates.lat]}
        zoom={10}
        height={height}
        onMapClick={handleMapClick}
        markers={mapMarkers}
      />
    </div>
  );
};

export default LocationPicker;
