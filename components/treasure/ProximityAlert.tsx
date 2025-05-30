'use client'

import { useEffect, useState } from 'react'
import { Database } from '@/lib/types/supabase'
import { X, MapPin, Compass } from 'lucide-react'

type Treasure = Database['public']['Tables']['treasures']['Row']

interface ProximityAlertProps {
  treasure: Treasure
  onClose: () => void
}

export function ProximityAlert({ treasure, onClose }: ProximityAlertProps) {
  const [distance, setDistance] = useState<number | null>(null)
  const [direction, setDirection] = useState<string>('')

  useEffect(() => {
    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude
        
        // Calculate distance
        const dist = calculateDistance(
          userLat,
          userLng,
          treasure.latitude,
          treasure.longitude
        )
        setDistance(dist)

        // Calculate direction
        const dir = calculateDirection(
          userLat,
          userLng,
          treasure.latitude,
          treasure.longitude
        )
        setDirection(dir)
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }, [treasure])

  return (
    <div className="fixed top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto z-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Treasure Nearby!</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-gray-700">
          You&apos;re close to <span className="font-medium">{treasure.name}</span>
        </p>
        
        {distance !== null && (
          <div className="flex items-center gap-2 text-gray-600">
            <Compass className="w-4 h-4" />
            <span>
              {distance < 10
                ? 'You are very close!'
                : `About ${Math.round(distance)}m away`}
            </span>
          </div>
        )}

        {direction && (
          <p className="text-gray-600">
            Head {direction} to find the treasure
          </p>
        )}

        <p className="text-sm text-indigo-700">
          You&apos;re getting closer to discovering this treasure!
        </p>
      </div>
    </div>
  )
}

// Helper function to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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

// Helper function to calculate direction
function calculateDirection(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const λ1 = (lon1 * Math.PI) / 180
  const λ2 = (lon2 * Math.PI) / 180

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1)
  const θ = Math.atan2(y, x)
  const bearing = ((θ * 180) / Math.PI + 360) % 360

  // Convert bearing to cardinal direction
  const directions = [
    'north',
    'northeast',
    'east',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
  ]
  const index = Math.round(bearing / 45) % 8
  return directions[index]
} 