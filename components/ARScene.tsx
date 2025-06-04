// components/ARScene.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PlayerPosition, GameState, Treasure } from '@/types/game'
import { ARMarkers } from './ar/ARMarkers'
import { ARLocation } from './ar/ARLocation'
import { useSoundManager } from './SoundManager'
import { LOCATION_BASED_TREASURES } from './ar/locations/treasureLocations'
import { ErrorBoundary } from './ErrorBoundary'
import { ARProvider } from './ARProvider'
import { CameraToggle } from './ar/CameraToggle'
import * as THREE from 'three'
import { useAR } from '@/hooks/use-ar'
import { useGPS } from '@/hooks/use-gps'
import { LocationTreasure } from './ar/shared/types'
import { Button } from '@/components/ui/button'
import { TreasureTracker } from './ar/TreasureTracker'

// Define the props interface
export interface ARSceneProps {
  onMarkerFound?: (markerId: string) => void
  onMarkerLost?: (markerId: string) => void
  treasures?: LocationTreasure[]
  onTreasureClaimed?: (treasureId: string) => void
  claimedTreasures?: string[]
  onPositionUpdate?: (position: PlayerPosition) => void
}

interface SceneRef {
  getObject3D: () => THREE.Object3D
  getCamera: () => THREE.Camera
  getRenderer: () => THREE.WebGLRenderer
}

// Export the component with the props interface
export function ARScene({ onMarkerFound, onMarkerLost, treasures = [], onTreasureClaimed, claimedTreasures = [], onPositionUpdate }: ARSceneProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [arMode, setARMode] = useState<'marker' | 'location'>('marker')
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment')
  const { isARSupported, isLoading: isARLoading } = useAR()
  const { position: playerPosition, error: gpsError, isInitializing: isGPSInitializing, initializeGPS } = useGPS()
  const sceneRef = useRef<HTMLElement>(null)
  const { playSound } = useSoundManager()

  // Request camera permissions
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const constraints = {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 }
          }
        }

        // First try with ideal constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          stream.getTracks().forEach(track => track.stop())
          setHasCameraPermission(true)
          setCameraError(null)
        } catch (error) {
          // If ideal constraints fail, try with minimal constraints
          const fallbackConstraints = {
            video: {
              facingMode: cameraFacing
            }
          }
          const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
          stream.getTracks().forEach(track => track.stop())
          setHasCameraPermission(true)
          setCameraError(null)
        }
      } catch (error) {
        console.error('Camera permission error:', error)
        setCameraError('Camera access is required for AR features')
        setHasCameraPermission(false)
      }
    }

    requestCameraPermission()
  }, [cameraFacing])

  // Initialize GPS when in location mode
  useEffect(() => {
    if (arMode === 'location') {
      initializeGPS()
    }
  }, [arMode, initializeGPS])

  // Notify parent component of position updates
  useEffect(() => {
    if (playerPosition?.lat && playerPosition?.lng) {
      onPositionUpdate?.({
        latitude: playerPosition.lat,
        longitude: playerPosition.lng,
        timestamp: playerPosition.timestamp
      })
    }
  }, [playerPosition, onPositionUpdate])

  const handleARModeChange = useCallback((mode: 'marker' | 'location') => {
    console.log(`Switching AR mode to: ${mode}`);
    setARMode(mode)
    if (mode === 'location') {
      console.log('Initializing GPS for location-based AR');
      initializeGPS()
    }
    playSound('switch')
  }, [initializeGPS, playSound])

  const handleCameraFacingChange = useCallback((facing: 'environment' | 'user') => {
    setCameraFacing(facing)
    setHasCameraPermission(false) // Reset permission state to trigger new request
  }, [])

  if (isARLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-center">
          <p className="text-xl mb-2">Loading AR...</p>
          <p className="text-sm">Please wait while we initialize the AR experience</p>
        </div>
      </div>
    )
  }

  if (!isARSupported) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4">AR Not Supported</h2>
          <p className="mb-4">
            Your device doesn't support AR features. Please try using a different device or browser.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!hasCameraPermission) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
          <p className="mb-4">
            {cameraError || 'Please allow camera access to use AR features.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Grant Permission
          </Button>
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
                  debug: true;"
            renderer="antialias: true; 
                     alpha: true; 
                     precision: highp;
                     logarithmicDepthBuffer: true;
                     colorManagement: true;"
            vr-mode-ui="enabled: false"
            ar-cors-hack
            device-orientation-permission-ui="enabled: false"
          >
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <Button
                onClick={() => handleARModeChange('marker')}
                className={`px-4 py-2 rounded ${
                  arMode === 'marker'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Marker Mode
              </Button>
              <Button
                onClick={() => handleARModeChange('location')}
                className={`px-4 py-2 rounded ${
                  arMode === 'location'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Location Mode
              </Button>
            </div>

            <CameraToggle
              onFacingChange={handleCameraFacingChange}
              currentFacing={cameraFacing}
            />

            {arMode === 'marker' ? (
              <>
                <div className="absolute top-16 left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded">
                  Marker Mode: Point camera at markers
                </div>
                <ARMarkers
                  onMarkerFound={() => {
                    console.log('Marker found!');
                    onMarkerFound?.('marker');
                  }}
                  onMarkerLost={() => {
                    console.log('Marker lost!');
                    onMarkerLost?.('marker');
                  }}
                />
              </>
            ) : (
              <>
                {isGPSInitializing ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md w-full">
                      <h2 className="text-2xl font-bold mb-4">Initializing GPS</h2>
                      <p className="mb-4">Please wait while we initialize location services...</p>
                    </div>
                  </div>
                ) : playerPosition?.lat && playerPosition?.lng ? (
                  <>
                    <div className="absolute top-16 left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded">
                      Location Mode: GPS Active
                    </div>
                    <ARLocation
                      treasures={treasures}
                      playerPosition={playerPosition}
                      claimedTreasures={claimedTreasures || []}
                      onTreasureClaimed={(id) => {
                        console.log(`Treasure claimed: ${id}`);
                        onTreasureClaimed?.(id);
                      }}
                    />
                    <TreasureTracker
                      treasures={treasures}
                      playerPosition={playerPosition}
                      gpsError={gpsError}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-center p-6 bg-gray-800 rounded-lg max-w-md w-full">
                      <h2 className="text-2xl font-bold mb-4">GPS Required</h2>
                      <p className="mb-4">
                        {gpsError || 'Please allow location access to use location-based AR features.'}
                      </p>
                      <Button
                        onClick={() => {
                          console.log('Retrying GPS initialization');
                          initializeGPS();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Retry GPS
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            <a-entity camera look-controls="enabled: false"></a-entity>
            <a-entity id="camera" position="0 0 0" rotation="0 0 0">
              <a-entity camera look-controls="enabled: false"></a-entity>
            </a-entity>
          </a-scene>
        </div>
      </ErrorBoundary>
    </ARProvider>
  )
}
