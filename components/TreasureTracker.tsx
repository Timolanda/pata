'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LocationTreasure } from './ar/shared/types'

interface TreasureTrackerProps {
  treasures: LocationTreasure[]
  playerPosition: { lat: number; lng: number } | null
  gpsError: string | null
}

// Helper function to validate coordinates
function isValidCoordinate(lat?: number | null, lng?: number | null): boolean {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' && 
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180
  )
}

export function TreasureTracker({ treasures, playerPosition, gpsError }: TreasureTrackerProps) {
  const [nearbyTreasures, setNearbyTreasures] = useState<LocationTreasure[]>([])

  // Calculate nearby treasures
  useEffect(() => {
    if (!isValidCoordinate(playerPosition?.lat, playerPosition?.lng)) return

    const TREASURE_RADIUS = 50 // meters

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371e3 // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180
      const φ2 = (lat2 * Math.PI) / 180
      const Δφ = ((lat2 - lat1) * Math.PI) / 180
      const Δλ = ((lon2 - lon1) * Math.PI) / 180

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return R * c // Distance in meters
    }

    const nearby = treasures.filter((treasure) => {
      if (!isValidCoordinate(treasure.location?.lat, treasure.location?.lng)) return false
      
      const distance = calculateDistance(
        playerPosition!.lat,
        playerPosition!.lng,
        treasure.location.lat,
        treasure.location.lng
      )
      return distance <= TREASURE_RADIUS
    })

    setNearbyTreasures(nearby)
  }, [treasures, playerPosition])

  // Don't render anything if we don't have valid coordinates
  if (!isValidCoordinate(playerPosition?.lat, playerPosition?.lng)) {
    return null
  }

  if (gpsError) {
    return (
      <div className="fixed bottom-4 left-4 right-4 p-4 bg-red-50 rounded-lg shadow-lg">
        <p className="text-red-600">{gpsError}</p>
      </div>
    )
  }

  if (nearbyTreasures.length === 0) {
    return (
      <div className="fixed bottom-4 left-4 right-4 p-4 bg-blue-50 rounded-lg shadow-lg">
        <p className="text-blue-600">No treasures nearby. Keep exploring!</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 p-4 bg-green-50 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-green-700 mb-2">Nearby Treasures</h3>
      <div className="space-y-2">
        {nearbyTreasures.map((treasure) => (
          <div key={treasure.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">{treasure.name}</p>
              <p className="text-sm text-green-600">{treasure.hint}</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {treasure.rarity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
