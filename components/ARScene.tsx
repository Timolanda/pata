// components/ARScene.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { PlayerPosition, GameState, Treasure } from '@/types/game'
import { ARMarkers } from './ar/ARMarkers'
import { ARLocation } from './ar/ARLocation'
import { useSoundManager } from './SoundManager'
import { TREASURE_LOCATIONS } from './ar/locations/treasureLocations'
import { ErrorBoundary } from './ErrorBoundary'
import { ARProvider } from './ARProvider'
import * as THREE from 'three'

// Define the props interface
export interface ARSceneProps {
  onMarkerFound: () => void
  onMarkerLost: () => void
  treasures: Treasure[]
  onTreasureClaimed: (treasureId: string) => void
  claimedTreasures: string[]
  onPositionUpdate: (position: PlayerPosition) => void
}

interface SceneRef {
  getObject3D: () => THREE.Object3D
  getCamera: () => THREE.Camera
  getRenderer: () => THREE.WebGLRenderer
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
  const sceneRef = useRef<SceneRef | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    treasures: treasures,
    soundEnabled: true,
    cameraFacing: 'environment',
    showMap: false
  })
  const [userPosition, setUserPosition] = useState<PlayerPosition | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const { playSound } = useSoundManager()

  useEffect(() => {
    // Request camera permission
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission(true)
      } catch (err) {
        console.error('Camera permission error:', err)
        setCameraPermission(false)
        setError(new Error('Camera access is required for AR features'))
      }
    }

    requestCameraPermission()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && cameraPermission) {
      let watchId: number | null = null;
      
      try {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const newPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp
            }
            setUserPosition(newPosition)
            onPositionUpdate(newPosition)
          },
          (error) => {
            console.error('GPS Error:', error)
            setError(new Error(`GPS Error: ${error.message}`))
          },
          { 
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize GPS'))
      }

      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId)
        }
      }
    }
  }, [onPositionUpdate, cameraPermission])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">AR Scene Error</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (cameraPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-yellow-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-yellow-600 mb-2">Camera Access Required</h2>
          <p className="text-gray-600">Please enable camera access to use AR features.</p>
        </div>
      </div>
    )
  }

  return (
    <ARProvider>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </ARProvider>
  )
}