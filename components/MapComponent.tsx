'use client'

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useMemo, useState } from 'react'

interface MapProps {
  userLocation: { lat: number; lng: number } // Required
  treasureLocation: { lat: number; lng: number } // Required
  onSelectLocation?: (coords: { lat: number; lng: number }) => void // Optional callback for selecting a location
  zoom?: number // Optional
  className?: string // Optional
}

export function MapComponent({
  userLocation,
  treasureLocation,
  onSelectLocation,
  zoom = 15,
  className = "",
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const center = useMemo(() => userLocation, [userLocation])

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  const distance = getDistance(userLocation, treasureLocation)

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (onSelectLocation) {
      const coords = { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 }
      setSelectedLocation(coords)
      onSelectLocation(coords) // Call the passed function to update the location in the parent
    }
  }

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <div className={`w-full h-64 rounded-lg overflow-hidden shadow-md ${className}`}>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onClick={handleMapClick} // Handle user click on the map
      >
        <Marker
          position={userLocation}
          icon={{
            url: '/user-icon.png',
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        <Marker
          position={treasureLocation}
          icon={{
            url: '/treasure-icon.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          onClick={() => {
            if (distance <= 0.5) {
              alert('🎉 You claimed the treasure!')
            } else {
              alert('❗ You are too far from the treasure.')
            }
          }}
        />
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={{
              url: '/selected-location-icon.png', // You can add your own icon here
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

// Helper function to calculate distance in KM
function getDistance(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371 // Earth's radius in KM
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180)
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
