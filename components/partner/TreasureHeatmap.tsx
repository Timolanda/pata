"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { HeatPoint } from "./types"
import "leaflet/dist/leaflet.css"

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("./TreasureHeatmapInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-indigo-50 rounded-lg flex items-center justify-center">Loading map...</div>
})

export function TreasureHeatmap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-full w-full bg-indigo-50 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return <MapWithNoSSR />
}
