// components/ar/ARLocation.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { TREASURE_MARKERS } from './markers/arMarkers'
import type { PlayerPosition } from '@/types/game'
import { useSoundManager } from '../SoundManager'
import { LocationTreasure } from './shared/types'

// Define a type for the treasure markers
interface TreasureMarker {
  id: string
  model?: string
  color?: string
  behavior?: LocationTreasure['behavior']
  location: LocationTreasure['location']
}

interface ARLocationProps {
  playerPosition: { lat: number; lng: number } | null  // Changed from userPosition to playerPosition
  claimedTreasures: string[]
  onTreasureClaimed: (treasureId: string) => void
  treasures: LocationTreasure[]
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number | undefined | null,
  lon1: number | undefined | null,
  lat2: number | undefined | null,
  lon2: number | undefined | null
): number {
  // Return Infinity if any coordinate is missing or invalid
  if (!lat1 || !lon1 || !lat2 || !lon2 || 
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return Infinity;
  }
  
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return d // Distance in meters
}

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
  );
}

export function ARLocation({
  playerPosition,  // Changed from userPosition to playerPosition
  claimedTreasures,
  onTreasureClaimed,
  treasures
}: ARLocationProps) {
  const [nearbyTreasures, setNearbyTreasures] = useState<LocationTreasure[]>([])
  const { playSound } = useSoundManager()
  const treasureCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const MAX_DISTANCE = 100 // Maximum distance in meters to show treasures

  useEffect(() => {
    // Ensure location-based AR is working correctly
    const checkNearbyTreasures = () => {
      // Ensure player position is valid
      if (!isValidCoordinate(playerPosition?.lat, playerPosition?.lng)) {
        console.log("Invalid player position:", playerPosition);
        setNearbyTreasures([]);
        return;
      }
      
      const nearby = treasures.filter(treasure => {
        // Skip already claimed treasures
        if (claimedTreasures.includes(treasure.id)) return false
        
        // Skip treasures with invalid coordinates
        if (!isValidCoordinate(treasure.location?.lat, treasure.location?.lng)) {
          console.log("Invalid treasure location:", treasure.location);
          return false;
        }

        // Calculate distance to treasure
        const distance = calculateDistance(
          playerPosition!.lat,
          playerPosition!.lng,
          treasure.location.lat,
          treasure.location.lng
        )

        console.log(`Distance to treasure ${treasure.id}: ${distance}m`);
        return distance <= MAX_DISTANCE
      })

      console.log(`Found ${nearby.length} nearby treasures`);
      setNearbyTreasures(nearby)
    }

    // Check immediately and then set interval
    checkNearbyTreasures()
    treasureCheckInterval.current = setInterval(checkNearbyTreasures, 5000)

    return () => {
      if (treasureCheckInterval.current) {
        clearInterval(treasureCheckInterval.current)
      }
    }
  }, [playerPosition, claimedTreasures, treasures])

  const handleTreasureFound = (treasureId: string) => {
    playSound('treasure')
    onTreasureClaimed(treasureId)
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200])
    }
  }

  if (!playerPosition?.lat || !playerPosition?.lng) {
    return (
      <a-entity position="0 0 -5">
        <a-box color="red" position="0 1.5 0" scale="0.5 0.5 0.5">
          <a-animation
            attribute="rotation"
            to="0 360 0"
            dur="5000"
            easing="linear"
            repeat="indefinite"
          />
        </a-box>
        <a-text
          value="Waiting for GPS signal..."
          position="0 0.7 0"
          align="center"
          color="white"
          scale="0.5 0.5 0.5"
        />
      </a-entity>
    )
  }

  // Calculate relative position with proper validation
  return (
    <>
      {nearbyTreasures.map(treasure => {
        // Ensure all coordinates are valid numbers before proceeding
        if (!playerPosition?.lat || !playerPosition?.lng || 
            !treasure.location?.lat || !treasure.location?.lng ||
            isNaN(playerPosition.lat) || isNaN(playerPosition.lng) ||
            isNaN(treasure.location.lat) || isNaN(treasure.location.lng)) {
          return null;
        }
        
        // Calculate relative position (simplified for demo)
        const latDiff = (treasure.location.lat - playerPosition.lat) * 111000 // ~111km per degree of latitude
        const lngDiff = (treasure.location.lng - playerPosition.lng) * 111000 * Math.cos(playerPosition.lat * (Math.PI / 180))
        
        // Scale down for AR view (1m in real world = 0.1 units in AR)
        const scale = 0.1
        const x = lngDiff * scale
        const z = -latDiff * scale // Negative because forward in AR is negative z
        
        return (
          <a-entity key={treasure.id} position={`${x} 0 ${z}`}>
            <a-box
              color={treasure.rarity === 'legendary' ? '#FFD700' : 
                    treasure.rarity === 'epic' ? '#9932CC' :
                    treasure.rarity === 'rare' ? '#1E90FF' : '#32CD32'}
              position="0 1 0"
              scale="0.5 0.5 0.5"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
              className="clickable"
              event-set__click={`_event: click; _callback: ${() => handleTreasureFound(treasure.id)}`}
            />
            <a-text
              value={treasure.location.name || 'Treasure'}
              position="0 1.8 0"
              align="center"
              color="white"
              scale="0.5 0.5 0.5"
            />
          </a-entity>
        )
      })}
    </>
  )
}
