// components/ar/ARLocation.tsx
'use client'

import { Treasure, PlayerPosition } from '@/types/game'
import { LOCATION_BASED_TREASURES } from './locations/treasureLocations'

interface ARLocationProps {
  userPosition: PlayerPosition | null
  claimedTreasures: string[]
  onTreasureClaimed: (treasureId: string) => void
}

const PROXIMITY_THRESHOLD = 15 // meters

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371e3
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function ARLocation({ userPosition, claimedTreasures, onTreasureClaimed }: ARLocationProps) {
  return (
    <>
      {LOCATION_BASED_TREASURES.map((treasure) => {
        if (!userPosition) return null

        const distance = haversineDistance(
          userPosition.latitude,
          userPosition.longitude,
          treasure.latitude!,
          treasure.longitude!
        )

        const isNearby = distance < PROXIMITY_THRESHOLD
        const isClaimed = claimedTreasures.includes(treasure.id)

        return (
          <a-entity
            key={treasure.id}
            gps-entity-place={`latitude: ${treasure.latitude}; longitude: ${treasure.longitude}`}
          >
            <a-gltf-model
              id={treasure.id}
              src={treasure.model}
              scale="1 1 1"
              rotation="0 180 0"
              animation="property: position; to: 0 1.2 0; dir: alternate; dur: 2000; loop: true"
              material={`emissive: ${isClaimed ? 'green' : isNearby ? 'yellow' : 'blue'}; emissiveIntensity: ${isNearby ? 1 : 0.5}`}
              onClick={() => {
                if (isNearby && !isClaimed) {
                  onTreasureClaimed(treasure.id)
                }
              }}
            />
          </a-entity>
        )
      })}
    </>
  )
}