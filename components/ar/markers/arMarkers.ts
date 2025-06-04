import { LocationTreasure, MarkerTreasure } from '../shared/types'
import { TREASURE_TYPES } from '../locations/treasureLocations'
import { LOCATION_BASED_TREASURES } from '../locations/treasureLocations'

export const MARKER_BASED_TREASURES: MarkerTreasure[] = [
  {
    id: 'marker-1',
    name: 'Traditional African Mask',
    model: '/models/african_mask.glb',
    points: 150,
    targetIndex: 0,
    patternUrl: '/markers/pattern-pattern-0.patt',
    patternImageUrl: '/images/markers/pattern-pattern-0.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#FFD700',
    hint: 'Look for the first mask near the entrance.',
    type: TREASURE_TYPES.MASK,
    rarity: 'common'
  },
  {
    id: 'marker-2',
    name: 'Ancient Scroll',
    model: '/models/ancient_scroll.glb',
    points: 100,
    targetIndex: 1,
    patternUrl: '/markers/pattern-pattern-1.patt',
    patternImageUrl: '/images/markers/pattern-pattern-1.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#C0C0C0',
    hint: 'Find the scroll in the main hall.',
    type: TREASURE_TYPES.SCROLL,
    rarity: 'rare'
  }
  // ... Add other marker-based treasures here
]

// Add the missing TREASURE_MARKERS export that combines location-based treasures
// with marker information for AR display
export const TREASURE_MARKERS = [
  ...MARKER_BASED_TREASURES,
  ...LOCATION_BASED_TREASURES.map(location => ({
    id: location.id,
    name: location.name,
    description: location.description,
    points: location.points,
    hint: location.hint,
    rarity: location.rarity,
    model: location.model || '/models/default_treasure.glb', // Provide default model if not exists
    color: '#FFD700', // Default color
    behavior: location.behavior,
    location: location.location
  }))
] 
