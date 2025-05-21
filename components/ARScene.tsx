// components/ARScene.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { PlayerPosition, GameState, Treasure } from '@/types/game'
import { ARMarkers } from './ar/ARMarkers'
import { ARLocation } from './ar/ARLocation'
import { useSoundManager } from './SoundManager'
import { TREASURE_LOCATIONS } from './ar/locations/treasureLocations'

// Define the props interface
export interface ARSceneProps {
  onMarkerFound: () => void
  onMarkerLost: () => void
  treasures: Treasure[]
  onTreasureClaimed: (treasureId: string) => void
  claimedTreasures: string[]
  onPositionUpdate: (position: PlayerPosition) => void
}

// Export the component with the props interface
export function ARScene({ 
  onMarkerFound, 
  onMarkerLost, 
  treasures,
  onTreasureClaimed,
  claimedTreasures,
  onPositionUpdate 
}: ARSceneProps) {
  const sceneRef = useRef<any>(null)
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    treasures: treasures,  // Use the passed treasures
    soundEnabled: true,
    cameraFacing: 'environment',
    showMap: false
  })
  const [userPosition, setUserPosition] = useState<PlayerPosition | null>(null)
  const { playSound } = useSoundManager()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp
          }
          setUserPosition(newPosition)
          onPositionUpdate(newPosition)
        },
        (error) => console.error('GPS Error:', error),
        { enableHighAccuracy: true }
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [onPositionUpdate])

  return (
    <a-scene
      ref={sceneRef}
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
    >
      <ARMarkers
        onMarkerFound={onMarkerFound}
        onMarkerLost={onMarkerLost}
      />
      
      <ARLocation
        userPosition={userPosition}
        claimedTreasures={claimedTreasures}
        onTreasureClaimed={onTreasureClaimed}
      />

      <a-entity camera></a-entity>
    </a-scene>
  )
}