"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"
import { LOCATION_BASED_TREASURES } from '../ar/locations/treasureLocations'
import type { LocationTreasure } from '../ar/shared/types'

// Define heat layer types
interface HeatLayerOptions {
  minOpacity?: number;
  maxZoom?: number;
  max?: number;
  radius?: number;
  blur?: number;
  gradient?: { [key: number]: string };
}

// Extend Leaflet types
declare module 'leaflet' {
  function heatLayer(latlngs: [number, number, number][], options?: HeatLayerOptions): any;
}

// Fix for default marker icons in Leaflet with Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/markers/marker-icon-2x.png",
  iconUrl: "/images/markers/marker-icon.png",
  shadowUrl: "/images/markers/marker-shadow.png",
})

const DefaultIcon = L.icon({
  iconUrl: "/images/treasure-marker.png",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
})

export default function TreasureHeatmapInner() {
  const mapRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize the map
    const map = L.map(mapContainerRef.current).setView([0, 0], 2)
    mapRef.current = map

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Convert treasure locations to heat points
    const heatPoints: [number, number, number][] = LOCATION_BASED_TREASURES
      .filter(treasure => treasure.reward) // Filter out treasures without rewards
      .map(treasure => [
        treasure.latitude,
        treasure.longitude,
        getIntensityFromRarity(treasure.reward!.rarity)
      ] as [number, number, number])

    // Create and add the new heatmap layer
    heatLayerRef.current = L.heatLayer(heatPoints, {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map)

    // Fit map to show all points
    const bounds = L.latLngBounds(heatPoints.map(point => [point[0], point[1]]))
    map.fitBounds(bounds)

    // Add markers for each treasure
    LOCATION_BASED_TREASURES
      .filter(treasure => treasure.reward) // Filter out treasures without rewards
      .forEach(treasure => {
        const marker = L.marker([treasure.latitude, treasure.longitude], { icon: DefaultIcon })
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${treasure.name}</h3>
              <p>${treasure.description}</p>
              <p class="mt-1">Rarity: ${treasure.reward!.rarity}</p>
              <p>Points: ${treasure.reward!.value}</p>
            </div>
          `)
        marker.addTo(map)
      })

    return () => {
      map.remove()
      mapRef.current = null
      heatLayerRef.current = null
    }
  }, [])

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[400px] rounded-lg shadow-lg relative z-0"
    />
  )
}

// Helper function to convert rarity to intensity
function getIntensityFromRarity(rarity: string): number {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 0.3
    case 'uncommon':
      return 0.5
    case 'rare':
      return 0.7
    case 'epic':
      return 0.85
    case 'legendary':
      return 1.0
    default:
      return 0.5
  }
}