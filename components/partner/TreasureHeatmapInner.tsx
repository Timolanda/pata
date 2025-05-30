"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { HeatPoint } from "./types"

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

// Sample data - in a real app, this would come from your API
const sampleHeatData: HeatPoint[] = [
  { lat: -1.2921, lng: 36.8219, intensity: 0.8, count: 124 }, // Traditional Mask
  { lat: -1.2935, lng: 36.8230, intensity: 0.6, count: 256 }, // Ancient Drum
  { lat: -1.2910, lng: 36.8200, intensity: 0.5, count: 98 },  // Tribal Necklace
  { lat: -1.2950, lng: 36.8240, intensity: 0.9, count: 42 },  // Golden Statue
  { lat: -1.2900, lng: 36.8190, intensity: 0.3, count: 78 },  // Additional point
  { lat: -1.2940, lng: 36.8210, intensity: 0.4, count: 65 },  // Additional point
  { lat: -1.2915, lng: 36.8225, intensity: 0.7, count: 112 }, // Additional point
]

// Custom component to add the heatmap layer
function HeatmapLayer({ points }: { points: HeatPoint[] }) {
  const map = useMap()
  const heatLayerRef = useRef<L.Layer | null>(null)
  
  useEffect(() => {
    if (!map) return
    
    // Convert points to the format expected by Leaflet.heat
    const heatPoints = points.map(p => [p.lat, p.lng, p.intensity * 100])
    
    // Remove existing heatmap layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
    }
    
    // Create and add the new heatmap layer
    // @ts-expect-error - Leaflet.heat doesn't have TypeScript definitions
    heatLayerRef.current = L.heatLayer(heatPoints, {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map)
    
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }
    }
  }, [map, points])
  
  return null
}

export default function TreasureHeatmapInner() {
  return (
    <MapContainer 
      center={[-1.2921, 36.8219]} // Nairobi center
      zoom={14} 
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Custom Heatmap Layer */}
      <HeatmapLayer points={sampleHeatData} />
      
      {/* Markers for specific treasures */}
      {sampleHeatData.map((point, index) => (
        <Marker
          key={index}
          position={[point.lat, point.lng]}
          icon={DefaultIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-indigo-900">Treasure Location</h3>
              <p className="text-sm text-indigo-700">Discoveries: {point.count}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}