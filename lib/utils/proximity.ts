import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ProximityNotification } from '../../components/proximity-notification' // ✅ this is correct!
import { TREASURE_MARKERS } from '@/components/ar/markers/treasureMarkers'

// Function to calculate the distance in kilometers
export function getDistanceInKm(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180)
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

interface Coordinates {
  latitude: number
  longitude: number
}

export function calculateDistance(loc1: Coordinates, loc2: Coordinates): number {
  const R = 6371 // Earth's radius in KM
  const dLat = (loc2.latitude - loc1.latitude) * (Math.PI / 180)
  const dLon = (loc2.longitude - loc1.longitude) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.latitude * (Math.PI / 180)) *
      Math.cos(loc2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function findNearbyTreasures(
  userLocation: Coordinates,
  radius: number = 0.015 // 15 meters in kilometers
): typeof TREASURE_MARKERS {
  return TREASURE_MARKERS.filter(treasure => {
    const distance = calculateDistance(userLocation, {
      latitude: treasure.location.latitude,
      longitude: treasure.location.longitude
    })
    return distance <= radius
  })
}

export function getProximityLevel(
  userLocation: Coordinates,
  treasureLocation: Coordinates
): 'far' | 'near' | 'very-near' {
  const distance = calculateDistance(userLocation, treasureLocation)
  
  if (distance <= 0.005) return 'very-near' // 5 meters
  if (distance <= 0.015) return 'near' // 15 meters
  return 'far'
}

export function watchUserLocation(
  onLocationUpdate: (location: Coordinates) => void,
  onError?: (error: GeolocationPositionError) => void
): number {
  return navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    },
    (error) => {
      onError?.(error)
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  )
}

export function stopWatchingLocation(watchId: number): void {
  navigator.geolocation.clearWatch(watchId)
}


