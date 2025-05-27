// components/ar/ARMarkers.tsx
'use client'

import { useEffect, useRef } from 'react'
import { TREASURE_MARKERS, TreasureMarker } from './markers/treasureMarkers'

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
    if (marker.model) {
      return (
        <a-entity
          gltf-model={marker.model}
          position={marker.position.join(' ')}
          rotation={marker.rotation.join(' ')}
          scale={marker.scale.join(' ')}
          animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;"
        />
      )
    }

    return (
      <a-box
        position={marker.position.join(' ')}
        rotation={marker.rotation.join(' ')}
        scale={marker.scale.join(' ')}
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