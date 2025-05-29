// components/ar/locations/treasureLocations.ts
import { LocationTreasure, TreasureType } from '../shared/types'

// Define different types of treasures
export const TREASURE_TYPES = {
  MASK: 'mask' as TreasureType,
  SCROLL: 'scroll' as TreasureType,
  SHIELD: 'shield' as TreasureType,
  JEWELRY: 'jewelry' as TreasureType,
  DRUM: 'drum' as TreasureType
} as const

// Define treasure locations with more details
export const LOCATION_BASED_TREASURES: LocationTreasure[] = [
  {
    id: 'treasure-1',
    name: 'Nairobi National Museum Treasure',
    model: '/models/african_mask.glb',
    points: 150,
    latitude: -1.2701,
    longitude: 36.8121,
    hint: 'Look for the grand entrance with stone pillars',
    type: TREASURE_TYPES.MASK,
    rarity: 'common',
    description: 'Ancient African mask treasure near the museum entrance',
    reward: {
      type: 'token',
      value: 100,
      description: 'Museum Explorer Token',
      rarity: 'common',
      collection: 'cultural_heritage'
    },
    behavior: {
      animation: 'property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;',
      interaction: 'hover',
      sound: '/sounds/museum-ambience.mp3',
      particleEffect: 'gold-sparkles',
      timeOfDay: 'day',
      weatherCondition: 'any'
    }
  },
  {
    id: 'treasure-2',
    name: 'Uhuru Park Treasure',
    model: '/models/ancient_rolled_document.glb',
    points: 100,
    latitude: -1.2833,
    longitude: 36.8167,
    hint: 'Find the fountain with the tallest water jet',
    type: TREASURE_TYPES.SCROLL,
    rarity: 'common',
    description: 'Ancient scroll hidden near the central fountain',
    reward: {
      type: 'badge',
      value: 1,
      description: 'Park Explorer Badge',
      rarity: 'common',
      collection: 'park_explorer'
    },
    behavior: {
      animation: 'property: position; to: 0 1.2 0; dir: alternate; dur: 2000; loop: true',
      interaction: 'click',
      sound: '/sounds/water-flowing.mp3',
      particleEffect: 'water-splash',
      timeOfDay: 'any',
      weatherCondition: 'any'
    }
  }
]

// Helper functions for treasure management
export const getTreasuresByType = (type: TreasureType) => {
  return LOCATION_BASED_TREASURES.filter(treasure => treasure.type === type)
}

export const getTreasuresByRarity = (rarity: LocationTreasure['rarity']) => {
  return LOCATION_BASED_TREASURES.filter(treasure => treasure.rarity === rarity)
}

export const getNearbyTreasures = (latitude: number, longitude: number, radius: number) => {
  return LOCATION_BASED_TREASURES.filter(treasure => {
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