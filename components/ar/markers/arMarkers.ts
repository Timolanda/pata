import { LocationTreasure } from '../shared/types'
import { LOCATION_BASED_TREASURES } from '../locations/treasureLocations'

// Add the missing TREASURE_MARKERS export that combines location-based treasures
// with marker information for AR display
export const TREASURE_MARKERS = LOCATION_BASED_TREASURES.map(location => ({
  id: location.id,
  model: location.model,
  color: '#FFD700', // Default color
  behavior: location.behavior,
  location: location
})) 