'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TREASURE_MARKERS } from './ar/markers/treasureMarkers'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { getNearbyTreasures, updateUserLocation } from '@/lib/supabase-client'
import { LoadingSpinner } from './ui/loading-spinner'
import { ErrorMessage } from './ui/error-message'
import { Database } from '@/lib/types/supabase'

type Treasure = Database['public']['Tables']['treasures']['Row']

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/treasure-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const PlayerIcon = L.icon({
  iconUrl: '/images/player-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/markers/marker-icon-2x.png',
  iconUrl: '/images/markers/marker-icon.png',
  shadowUrl: '/images/markers/marker-shadow.png',
})

interface MapComponentProps {
  onTreasureSelect?: (treasure: Treasure) => void
  claimedTreasures?: string[]
  showPlayerLocation?: boolean
  userId?: string
}

function LocationMarker({ 
  showPlayerLocation,
  userId,
  onLocationUpdate
}: { 
  showPlayerLocation?: boolean
  userId?: string
  onLocationUpdate?: (lat: number, lng: number) => void
}) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMap()
  const hasInitialized = useRef(false)
  const updateTimeout = useRef<NodeJS.Timeout>()
  const mapReady = useRef(false)

  // Wait for map to be ready
  useEffect(() => {
    if (map) {
      mapReady.current = true
    }
  }, [map])

  useEffect(() => {
    if (!showPlayerLocation || !mapReady.current) return

    const handleLocationFound = (e: L.LocationEvent) => {
      try {
        const newPosition = [e.latlng.lat, e.latlng.lng] as [number, number]
        
        // Only update position if it's significantly different
        if (!position || 
            Math.abs(position[0] - newPosition[0]) > 0.0001 || 
            Math.abs(position[1] - newPosition[1]) > 0.0001) {
          setPosition(newPosition)
          
          // Only fly to location if it's the first time
          if (!hasInitialized.current && map) {
            try {
              map.flyTo(e.latlng, map.getZoom())
              hasInitialized.current = true
            } catch (error) {
              console.error('Error flying to location:', error)
            }
          }
          
          // Debounce location updates
          if (userId && onLocationUpdate) {
            if (updateTimeout.current) {
              clearTimeout(updateTimeout.current)
            }
            updateTimeout.current = setTimeout(() => {
              onLocationUpdate(e.latlng.lat, e.latlng.lng)
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Error handling location found:', error)
      }
    }

    try {
      map.locate({ 
        setView: false, 
        maxZoom: 16,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      })
      
      map.on('locationfound', handleLocationFound)
      map.on('locationerror', (e) => {
        console.error('Error getting location:', e)
      })
    } catch (error) {
      console.error('Error initializing map location:', error)
    }

    return () => {
      try {
        map.off('locationfound', handleLocationFound)
        if (updateTimeout.current) {
          clearTimeout(updateTimeout.current)
        }
      } catch (error) {
        console.error('Error cleaning up map location:', error)
      }
    }
  }, [map, showPlayerLocation, userId, onLocationUpdate, position])

  if (!mapReady.current || position === null) return null

  return (
    <Marker position={position} icon={PlayerIcon}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export function MapComponent({ 
  onTreasureSelect, 
  claimedTreasures = [], 
  showPlayerLocation = true,
  userId
}: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.2921, 36.8219]) // Nairobi center
  const { data: nearbyTreasures = [], error, loading, execute } = useSupabase<Treasure[]>()
  const hasInitialized = useRef(false)
  const mapInstance = useRef<L.Map | null>(null)

  const handleLocationUpdate = useCallback(async (latitude: number, longitude: number) => {
    if (userId) {
      await updateUserLocation(userId, latitude, longitude)
    }
  }, [userId])

  useEffect(() => {
    if (showPlayerLocation && navigator.geolocation && !hasInitialized.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const newCenter = [position.coords.latitude, position.coords.longitude] as [number, number]
            setMapCenter(newCenter)
            hasInitialized.current = true
            
            // Fetch nearby treasures
            execute(async () => {
              const response = await getNearbyTreasures(
                position.coords.latitude,
                position.coords.longitude
              )
              return response.data || []
            })
          } catch (error) {
            console.error('Error updating map center:', error)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000
        }
      )
    }
  }, [showPlayerLocation, execute])

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <ErrorMessage error={error} />
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        whenReady={(map: L.Map) => {
          mapInstance.current = map.target
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Array.isArray(nearbyTreasures) && nearbyTreasures.map((treasure) => {
          const isClaimed = claimedTreasures.includes(treasure.id)
          return (
            <Marker
              key={treasure.id}
              position={[treasure.latitude, treasure.longitude]}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => onTreasureSelect?.(treasure)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{treasure.name}</h3>
                  <p className="text-sm text-gray-600">{treasure.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Hint: {treasure.hint}</p>
                  {isClaimed && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Claimed
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {showPlayerLocation && (
          <LocationMarker 
            showPlayerLocation={showPlayerLocation} 
            userId={userId}
            onLocationUpdate={handleLocationUpdate}
          />
        )}
      </MapContainer>
    </div>
  )
}
