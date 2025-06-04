'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Define interface for location coordinates
interface Location {
  lat: number;
  lng: number;
}

// Define props interface for MapComponent
interface MapComponentProps {
  userLocation: Location;
  treasureLocation: Location;
  zoom: number;
  className?: string;
}

// Dynamically import the map component with SSR disabled
const Map = dynamic(() => import('./Map').then(mod => mod.Map), {
  ssr: false,
  loading: () => <div>Loading map...</div>
})

export function MapComponent({ 
  userLocation, 
  treasureLocation, 
  zoom, 
  className = '' 
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Add console logging to debug the issue
  useEffect(() => {
    if (isMounted) {
      console.log('MapComponent props:', { userLocation, treasureLocation, zoom });
    }
  }, [isMounted, userLocation, treasureLocation, zoom]);

  if (!isMounted) {
    return null
  }

  // Validate coordinates before rendering the map
  const hasValidCoordinates = userLocation && 
    typeof userLocation.lat === 'number' && 
    typeof userLocation.lng === 'number' &&
    !isNaN(userLocation.lat) && 
    !isNaN(userLocation.lng);

  if (!hasValidCoordinates) {
    console.warn('Invalid coordinates provided to MapComponent:', userLocation);
    return <div className={className}>Waiting for valid location data...</div>;
  }

  // Pass props to Map component
  return (
    <div className={className}>
      <Map 
        userLocation={userLocation} 
        treasureLocation={treasureLocation}
        zoom={zoom}
      />
    </div>
  )
}
