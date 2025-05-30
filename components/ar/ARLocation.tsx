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
  model: string
  color?: string
  behavior?: LocationTreasure['behavior']
  location: LocationTreasure
}

interface ARLocationProps {
  userPosition: PlayerPosition | null
  claimedTreasures: string[]
  onTreasureClaimed: (treasureId: string) => void
}

// Calculate distance between two points using Haversine formula
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

export function ARLocation({
  userPosition,
  claimedTreasures,
  onTreasureClaimed
}: ARLocationProps) {
  const [nearbyTreasures, setNearbyTreasures] = useState<string[]>([])
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({})
  const [activeTreasure, setActiveTreasure] = useState<string | null>(null)
  const { playSound } = useSoundManager()
  const TREASURE_RADIUS = 50 // meters

  useEffect(() => {
    if (!userPosition) return

    const treasures = TREASURE_MARKERS.filter((marker: TreasureMarker) => {
      // Skip claimed treasures
      if (claimedTreasures.includes(marker.id)) return false

      const distance = calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        marker.location.latitude,
        marker.location.longitude
      )

      return distance <= TREASURE_RADIUS
    })

    setNearbyTreasures(treasures.map((t: TreasureMarker) => t.id))
  }, [userPosition, claimedTreasures])

  const handleTreasureInteraction = (markerId: string) => {
    const marker = TREASURE_MARKERS.find((m: TreasureMarker) => m.id === markerId)
    if (!marker) return

    // Play sound if available
    if (marker.behavior?.sound) {
      playSound(marker.behavior.sound)
    }

    // Show hint
    setShowHints(prev => ({ ...prev, [markerId]: true }))

    // Set as active treasure
    setActiveTreasure(markerId)

    // Claim treasure after interaction
    onTreasureClaimed(markerId)
  }

  if (!userPosition) {
    return null
  }

  return (
    <>
      {TREASURE_MARKERS.map((marker: TreasureMarker) => {
        if (!nearbyTreasures.includes(marker.id)) return null

        return (
          <a-entity
            key={marker.id}
            id={`location-${marker.id}`}
            position="0 0 -1"
            rotation="0 0 0"
            scale="1 1 1"
            gltf-model={marker.model}
            animation={marker.behavior?.animation}
            onClick={() => handleTreasureInteraction(marker.id)}
            class={`treasure ${marker.behavior?.interaction || 'clickable'}`}
          >
            {/* Treasure Name */}
            <a-text
              value={marker.location.name}
              position="0 1 0"
              align="center"
              color="#FFFFFF"
              scale="1 1 1"
            />

            {/* Hint Text (shown when treasure is active) */}
            {showHints[marker.id] && (
              <a-text
                value={marker.location.hint}
                position="0 1.5 0"
                align="center"
                color="#FFD700"
                scale="0.8 0.8 0.8"
              />
            )}

            {/* Reward Indicator */}
            {activeTreasure === marker.id && marker.location.reward && (
              <a-entity
                position="0 2 0"
                animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true"
              >
                <a-text
                  value={`Reward: ${marker.location.reward.description}`}
                  align="center"
                  color="#00FF00"
                  scale="0.7 0.7 0.7"
                />
              </a-entity>
            )}

            {/* Particle Effects */}
            {marker.behavior?.particleEffect && (
              <a-entity
                particle-system={`preset: ${marker.behavior.particleEffect}; color: ${marker.color}`}
                position="0 0 0"
              />
            )}
          </a-entity>
        )
      })}
    </>
  )
}
