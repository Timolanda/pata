// components/treasure-hunt-screen.tsx
'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Camera, X, Award, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProximityNotification } from '@/components/proximity-notification'
import type { Treasure, PlayerPosition } from '@/types/game'
import { TREASURE_LOCATIONS } from './ar/locations/treasureLocations'
import type { ARSceneProps } from '@/components/ARScene'

// Dynamically import ARScene with proper typing
const AframeScene = dynamic<ARSceneProps>(
  () => import('@/components/ARScene').then((mod) => mod.ARScene),
  { 
    ssr: false,
    loading: () => <div>Loading AR components...</div>
  }
)

export function TreasureHuntScreen() {
  // State variables
  const [scanning, setScanning] = useState(false)
  const [foundTreasure, setFoundTreasure] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [distance, setDistance] = useState(10)
  const [markerVisible, setMarkerVisible] = useState(false)
  const [claimedTreasures, setClaimedTreasures] = useState<string[]>([])
  const [currentPosition, setCurrentPosition] = useState<PlayerPosition | null>(null)
  const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null)

  // Handler functions
  const handleMarkerFound = () => {
    setMarkerVisible(true)
  }

  const handleMarkerLost = () => {
    setMarkerVisible(false)
  }

  const handleTreasureClaimed = (treasureId: string) => {
    const treasure = TREASURE_LOCATIONS.find(t => t.id === treasureId)
    if (treasure) {
      setClaimedTreasures(prev => [...prev, treasureId])
      setActiveTreasure(treasure)
      setFoundTreasure(true)
    }
  }

  const handlePositionUpdate = (position: PlayerPosition) => {
    setCurrentPosition(position)
    
    // Update distance to nearest unclaimed treasure
    const unclaimedTreasures = TREASURE_LOCATIONS.filter(t => 
      !claimedTreasures.includes(t.id) && t.latitude && t.longitude
    )
    
    if (unclaimedTreasures.length > 0) {
      const distances = unclaimedTreasures.map(treasure => {
        if (treasure.latitude && treasure.longitude) {
          const R = 6371e3 // Earth's radius in meters
          const φ1 = position.latitude * Math.PI/180
          const φ2 = treasure.latitude * Math.PI/180
          const Δφ = (treasure.latitude - position.latitude) * Math.PI/180
          const Δλ = (treasure.longitude - position.longitude) * Math.PI/180

          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                   Math.cos(φ1) * Math.cos(φ2) *
                   Math.sin(Δλ/2) * Math.sin(Δλ/2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
          return R * c
        }
        return Infinity
      })
      
      const minDistance = Math.min(...distances)
      setDistance(Math.round(minDistance))
    }
  }

  // Scanning effect
  useEffect(() => {
    if (scanning && markerVisible && !foundTreasure) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          const newValue = prev + 5
          if (newValue >= 100) {
            setScanning(false)
            setFoundTreasure(true)
            clearInterval(interval)
            return 100
          }
          return newValue
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [scanning, markerVisible, foundTreasure])

  const startScanning = () => {
    setScanning(true)
    setScanProgress(0)
  }

  const resetScan = () => {
    setFoundTreasure(false)
    setScanning(false)
    setScanProgress(0)
    setMarkerVisible(false)
    setActiveTreasure(null)
  }

  const handleDismiss = () => setFoundTreasure(false)
  const handleNavigate = () => console.log('Navigating to the treasure...')

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      {/* AR Camera View */}
      <div className="absolute inset-0 z-0">
        {!scanning && !markerVisible && (
          <Image
            src="/placeholder.svg?height=800&width=400"
            alt="Camera Placeholder"
            fill
            className="object-cover opacity-80"
          />
        )}

        {/* A-Frame Scene */}
        <AframeScene 
          onMarkerFound={handleMarkerFound}
          onMarkerLost={handleMarkerLost}
          treasures={TREASURE_LOCATIONS}
          onTreasureClaimed={handleTreasureClaimed}
          claimedTreasures={claimedTreasures}
          onPositionUpdate={handlePositionUpdate}
        />
      </div>

      {/* Rest of your component JSX */}
      {/* ... */}
    </div>
  )
}