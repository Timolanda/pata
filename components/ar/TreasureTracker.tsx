'use client'

import { useEffect, useState } from 'react'
import { LocationTreasure } from './shared/types'

interface TreasureStats {
  totalDiscovered: number
  collections: {
    [key: string]: {
      name: string
      progress: number
      total: number
      items: string[]
      completedAt?: Date
    }
  }
  rarityCounts: {
    common: number
    rare: number
    epic: number
    legendary: number
  }
  recentDiscoveries: {
    id: string
    name: string
    timestamp: Date
    reward: {
      type: string
      description: string
      rarity: string
    }
  }[]
  achievements: {
    name: string
    description: string
    progress: number
    total: number
    completed: boolean
    completedAt?: Date
  }[]
  timeStats: {
    firstDiscovery?: Date
    lastDiscovery?: Date
    totalTimeSpent: number
    averageTimeBetweenDiscoveries: number
  }
  locationStats: {
    [key: string]: {
      name: string
      discoveries: number
      lastVisited?: Date
      averageTimeSpent: number
    }
  }
}

interface TreasureTrackerProps {
  treasures: LocationTreasure[]
  playerPosition: { lat: number; lng: number }
  gpsError: string | null
}

export function TreasureTracker({ treasures, playerPosition, gpsError }: TreasureTrackerProps) {
  const [nearbyTreasures, setNearbyTreasures] = useState<LocationTreasure[]>([])
  const [stats, setStats] = useState<TreasureStats>({
    totalDiscovered: 0,
    collections: {},
    rarityCounts: {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    },
    recentDiscoveries: [],
    achievements: [
      {
        name: 'Treasure Hunter',
        description: 'Discover your first treasure',
        progress: 0,
        total: 1,
        completed: false
      },
      {
        name: 'Collection Master',
        description: 'Complete any collection',
        progress: 0,
        total: 1,
        completed: false
      },
      {
        name: 'Rarity Collector',
        description: 'Find one treasure of each rarity',
        progress: 0,
        total: 4,
        completed: false
      },
      {
        name: 'Night Explorer',
        description: 'Find 3 treasures at night',
        progress: 0,
        total: 3,
        completed: false
      }
    ],
    timeStats: {
      totalTimeSpent: 0,
      averageTimeBetweenDiscoveries: 0
    },
    locationStats: {}
  })

  // Calculate statistics when treasures change
  useEffect(() => {
    if (!treasures.length) return

    // Group by collection
    const collections: { [key: string]: any } = {}
    treasures.forEach(treasure => {
      const collection = treasure.location?.reward?.collection
      if (collection) {
        if (!collections[collection]) {
          collections[collection] = {
            name: collection,
            progress: 0,
            total: treasures.filter(t => 
              t.location?.reward?.collection === collection
            ).length,
            items: []
          }
        }
        collections[collection].progress++
        collections[collection].items.push(treasure.id)
      }
    })

    // Count by rarity
    const rarityCounts = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }
    treasures.forEach(treasure => {
      const rarityKey = treasure.rarity as keyof typeof rarityCounts;
      if (rarityKey in rarityCounts) {
        rarityCounts[rarityKey]++;
      }
    })

    // Get recent discoveries
    const recentDiscoveries = treasures
      .map(treasure => ({
        id: treasure.id,
        name: treasure.name,
        timestamp: new Date(),
        reward: treasure.location?.reward ? {
          type: treasure.location.reward.type,
          description: treasure.location.reward.description,
          rarity: String(treasure.location.reward.rarity)
        } : undefined
      }))
      .filter((discovery): discovery is { id: string; name: string; timestamp: Date; reward: { type: string; description: string; rarity: string } } => 
        discovery.reward !== undefined
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)

    // Calculate time statistics
    const timestamps = recentDiscoveries.map(d => d.timestamp.getTime())
    const timeStats = {
      firstDiscovery: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : undefined,
      lastDiscovery: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined,
      totalTimeSpent: timestamps.length > 1 ? Math.max(...timestamps) - Math.min(...timestamps) : 0,
      averageTimeBetweenDiscoveries: timestamps.length > 1 
        ? (Math.max(...timestamps) - Math.min(...timestamps)) / (timestamps.length - 1)
        : 0
    }

    // Calculate location statistics
    const locationStats: { [key: string]: any } = {}
    treasures.forEach(treasure => {
      const location = treasure.location?.name || 'Unknown Location'
      if (!locationStats[location]) {
        locationStats[location] = {
          name: location,
          discoveries: 0,
          lastVisited: undefined,
          averageTimeSpent: 0
        }
      }
      locationStats[location].discoveries++
      locationStats[location].lastVisited = new Date()
    })

    // Update achievements
    const achievements = stats.achievements.map(achievement => {
      let progress = 0
      let completed = false

      switch (achievement.name) {
        case 'Treasure Hunter':
          progress = treasures.length > 0 ? 1 : 0
          completed = progress >= achievement.total
          break
        case 'Collection Master':
          progress = Object.values(collections).some(c => c.progress === c.total) ? 1 : 0
          completed = progress >= achievement.total
          break
        case 'Rarity Collector':
          progress = Object.values(rarityCounts).filter(count => count > 0).length
          completed = progress >= achievement.total
          break
        case 'Night Explorer':
          progress = treasures.filter(t => 
            t.behavior?.timeOfDay === 'night'
          ).length
          completed = progress >= achievement.total
          break
      }

      if (completed && !achievement.completed) {
        achievement.completedAt = new Date()
      }

      return {
        ...achievement,
        progress,
        completed
      }
    })

    setStats({
      totalDiscovered: treasures.length,
      collections,
      rarityCounts,
      recentDiscoveries,
      achievements,
      timeStats,
      locationStats
    })
  }, [treasures])

  // Calculate nearby treasures
  useEffect(() => {
    if (!playerPosition?.lat || !playerPosition?.lng) return

    const TREASURE_RADIUS = 50 // meters

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371e3 // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180
      const φ2 = (lat2 * Math.PI) / 180
      const Δφ = ((lat2 - lat1) * Math.PI) / 180
      const Δλ = ((lon2 - lon1) * Math.PI) / 180

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return R * c // Distance in meters
    }

    const nearby = treasures.filter((treasure) => {
      if (!treasure.location?.lat || !treasure.location?.lng) return false
      
      const distance = calculateDistance(
        playerPosition.lat,
        playerPosition.lng,
        treasure.location.lat,
        treasure.location.lng
      )
      return distance <= TREASURE_RADIUS
    })

    setNearbyTreasures(nearby)
  }, [treasures, playerPosition])

  // Don't render anything if we don't have valid coordinates
  if (!playerPosition?.lat || !playerPosition?.lng) {
    return null
  }

  if (gpsError) {
    return (
      <div className="fixed bottom-4 left-4 right-4 p-4 bg-red-50 rounded-lg shadow-lg">
        <p className="text-red-600">{gpsError}</p>
      </div>
    )
  }

  if (nearbyTreasures.length === 0) {
    return (
      <div className="fixed bottom-4 left-4 right-4 p-4 bg-blue-50 rounded-lg shadow-lg">
        <p className="text-blue-600">No treasures nearby. Keep exploring!</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 p-4 bg-green-50 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-green-700 mb-2">Nearby Treasures</h3>
      <div className="space-y-2">
        {nearbyTreasures.map((treasure) => (
          <div key={treasure.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">{treasure.name}</p>
              <p className="text-sm text-green-600">{treasure.hint}</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {treasure.rarity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 
