export type TreasureRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type TreasureType = 'mask' | 'scroll' | 'shield' | 'jewelry' | 'drum';

export interface BaseTreasure {
  id: string;
  name: string;
  model: string;
  points: number;
  hint: string;
  type: TreasureType;
  rarity: TreasureRarity;
  description?: string;
  reward?: {
    type: string;
    value: number;
    description: string;
    rarity: TreasureRarity;
    collection: string;
  };
}

export interface LocationTreasure {
  id: string;
  name: string;
  description: string;
  hint: string;
  rarity: TreasureRarity;
  points: number;
  model?: string; // Add optional model property
  location: {
    lat: number;
    lng: number;
    name?: string;
    reward?: {
      type: string;
      value: number;
      description: string;
      rarity: TreasureRarity;
      collection: string;
    };
  };
  behavior?: {
    animation?: string;
    sound?: string;
    particleEffect?: string;
    interaction?: string;
    timeOfDay?: 'day' | 'night' | 'any';
  };
}

export interface MarkerTreasure extends BaseTreasure {
  targetIndex: number;
  patternUrl: string;
  patternImageUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  // Add location property to match the structure used in Map.tsx
  location?: {
    lat: number;
    lng: number;
    name?: string;
    reward?: {
      type: string;
      value: number;
      description: string;
      rarity: TreasureRarity;
      collection: string;
    };
  };
}
