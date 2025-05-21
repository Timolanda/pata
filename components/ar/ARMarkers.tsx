// components/ar/ARMarkers.tsx
'use client'

import { MARKER_BASED_TREASURES } from './locations/treasureLocations'

interface ARMarkersProps {
  onMarkerFound: (markerId: string) => void
  onMarkerLost: (markerId: string) => void
}

// Custom marker configuration
const customMarkers = {
  'marker-0': {
    patternUrl: '/markers/pattern-0.patt',
    imageUrl: '/markers/pattern-0.png'
  },
  'marker-1': {
    patternUrl: '/markers/pattern-1.patt',
    imageUrl: '/markers/pattern-1.png'
  },
  'marker-2': {
    patternUrl: '/markers/pattern-2.patt',
    imageUrl: '/markers/pattern-2.png'
  }
} as const

// Type for marker keys
type MarkerKey = keyof typeof customMarkers

export function ARMarkers({ onMarkerFound, onMarkerLost }: ARMarkersProps) {
  return (
    <>
      {MARKER_BASED_TREASURES.map((treasure) => {
        // Ensure targetIndex is defined and valid
        if (treasure.targetIndex === undefined) return null
        
        const markerKey = `marker-${treasure.targetIndex}` as MarkerKey
        
        // Check if the marker exists in our configuration
        if (!(markerKey in customMarkers)) {
          console.warn(`Marker configuration not found for index ${treasure.targetIndex}`)
          return null
        }

        return (
          <a-marker
            key={treasure.id}
            type="pattern"
            preset="custom"
            url={customMarkers[markerKey].patternUrl}
            id={markerKey}
            emitevents="true"
            onMarkerFound={() => onMarkerFound(treasure.id)}
            onMarkerLost={() => onMarkerLost(treasure.id)}
          >
            <a-entity
              id={treasure.id}
              gltf-model={treasure.model}
              scale="1 1 1"
              rotation="0 180 0"
              animation="property: position; to: 0 1.2 0; dir: alternate; dur: 2000; loop: true"
            />
          </a-marker>
        )
      })}
    </>
  )
}