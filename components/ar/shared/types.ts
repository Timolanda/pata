export type TreasureRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type TreasureType = 'mask' | 'scroll' | 'shield' | 'jewelry' | 'drum'

export interface BaseTreasure {
  id: string
  name: string
  model: string
  points: number
  hint: string
  type: TreasureType
  rarity: TreasureRarity
  description?: string
  reward?: {
    type: string
    value: number
    description: string
    rarity: TreasureRarity
    collection: string
  }
}

export interface LocationTreasure extends BaseTreasure {
  latitude: number
  longitude: number
  behavior?: {
    animation?: string
    interaction?: 'hover' | 'click' | 'touch' | 'gaze' | 'proximity'
    sound?: string
    particleEffect?: string
    timeOfDay?: 'day' | 'night' | 'any'
    weatherCondition?: 'any' | 'sunny' | 'rainy'
    requiredItems?: string[]
  }
}

export interface MarkerTreasure extends BaseTreasure {
  targetIndex: number
  patternUrl: string
  patternImageUrl: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}
