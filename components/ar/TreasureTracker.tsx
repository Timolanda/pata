'use client'

import { useEffect, useState } from 'react'
import { TREASURE_MARKERS } from './markers/treasureMarkers'

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
  claimedTreasures: string[]
  onCollectionComplete?: (collectionName: string) => void
  onAchievementUnlocked?: (achievementName: string) => void
}

export function TreasureTracker({ 
  claimedTreasures, 
  onCollectionComplete,
  onAchievementUnlocked 
}: TreasureTrackerProps) {
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

  useEffect(() => {
    // Calculate statistics when claimed treasures change
    const discoveredTreasures = TREASURE_MARKERS.filter(treasure => 
      claimedTreasures.includes(treasure.id)
    )

    // Group by collection
    const collections: { [key: string]: any } = {}
    discoveredTreasures.forEach(treasure => {
      const collection = treasure.location.reward?.collection
      if (collection) {
        if (!collections[collection]) {
          collections[collection] = {
            name: collection,
            progress: 0,
            total: TREASURE_MARKERS.filter(t => 
              t.location.reward?.collection === collection
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
    discoveredTreasures.forEach(treasure => {
      const rarity = treasure.location.reward?.rarity
      if (rarity) {
        rarityCounts[rarity as keyof typeof rarityCounts]++
      }
    })

    // Get recent discoveries
    const recentDiscoveries = discoveredTreasures
      .map(treasure => ({
        id: treasure.id,
        name: treasure.location.name,
        timestamp: new Date(),
        reward: treasure.location.reward ? {
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
    discoveredTreasures.forEach(treasure => {
      const location = treasure.location.name
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
          progress = discoveredTreasures.length > 0 ? 1 : 0
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
          progress = discoveredTreasures.filter(t => 
            t.behavior?.timeOfDay === 'night'
          ).length
          completed = progress >= achievement.total
          break
      }

      if (completed && !achievement.completed) {
        achievement.completedAt = new Date()
        onAchievementUnlocked?.(achievement.name)
      }

      return {
        ...achievement,
        progress,
        completed
      }
    })

    setStats({
      totalDiscovered: discoveredTreasures.length,
      collections,
      rarityCounts,
      recentDiscoveries,
      achievements,
      timeStats,
      locationStats
    })

    // Check for completed collections
    Object.entries(collections).forEach(([name, collection]) => {
      if (collection.progress === collection.total) {
        collection.completedAt = new Date()
        onCollectionComplete?.(name)
      }
    })
  }, [claimedTreasures, onCollectionComplete, onAchievementUnlocked])

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-sm overflow-y-auto max-h-[80vh]">
      <h3 className="text-lg font-bold mb-2">Treasure Tracker</h3>
      
      {/* Total Discoveries */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Total Discoveries: {stats.totalDiscovered}/{TREASURE_MARKERS.length}
        </p>
      </div>

      {/* Collections Progress */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Collections</h4>
        {Object.entries(stats.collections).map(([name, collection]) => (
          <div key={name} className="mb-2">
            <div className="flex justify-between text-sm">
              <span>{collection.name}</span>
              <span>{collection.progress}/{collection.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(collection.progress / collection.total) * 100}%` }}
              />
            </div>
            {collection.completedAt && (
              <p className="text-xs text-green-600 mt-1">
                Completed: {collection.completedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Achievements</h4>
        <div className="space-y-2">
          {stats.achievements.map(achievement => (
            <div key={achievement.name} className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{achievement.name}</span>
                <span>{achievement.progress}/{achievement.total}</span>
              </div>
              <p className="text-gray-600 text-xs">{achievement.description}</p>
              {achievement.completed && (
                <p className="text-green-600 text-xs">
                  Unlocked: {achievement.completedAt?.toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rarity Distribution */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Rarity Distribution</h4>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {Object.entries(stats.rarityCounts).map(([rarity, count]) => (
            <div key={rarity} className="text-center">
              <div className="font-medium capitalize">{rarity}</div>
              <div className="text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Statistics */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Time Statistics</h4>
        <div className="text-sm space-y-1">
          {stats.timeStats.firstDiscovery && (
            <p>First Discovery: {stats.timeStats.firstDiscovery.toLocaleDateString()}</p>
          )}
          {stats.timeStats.lastDiscovery && (
            <p>Last Discovery: {stats.timeStats.lastDiscovery.toLocaleDateString()}</p>
          )}
          <p>Total Time: {Math.round(stats.timeStats.totalTimeSpent / 1000 / 60)} minutes</p>
          <p>Avg. Time Between: {Math.round(stats.timeStats.averageTimeBetweenDiscoveries / 1000 / 60)} minutes</p>
        </div>
      </div>

      {/* Location Statistics */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Location Statistics</h4>
        <div className="space-y-2">
          {Object.entries(stats.locationStats).map(([name, data]) => (
            <div key={name} className="text-sm">
              <div className="font-medium">{data.name}</div>
              <div className="text-gray-600">
                Discoveries: {data.discoveries}
                {data.lastVisited && (
                  <span className="ml-2">
                    Last Visit: {data.lastVisited.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discoveries */}
      <div>
        <h4 className="font-semibold mb-2">Recent Discoveries</h4>
        <div className="space-y-2">
          {stats.recentDiscoveries.map(discovery => (
            <div key={discovery.id} className="text-sm">
              <div className="font-medium">{discovery.name}</div>
              <div className="text-gray-600">
                {discovery.reward.description} ({discovery.reward.rarity})
              </div>
              <div className="text-xs text-gray-500">
                {discovery.timestamp.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 