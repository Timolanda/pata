'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { Database } from '@/lib/types/supabase'
import { LoadingSpinner } from '../ui/loading-spinner'
import { ErrorMessage } from '../ui/error-message'
import { MapComponent } from '../MapComponent'
import { TreasureCard } from './TreasureCard'
import { ProximityAlert } from './ProximityAlert'
import { CollectionProgress } from './CollectionProgress'
import { 
  getCurrentUser, 
  getNearbyTreasures, 
  getUserDiscoveredTreasures,
  subscribeToTreasureDiscoveries,
  subscribeToUserLocation
} from '@/lib/supabase-client'

type Treasure = Database['public']['Tables']['treasures']['Row']
type Discovery = Database['public']['Tables']['discoveries']['Row']
type User = Database['public']['Tables']['users']['Row']

export function TreasureHunt() {
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null)
  const [discoveredTreasures, setDiscoveredTreasures] = useState<string[]>([])
  const [nearbyTreasures, setNearbyTreasures] = useState<Treasure[]>([])
  const [showProximityAlert, setShowProximityAlert] = useState(false)
  
  const { data: user, error: userError, loading: userLoading, execute: executeUser } = useSupabase<User>()
  const { error: treasuresError, loading: treasuresLoading, execute: executeTreasures } = useSupabase()

  // Load user data
  useEffect(() => {
    executeUser(async () => {
      return await getCurrentUser()
    })
  }, [executeUser])

  // Load discovered treasures
  useEffect(() => {
    if (user?.id) {
      executeTreasures(async () => {
        const response = await getUserDiscoveredTreasures(user.id)
        if (response.data) {
          setDiscoveredTreasures(response.data.map(d => d.treasure_id))
        }
        return response
      })
    }
  }, [user?.id, executeTreasures])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return

    // Subscribe to treasure discoveries
    const discoverySubscription = subscribeToTreasureDiscoveries((discovery) => {
      if (discovery.user_id === user.id) {
        setDiscoveredTreasures(prev => [...prev, discovery.treasure_id])
      }
    })

    // Subscribe to user location updates
    const locationSubscription = subscribeToUserLocation(user.id, (location) => {
      // Check for nearby treasures
      executeTreasures(async () => {
        return await getNearbyTreasures(location.latitude, location.longitude)
      })
    })

    return () => {
      discoverySubscription.unsubscribe()
      locationSubscription.unsubscribe()
    }
  }, [user?.id, executeTreasures])

  // Handle treasure selection
  const handleTreasureSelect = (treasure: Treasure) => {
    setSelectedTreasure(treasure)
    // Check if treasure is nearby
    const isNearby = nearbyTreasures.some(t => t.id === treasure.id)
    setShowProximityAlert(isNearby)
  }

  if (userLoading || treasuresLoading) {
    return <LoadingSpinner size={48} className="h-screen" />
  }

  if (userError || treasuresError) {
    return <ErrorMessage error={userError || treasuresError!} className="h-screen" />
  }

  return (
    <div className="relative h-screen">
      {/* Map Component */}
      <div className="h-full">
        <MapComponent
          userId={user?.id}
          onTreasureSelect={handleTreasureSelect}
          claimedTreasures={discoveredTreasures}
          showPlayerLocation={true}
        />
      </div>

      {/* Treasure Card */}
      {selectedTreasure && (
        <div className="absolute bottom-4 left-4 right-4">
          <TreasureCard
            treasure={selectedTreasure}
            isDiscovered={discoveredTreasures.includes(selectedTreasure.id)}
            onClose={() => setSelectedTreasure(null)}
          />
        </div>
      )}

      {/* Proximity Alert */}
      {showProximityAlert && selectedTreasure && (
        <ProximityAlert
          treasure={selectedTreasure}
          onClose={() => setShowProximityAlert(false)}
        />
      )}

      {/* Collection Progress */}
      <div className="absolute top-4 right-4">
        <CollectionProgress
          userId={user?.id}
          discoveredCount={discoveredTreasures.length}
        />
      </div>
    </div>
  )
} 