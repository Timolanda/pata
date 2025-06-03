// components/ARScene.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import type { PlayerPosition, GameState, Treasure } from '@/types/game'
import { ARMarkers } from './ar/ARMarkers'
import { ARLocation } from './ar/ARLocation'
import { useSoundManager } from './SoundManager'
import { LOCATION_BASED_TREASURES } from './ar/locations/treasureLocations'
import { ErrorBoundary } from './ErrorBoundary'
import { ARProvider } from './ARProvider'
import { CameraToggle } from './ar/CameraToggle'
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
  const [gpsStatus, setGpsStatus] = useState<'initializing' | 'success' | 'error'>('initializing')
  const [arMode, setArMode] = useState<'marker' | 'location'>('marker')
  const { playSound } = useSoundManager()
  const gpsRetryCount = useRef(0)
  const MAX_GPS_RETRIES = 3

  useEffect(() => {
    // Request camera permission
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: gameState.cameraFacing,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission(true)
      } catch (err) {
        console.error('Camera permission error:', err)
        setCameraPermission(false)
        setError(new Error('Camera access is required for AR features'))
      }
    }

    requestCameraPermission()
  }, [gameState.cameraFacing])

  useEffect(() => {
    if (typeof window !== 'undefined' && cameraPermission) {
      let watchId: number | null = null;
      
      const startGPS = () => {
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
              setGpsStatus('success')
              gpsRetryCount.current = 0 // Reset retry count on success
            },
            (error) => {
              console.error('GPS Error:', error)
              gpsRetryCount.current += 1
              
              if (gpsRetryCount.current >= MAX_GPS_RETRIES) {
                setGpsStatus('error')
                setError(new Error(`GPS Error: ${error.message}. Please ensure location services are enabled and try again.`))
              } else {
                // Retry with different settings
                setTimeout(() => {
                  if (watchId !== null) {
                    navigator.geolocation.clearWatch(watchId)
                  }
                  startGPS()
                }, 1000)
              }
            },
            { 
              enableHighAccuracy: true,
              timeout: 10000, // Increased timeout
              maximumAge: 5000 // Allow slightly older positions
            }
          )
        } catch (err) {
          setGpsStatus('error')
          setError(err instanceof Error ? err : new Error('Failed to initialize GPS'))
        }
      }

      startGPS()

      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId)
        }
      }
    }
  }, [onPositionUpdate, cameraPermission])

  const handleCameraChange = (facingMode: 'user' | 'environment') => {
    setGameState(prev => ({
      ...prev,
      cameraFacing: facingMode
    }))
  }

  const toggleARMode = () => {
    setArMode(prev => prev === 'marker' ? 'location' : 'marker')
    playSound('switch')
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">AR Scene Error</h2>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={() => {
              setError(null)
              gpsRetryCount.current = 0
              setGpsStatus('initializing')
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
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
          <button 
            onClick={() => setCameraPermission(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Camera Access
          </button>
        </div>
      </div>
    )
  }

  if (gpsStatus === 'initializing') {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-blue-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-2">Initializing GPS</h2>
          <p className="text-gray-600">Please ensure location services are enabled and wait a moment...</p>
        </div>
      </div>
    )
  }

  return (
    <ARProvider>
      <ErrorBoundary>
        <div className="relative w-full h-full">
          <a-scene
            ref={sceneRef}
            embedded
            arjs="sourceType: webcam; 
                  debugUIEnabled: true; 
                  detectionMode: mono_and_matrix; 
                  matrixCodeType: 3x3;
                  sourceWidth: 1280;
                  sourceHeight: 720;
                  displayWidth: 1280;
                  displayHeight: 720;
                  maxDetectionRate: 60;
                  canvasWidth: 1280;
                  canvasHeight: 720;"
            renderer="antialias: true; 
                     alpha: true; 
                     precision: highp;
                     logarithmicDepthBuffer: true;"
            vr-mode-ui="enabled: false"
            ar-cors-hack
            device-orientation-permission-ui="enabled: false"
          >
            {arMode === 'marker' ? (
              <ARMarkers
                onMarkerFound={onMarkerFound}
                onMarkerLost={onMarkerLost}
              />
            ) : (
              <ARLocation
                userPosition={userPosition}
                claimedTreasures={claimedTreasures}
                onTreasureClaimed={onTreasureClaimed}
              />
            )}

            <a-entity camera look-controls="enabled: false"></a-entity>
          </a-scene>
          
          {/* Camera toggle button */}
          <CameraToggle 
            onCameraChange={handleCameraChange}
            initialFacingMode={gameState.cameraFacing}
          />
          
          {/* AR Mode toggle button */}
          <button
            onClick={toggleARMode}
            className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            {arMode === 'marker' ? 'Switch to Location AR' : 'Switch to Marker AR'}
          </button>
        </div>
      </ErrorBoundary>
    </ARProvider>
  )
}
