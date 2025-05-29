import { MarkerTreasure, TreasureType } from '../shared/types'
import { TREASURE_TYPES } from '../locations/treasureLocations'

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