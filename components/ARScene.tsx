'use client'

import 'aframe'
import { useEffect, useRef, useState } from 'react'
// Use dynamic import for AR.js to avoid fs module issues
import dynamic from 'next/dynamic'
import { TreasureMap } from './TreasureMap'
import { useSoundManager } from './SoundManager'
import { Treasure, PlayerPosition, GameState } from '../types/game'

// Remove direct AR.js import and replace with dynamic import
const ARComponent = dynamic(() => 
  import('ar.js/aframe/build/aframe-ar')
    .then(() => import('aframe'))
    .then((mod) => {
      // Return a dummy component since we just need the side effects
      return function DummyComponent() { return null }
    }),
  {
    ssr: false,
    loading: () => <div>Loading AR components...</div>
  }
)

interface ARSceneProps {
  onMarkerFound: () => void
  onMarkerLost: () => void
  treasures: Treasure[]
  onTreasureClaimed: (treasureId: string) => void
  claimedTreasures: string[]
  onPositionUpdate: (position: PlayerPosition) => void
}

const INITIAL_TREASURES: Treasure[] = [
  {
    id: 'ancient-scroll',
    name: 'Ancient Scroll',
    model: '/models/ancient_rolled_document.glb',
    points: 100,
    hint: 'An ancient scroll containing mysterious wisdom...',
    targetIndex: 0
  },
  {
    id: 'gps-treasure-1',
    name: 'Hidden Gem',
    model: '/models/ancient_rolled_document.glb',
    points: 200,
    hint: 'Look for this treasure near the fountain...',
    latitude: -1.2921,
    longitude: 36.8219
  }
]

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

const ARScene = ({ 
  onMarkerFound, 
  onMarkerLost, 
  treasures, 
  onTreasureClaimed,
  claimedTreasures,
  onPositionUpdate 
}: ARSceneProps) => {
  const sceneRef = useRef<any>(null)
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    treasures: INITIAL_TREASURES,
    soundEnabled: true,
    cameraFacing: 'environment',
    showMap: false
  })
  const [userPosition, setUserPosition] = useState<PlayerPosition | null>(null)
  const { playSound, stopSound, setVolume } = useSoundManager()

  useEffect(() => {
    // The component will load AR.js automatically
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set up GPS tracking
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

      // Set up marker detection
      const markerEls = document.querySelectorAll('a-marker')
      markerEls.forEach((el) => {
        el.addEventListener('markerFound', () => {
          playSound('scan')
          onMarkerFound()
        })
        el.addEventListener('markerLost', onMarkerLost)
      })

      return () => {
        navigator.geolocation.clearWatch(watchId)
        markerEls.forEach((el) => {
          el.removeEventListener('markerFound', onMarkerFound)
          el.removeEventListener('markerLost', onMarkerLost)
        })
      }
    }
  }, [onMarkerFound, onMarkerLost])

  // Check proximity to GPS treasures
  useEffect(() => {
    if (!userPosition) return

    treasures.forEach(treasure => {
      if (treasure.latitude && treasure.longitude && !claimedTreasures.includes(treasure.id)) {
        const distance = haversineDistance(
          userPosition.latitude,
          userPosition.longitude,
          treasure.latitude,
          treasure.longitude
        )

        const treasureEl = document.getElementById(treasure.id)
        if (treasureEl) {
          if (distance < PROXIMITY_THRESHOLD) {
            treasureEl.setAttribute('material', 'emissiveIntensity: 1; emissive: yellow')
            playSound('proximity')
          } else {
            treasureEl.setAttribute('material', 'emissiveIntensity: 0.5; emissive: blue')
          }
        }
      }
    })
  }, [userPosition, treasures, claimedTreasures])

  const handleClaimTreasure = async (treasureId: string) => {
    if (claimedTreasures.includes(treasureId)) return

    const treasure = treasures.find(t => t.id === treasureId)
    if (!treasure) return

    // For GPS treasures, verify proximity
    if (treasure.latitude && treasure.longitude && userPosition) {
      const distance = haversineDistance(
        userPosition.latitude,
        userPosition.longitude,
        treasure.latitude,
        treasure.longitude
      )
      if (distance > PROXIMITY_THRESHOLD) return
    }

    try {
      const response = await fetch('/api/claim-treasure', {
        method: 'POST',
        body: JSON.stringify({ 
          treasureId, 
          claimedAt: new Date(),
          position: userPosition 
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        playSound('found')
        onTreasureClaimed(treasureId)
        spawnCelebration(treasureId)
        
        // Update game state
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === 'current' ? {
              ...p,
              claimedTreasures: [...p.claimedTreasures, treasureId],
              score: p.score + (gameState.treasures.find(t => t.id === treasureId)?.points || 0)
            } : p
          )
        }))

        // Update treasure appearance
        const modelEl = document.getElementById(treasureId)
        if (modelEl) {
          modelEl.setAttribute('material', 'emissive: green; opacity: 0.7')
        }
      }
    } catch (error) {
      console.error('Failed to claim treasure:', error)
    }
  }

  const toggleCamera = () => {
    setGameState(prev => ({
      ...prev,
      cameraFacing: prev.cameraFacing === 'environment' ? 'user' : 'environment'
    }))
  }

  const toggleMap = () => {
    setGameState(prev => ({
      ...prev,
      showMap: !prev.showMap
    }))
  }

  const spawnCelebration = (treasureId: string) => {
    if (!sceneRef.current) return

    const celebrationText = document.createElement('a-text')
    celebrationText.setAttribute('value', `🎉 Found ${treasureId}!`)
    celebrationText.setAttribute('position', '0 2 -2')
    celebrationText.setAttribute('scale', '3 3 3')
    celebrationText.setAttribute('color', 'gold')
    celebrationText.setAttribute('animation', 'property: opacity; to: 0; dur: 3000')
    sceneRef.current.appendChild(celebrationText)
  }

  return (
    <>
      {/* UI Overlay */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-2 left-2 bg-black/50 text-white px-4 py-2 rounded pointer-events-auto">
          Treasures Found: {claimedTreasures.length} / {treasures.length}
        </div>
        
        <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
          <button
            onClick={toggleCamera}
            className="bg-black/50 text-white p-2 rounded"
          >
            📷 Switch Camera
          </button>
          <button
            onClick={toggleMap}
            className="bg-black/50 text-white p-2 rounded"
          >
            🗺️ {gameState.showMap ? 'Hide' : 'Show'} Map
          </button>
        </div>
      </div>

      {/* Map Modal */}
      {gameState.showMap && (
        <div className="fixed inset-0 bg-black/80 z-50">
          <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
            <TreasureMap
              currentPosition={userPosition}
              treasures={gameState.treasures}
              players={gameState.players}
              onTreasureClick={(treasure) => {
                toggleMap()
                // Highlight the treasure in AR view
                const el = document.getElementById(treasure.id)
                if (el) {
                  el.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dur: 1000; dir: alternate; loop: 3')
                }
              }}
              className="w-full h-full"
            />
            <button
              onClick={toggleMap}
              className="absolute top-2 right-2 bg-white/50 p-2 rounded"
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

      {/* AR Scene */}
      <a-scene
        ref={sceneRef}
        embedded
        arjs={`sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; facingMode: ${gameState.cameraFacing};`}
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true"
      >
        <a-assets>
          {gameState.treasures.map(({ id, model }) => (
            <a-asset-item key={id} id={`${id}Model`} src={model} />
          ))}
        </a-assets>

        <a-camera
          gps-camera
          rotation-reader
          position="0 0 0"
          look-controls-enabled="false"
          arjs-device-orientation-controls="smoothingFactor: 0.1"
          gps-camera-debug="enabled: false"
        />

        {/* Marker-based AR content */}
        {gameState.treasures
          .filter(t => t.targetIndex !== undefined)
          .map(({ id, targetIndex }) => (
            <a-marker key={id} preset="hiro" smooth="true" smoothCount="5">
              <a-gltf-model
                id={id}
                src={`#${id}Model`}
                scale="0.5 0.5 0.5"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
                material={`emissive: ${claimedTreasures.includes(id) ? 'green' : 'blue'}; emissiveIntensity: 0.5`}
                onClick={() => handleClaimTreasure(id)}
              />
            </a-marker>
          ))}

        {/* GPS-based AR content */}
        {gameState.treasures
          .filter(t => t.latitude && t.longitude)
          .map(({ id, latitude, longitude }) => (
            <a-entity
              key={id}
              gps-entity-place={`latitude: ${latitude}; longitude: ${longitude}`}
            >
              <a-gltf-model
                id={id}
                src={`#${id}Model`}
                scale="1 1 1"
                rotation="0 180 0"
                animation="property: position; to: 0 1.2 0; dir: alternate; dur: 2000; loop: true"
                material={`emissive: ${claimedTreasures.includes(id) ? 'green' : 'blue'}; emissiveIntensity: 0.5`}
                onClick={() => handleClaimTreasure(id)}
              />
            </a-entity>
          ))}
      </a-scene>
    </>
  )
}

export default ARScene
