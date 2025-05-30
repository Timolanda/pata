// components/ar/ARMarkers.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { TREASURE_MARKERS } from './markers/arMarkers'
import { LocationTreasure } from './shared/types'

// Define TreasureMarker type to match the actual structure in TREASURE_MARKERS
interface TreasureMarker {
  id: string
  model: string
  color: string
  behavior?: LocationTreasure['behavior']
  location: LocationTreasure
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  type?: string
  patternUrl?: string
  barcodeValue?: number
  matrixCodeType?: string
}

// Declare A-Frame elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-marker': any
      'a-box': any
      'a-entity': any
      'a-animation': any
    }
  }
}

interface ARMarkersProps {
  onMarkerFound: () => void
  onMarkerLost: () => void
}

export function ARMarkers({ onMarkerFound, onMarkerLost }: ARMarkersProps) {
  const markersRef = useRef<{ [key: string]: boolean }>({})
  const [activeMarkers, setActiveMarkers] = useState<string[]>([])

  useEffect(() => {
    const handleMarkerFound = (event: CustomEvent) => {
      const markerId = event.detail.target.id || event.detail.id
      if (!markersRef.current[markerId]) {
        markersRef.current[markerId] = true
        setActiveMarkers(prev => [...prev, markerId])
        onMarkerFound()
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(200)
        }
      }
    }

    const handleMarkerLost = (event: CustomEvent) => {
      const markerId = event.detail.target.id || event.detail.id
      if (markersRef.current[markerId]) {
        markersRef.current[markerId] = false
        setActiveMarkers(prev => prev.filter(id => id !== markerId))
        onMarkerLost()
      }
    }

    // Add event listeners
    document.addEventListener('markerFound', handleMarkerFound as EventListener)
    document.addEventListener('markerLost', handleMarkerLost as EventListener)

    return () => {
      // Clean up event listeners
      document.removeEventListener('markerFound', handleMarkerFound as EventListener)
      document.removeEventListener('markerLost', handleMarkerLost as EventListener)
    }
  }, [onMarkerFound, onMarkerLost])

  const renderTreasure = (marker: TreasureMarker) => {
    // Default values for position, rotation, and scale if not provided
    const position = marker.position || [0, 0.5, 0];
    const rotation = marker.rotation || [0, 0, 0];
    const scale = marker.scale || [0.5, 0.5, 0.5];
    const isActive = activeMarkers.includes(marker.id);
    
    if (marker.model) {
      return (
        <a-entity
          gltf-model={marker.model}
          position={position.join(' ')}
          rotation={rotation.join(' ')}
          scale={scale.join(' ')}
          className="clickable"
          animation={isActive ? "property: scale; to: 0.6 0.6 0.6; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate" : ""}
        >
          {isActive && (
            <a-animation
              attribute="rotation"
              to="0 360 0"
              dur="5000"
              easing="linear"
              repeat="indefinite"
            />
          )}
        </a-entity>
      )
    }

    return (
      <a-box
        position={position.join(' ')}
        rotation={rotation.join(' ')}
        scale={scale.join(' ')}
        color={marker.color}
        className="clickable"
        animation={isActive ? "property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear" : ""}
      />
    )
  }

  return (
    <>
      {TREASURE_MARKERS.map((marker: TreasureMarker) => {
        // Determine marker type
        const markerType = marker.type || (marker.patternUrl ? 'pattern' : marker.barcodeValue !== undefined ? 'barcode' : 'hiro');
        
        return (
          <a-marker
            key={marker.id}
            id={marker.id}
            type={markerType}
            url={marker.patternUrl}
            value={marker.barcodeValue}
            preset={markerType === 'hiro' ? 'hiro' : undefined}
            emitevents="true"
            raycaster="objects: .clickable"
            cursor="fuse: false; rayOrigin: mouse;"
          >
            {renderTreasure(marker)}
          </a-marker>
        )
      })}
    </>
  )
}
