export interface TreasureMarker {
  id: string
  type: 'pattern' | 'barcode' | 'matrix'
  patternUrl?: string
  patternImageUrl?: string
  barcodeValue?: string
  matrixCodeType?: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  model?: string
  location: {
    name: string
    latitude: number
    longitude: number
    description: string
    hint: string
    reward: {
      type: 'token' | 'badge' | 'achievement' | 'powerup' | 'collectible' | 'key'
      value: number
      description: string
      rarity: 'common' | 'rare' | 'epic' | 'legendary'
      collection?: string
    }
  }
  behavior?: {
    animation?: string
    interaction?: string
    sound?: string
    particleEffect?: string
    specialEffect?: string
    timeOfDay?: 'day' | 'night' | 'any'
    weatherCondition?: 'sunny' | 'rainy' | 'any'
    requiredItems?: string[]
  }
  tracking?: {
    discoveryCount: number
    lastFound?: Date
    firstFound?: Date
    finders: string[]
  }
}

export const TREASURE_MARKERS: TreasureMarker[] = [
  {
    id: 'treasure-1',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-0.patt',
    patternImageUrl: '/images/markers/pattern-pattern-0.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#FFD700',
    model: '/models/african_mask.glb',
    location: {
      name: 'Nairobi National Museum',
      latitude: -1.2701,
      longitude: 36.8121,
      description: 'Ancient African mask treasure near the museum entrance',
      hint: 'Look for the grand entrance with stone pillars',
      reward: {
        type: 'token',
        value: 100,
        description: 'Museum Explorer Token',
        rarity: 'common',
        collection: 'cultural_heritage'
      }
    },
    behavior: {
      animation: 'property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear;',
      interaction: 'hover',
      sound: '/sounds/museum-ambience.mp3',
      particleEffect: 'gold-sparkles',
      specialEffect: 'glow',
      timeOfDay: 'day',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-2',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-1.patt',
    patternImageUrl: '/images/markers/pattern-pattern-1.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#C0C0C0',
    model: '/models/ancient_rolled_document.glb',
    location: {
      name: 'Uhuru Park',
      latitude: -1.2833,
      longitude: 36.8167,
      description: 'Ancient scroll hidden near the central fountain',
      hint: 'Find the fountain with the tallest water jet',
      reward: {
        type: 'badge',
        value: 1,
        description: 'Park Explorer Badge',
        rarity: 'common',
        collection: 'park_explorer'
      }
    },
    behavior: {
      animation: 'property: position; to: 0 1.2 0; dir: alternate; dur: 2000; loop: true',
      interaction: 'click',
      sound: '/sounds/water-flowing.mp3',
      particleEffect: 'water-splash',
      timeOfDay: 'any',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-3',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-2.patt',
    patternImageUrl: '/images/markers/pattern-pattern-2.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#CD7F32',
    model: '/models/ancient_scroll.glb',
    location: {
      name: 'Central Park',
      latitude: -1.2864,
      longitude: 36.8172,
      description: 'Mysterious scroll near the park benches',
      hint: 'Search near the wooden benches under the big tree',
      reward: {
        type: 'achievement',
        value: 1,
        description: 'Urban Explorer Achievement',
        rarity: 'rare',
        collection: 'urban_explorer'
      }
    },
    behavior: {
      animation: 'property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1500; loop: true',
      interaction: 'proximity',
      sound: '/sounds/rustling-leaves.mp3',
      particleEffect: 'leaf-fall',
      timeOfDay: 'any',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-4',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-0.patt',
    patternImageUrl: '/images/markers/pattern-pattern-0.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#4B0082',
    model: '/models/african_mask.glb',
    location: {
      name: 'KICC',
      latitude: -1.2875,
      longitude: 36.8233,
      description: 'Rare artifact near the iconic building',
      hint: 'Look for the distinctive cylindrical tower',
      reward: {
        type: 'token',
        value: 150,
        description: 'City Center Explorer Token',
        rarity: 'epic',
        collection: 'city_explorer'
      }
    },
    behavior: {
      animation: 'property: rotation; to: 0 180 0; dir: alternate; dur: 5000; loop: true',
      interaction: 'gaze',
      sound: '/sounds/city-ambience.mp3',
      particleEffect: 'city-lights',
      timeOfDay: 'any',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-5',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-1.patt',
    patternImageUrl: '/images/markers/pattern-pattern-1.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#006400',
    model: '/models/ancient_rolled_document.glb',
    location: {
      name: 'Nairobi Arboretum',
      latitude: -1.2733,
      longitude: 36.7983,
      description: 'Hidden scroll in the peaceful gardens',
      hint: 'Find the oldest tree in the arboretum',
      reward: {
        type: 'badge',
        value: 1,
        description: 'Nature Explorer Badge',
        rarity: 'rare',
        collection: 'nature_explorer'
      }
    },
    behavior: {
      animation: 'property: position; to: 0 0.8 0; dir: alternate; dur: 3000; loop: true',
      interaction: 'touch',
      sound: '/sounds/birds-chirping.mp3',
      particleEffect: 'butterflies',
      timeOfDay: 'day',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-6',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-2.patt',
    patternImageUrl: '/images/markers/pattern-pattern-2.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#800080',
    model: '/models/ancient_scroll.glb',
    location: {
      name: 'Nairobi Railway Museum',
      latitude: -1.2847,
      longitude: 36.8278,
      description: 'Historical scroll in the railway heritage site',
      hint: 'Search near the steam locomotive display',
      reward: {
        type: 'collectible',
        value: 1,
        description: 'Railway Heritage Scroll',
        rarity: 'rare',
        collection: 'historical_artifacts'
      }
    },
    behavior: {
      animation: 'property: position; to: 0 1.5 0; dir: alternate; dur: 3000; loop: true',
      interaction: 'proximity',
      sound: '/sounds/train-whistle.mp3',
      particleEffect: 'steam',
      timeOfDay: 'any',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-7',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-0.patt',
    patternImageUrl: '/images/markers/pattern-pattern-0.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#FF4500',
    model: '/models/african_mask.glb',
    location: {
      name: 'Nairobi National Park',
      latitude: -1.3667,
      longitude: 36.8500,
      description: 'Wildlife artifact near the main gate',
      hint: 'Look for the lion statue at the entrance',
      reward: {
        type: 'powerup',
        value: 1,
        description: 'Wildlife Vision Powerup',
        rarity: 'epic',
        collection: 'wildlife_explorer'
      }
    },
    behavior: {
      animation: 'property: scale; to: 1.3 1.3 1.3; dir: alternate; dur: 2000; loop: true',
      interaction: 'gaze',
      sound: '/sounds/lion-roar.mp3',
      particleEffect: 'wildlife',
      timeOfDay: 'day',
      weatherCondition: 'sunny',
      requiredItems: ['binoculars']
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-8',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-1.patt',
    patternImageUrl: '/images/markers/pattern-pattern-1.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#4B0082',
    model: '/models/ancient_rolled_document.glb',
    location: {
      name: 'Nairobi Gallery',
      latitude: -1.2833,
      longitude: 36.8167,
      description: 'Artistic scroll in the gallery gardens',
      hint: 'Find the sculpture garden',
      reward: {
        type: 'key',
        value: 1,
        description: 'Gallery Master Key',
        rarity: 'legendary',
        collection: 'art_collector'
      }
    },
    behavior: {
      animation: 'property: rotation; to: 0 180 0; dir: alternate; dur: 4000; loop: true',
      interaction: 'touch',
      sound: '/sounds/art-gallery.mp3',
      particleEffect: 'artistic',
      timeOfDay: 'any',
      weatherCondition: 'any',
      requiredItems: ['gallery_pass']
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-9',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-2.patt',
    patternImageUrl: '/images/markers/pattern-pattern-2.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#FF69B4',
    model: '/models/ancient_scroll.glb',
    location: {
      name: 'Nairobi Snake Park',
      latitude: -1.2701,
      longitude: 36.8121,
      description: 'Mysterious scroll near the reptile house',
      hint: 'Look for the giant python exhibit',
      reward: {
        type: 'powerup',
        value: 1,
        description: 'Snake Charmer Powerup',
        rarity: 'rare',
        collection: 'wildlife_explorer'
      }
    },
    behavior: {
      animation: 'property: rotation; to: 0 360 0; dir: alternate; dur: 3000; loop: true',
      interaction: 'proximity',
      sound: '/sounds/snake-hiss.mp3',
      particleEffect: 'snake-trail',
      timeOfDay: 'day',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-10',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-0.patt',
    patternImageUrl: '/images/markers/pattern-pattern-0.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#FFD700',
    model: '/models/african_mask.glb',
    location: {
      name: 'Nairobi Planetarium',
      latitude: -1.2733,
      longitude: 36.7983,
      description: 'Cosmic artifact in the planetarium garden',
      hint: 'Find the sundial in the garden',
      reward: {
        type: 'collectible',
        value: 1,
        description: 'Stellar Navigator',
        rarity: 'epic',
        collection: 'cosmic_explorer'
      }
    },
    behavior: {
      animation: 'property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 2000; loop: true',
      interaction: 'gaze',
      sound: '/sounds/space-ambience.mp3',
      particleEffect: 'stars',
      timeOfDay: 'night',
      weatherCondition: 'any',
      requiredItems: ['telescope']
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-11',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-1.patt',
    patternImageUrl: '/images/markers/pattern-pattern-1.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#00CED1',
    model: '/models/ancient_rolled_document.glb',
    location: {
      name: 'Nairobi Aquarium',
      latitude: -1.2847,
      longitude: 36.8278,
      description: 'Marine scroll near the coral reef exhibit',
      hint: 'Look for the largest fish tank',
      reward: {
        type: 'badge',
        value: 1,
        description: 'Ocean Explorer Badge',
        rarity: 'rare',
        collection: 'marine_explorer'
      }
    },
    behavior: {
      animation: 'property: position; to: 0 1.0 0; dir: alternate; dur: 2500; loop: true',
      interaction: 'touch',
      sound: '/sounds/ocean-waves.mp3',
      particleEffect: 'bubbles',
      timeOfDay: 'any',
      weatherCondition: 'any'
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  },
  {
    id: 'treasure-12',
    type: 'pattern',
    patternUrl: '/markers/pattern-pattern-2.patt',
    patternImageUrl: '/images/markers/pattern-pattern-2.png',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    color: '#8B4513',
    model: '/models/ancient_scroll.glb',
    location: {
      name: 'Nairobi Coffee Museum',
      latitude: -1.2833,
      longitude: 36.8167,
      description: 'Ancient coffee recipe scroll',
      hint: 'Find the original coffee roasting machine',
      reward: {
        type: 'key',
        value: 1,
        description: 'Coffee Master Key',
        rarity: 'legendary',
        collection: 'coffee_connoisseur'
      }
    },
    behavior: {
      animation: 'property: rotation; to: 0 180 0; dir: alternate; dur: 4000; loop: true',
      interaction: 'hover',
      sound: '/sounds/coffee-grinding.mp3',
      particleEffect: 'coffee-beans',
      timeOfDay: 'any',
      weatherCondition: 'any',
      requiredItems: ['coffee_cup']
    },
    tracking: {
      discoveryCount: 0,
      finders: []
    }
  }
] 