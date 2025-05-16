export interface Treasure {
  id: string;
  model: string;
  name: string;
  points: number;
  hint?: string;
  latitude?: number;
  longitude?: number;
  targetIndex?: number;
}

export interface PlayerPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Player {
  id: string;
  username: string;
  position: PlayerPosition;
  claimedTreasures: string[];
  score: number;
}

export interface GameState {
  players: Player[];
  treasures: Treasure[];
  soundEnabled: boolean;
  cameraFacing: 'environment' | 'user';
  showMap: boolean;
} 