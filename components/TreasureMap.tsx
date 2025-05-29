'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { Player, Treasure } from '../types/game'

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('./TreasureMapInner'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[300px] bg-gray-100 flex items-center justify-center">Loading map...</div>
})

interface TreasureMapProps {
  currentPosition: { latitude: number; longitude: number } | null;
  treasures: Treasure[];
  players?: Player[];
  onTreasureClick?: (treasure: Treasure) => void;
  className?: string;
}

export const TreasureMap = ({
  currentPosition,
  treasures,
  players = [],
  onTreasureClick,
  className = ''
}: TreasureMapProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className={`w-full h-full min-h-[300px] bg-gray-100 flex items-center justify-center ${className}`}>Loading map...</div>
  }

  return (
    <div className={`w-full h-full min-h-[300px] ${className}`}>
      <MapWithNoSSR 
        currentPosition={currentPosition}
        treasures={treasures}
        players={players}
        onTreasureClick={onTreasureClick}
      />
    </div>
  )
} 
