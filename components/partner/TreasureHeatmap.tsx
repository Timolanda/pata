"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// Dynamically import the Map component to avoid SSR issues
const TreasureHeatmapInner = dynamic(
  () => import('./TreasureHeatmapInner').then(mod => mod.default),
  { ssr: false }
)

export default function TreasureHeatmap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-full w-full bg-indigo-50 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return <TreasureHeatmapInner />
}
