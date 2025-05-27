// components/ar/locations/treasureLocations.ts
import { Treasure } from '@/types/game'

// Define different types of treasures
export const TREASURE_TYPES = {
  MASK: 'mask',
  SCROLL: 'scroll',
  SHIELD: 'shield',
  JEWELRY: 'jewelry',
  DRUM: 'drum'
} as const

// Define treasure locations with more details
export const TREASURE_LOCATIONS: Treasure[] = [
  // Marker-based treasures (for AR markers)
  {
    id: 'african-mask-1',
    name: 'Traditional African Mask',
    model: '/models/african_mask.glb',
    points: 150,
    targetIndex: 0,
    hint: 'Look for the first mask near the entrance.',
    type: TREASURE_TYPES.MASK,
    rarity: 'common'
  },
  {
    id: 'ancient-scroll-1',
    name: 'Ancient Scroll',
    model: '/models/ancient_scroll.glb',
    points: 100,
    targetIndex: 1,
    hint: 'Find the scroll in the main hall.',
    type: TREASURE_TYPES.SCROLL,
    rarity: 'rare'
  },
  // Location-based treasures (for GPS)
  {
    id: 'african-mask-2',
    name: 'Traditional African Mask',
    model: '/models/african_mask.glb',
    points: 150,
    latitude: -1.2921,  // Example: Nairobi National Museum
    longitude: 36.8219,
    hint: 'This treasure is located near the old library building.',
    type: TREASURE_TYPES.MASK,
    rarity: 'uncommon'
  },
  {
    id: 'tribal-shield-1',
    name: 'Tribal Shield',
    model: '/models/tribal_shield.glb',
    points: 200,
    latitude: -1.2922,
    longitude: 36.8220,
    hint: 'Look for this treasure near the garden.',
    type: TREASURE_TYPES.SHIELD,
    rarity: 'rare'
  }
]

// Helper functions for treasure management
export const getTreasuresByType = (type: Treasure['type']) => {
  return TREASURE_LOCATIONS.filter(treasure => treasure.type === type)
}

export const getTreasuresByRarity = (rarity: Treasure['rarity']) => {
  return TREASURE_LOCATIONS.filter(treasure => treasure.rarity === rarity)
}

export const getNearbyTreasures = (latitude: number, longitude: number, radius: number) => {
  return TREASURE_LOCATIONS.filter(treasure => {
    if (!treasure.latitude || !treasure.longitude) return false
    const distance = calculateDistance(
      latitude,
      longitude,
      treasure.latitude,
      treasure.longitude
    )
    return distance <= radius
  })
}

// Utility function for distance calculation
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2 - lat1) * Math.PI/180
  const Δλ = (lon2 - lon1) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// You can also organize treasures by location
export const LOCATION_BASED_TREASURES: Treasure[] = TREASURE_LOCATIONS.filter(
  treasure => treasure.latitude && treasure.longitude
)

export const MARKER_BASED_TREASURES: Treasure[] = TREASURE_LOCATIONS.filter(
  treasure => treasure.targetIndex !== undefined
)