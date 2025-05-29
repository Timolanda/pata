// components/ar/ARMarkers.tsx
'use client'

import { useEffect, useRef } from 'react'
import { TREASURE_MARKERS } from './markers/arMarkers'
import { LocationTreasure } from './shared/types'

// Define TreasureMarker type to match the actual structure in TREASURE_MARKERS
interface TreasureMarker {
  id: string
  model: string
  color: string
  behavior?: LocationTreasure['behavior']
  location: LocationTreasure
  // Add default values for required properties
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
    }
  }
}

interface ARMarkersProps {
  onMarkerFound: () => void
  onMarkerLost: () => void
}

export function ARMarkers({ onMarkerFound, onMarkerLost }: ARMarkersProps) {
  const markersRef = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleMarkerFound = (event: CustomEvent) => {
      const markerId = event.detail.id
      if (!markersRef.current[markerId]) {
        markersRef.current[markerId] = true
        onMarkerFound()
      }
    }

    const handleMarkerLost = (event: CustomEvent) => {
      const markerId = event.detail.id
      if (markersRef.current[markerId]) {
        markersRef.current[markerId] = false
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
    
    if (marker.model) {
      return (
        <a-entity
          gltf-model={marker.model}
          position={position.join(' ')}
          rotation={rotation.join(' ')}
          scale={scale.join(' ')}
          animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;"
        />
      )
    }

    return (
      <a-box
        position={position.join(' ')}
        rotation={rotation.join(' ')}
        scale={scale.join(' ')}
        color={marker.color}
        class="clickable"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;"
      />
    )
  }

  return (
    <>
      {TREASURE_MARKERS.map((marker: TreasureMarker) => (
        <a-marker
          key={marker.id}
          type={marker.type}
          url={marker.patternUrl}
          barcodeValue={marker.barcodeValue}
          matrixCodeType={marker.matrixCodeType}
          id={marker.id}
          emitevents="true"
          raycaster="objects: .clickable"
          cursor="fuse: false; rayOrigin: mouse;"
        >
          {renderTreasure(marker)}
        </a-marker>
      ))}
    </>
  )
}
