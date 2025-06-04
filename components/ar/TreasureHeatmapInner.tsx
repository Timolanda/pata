import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LocationTreasure } from './shared/types'

interface TreasureHeatmapInnerProps {
  treasures: LocationTreasure[]
  center: [number, number]
  zoom: number
}

export function TreasureHeatmapInner({ treasures, center, zoom }: TreasureHeatmapInnerProps) {
  const mapRef = useRef<L.Map>(null)

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom)
    }
  }, [center, zoom])

  // Filter treasures that have rewards
  const treasuresWithRewards = treasures.filter(treasure => treasure.location.reward)

  // Calculate heat intensity based on rarity
  const getHeatIntensity = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 1.0
      case 'epic':
        return 0.8
      case 'rare':
        return 0.6
      case 'uncommon':
        return 0.4
      default:
        return 0.2
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {treasuresWithRewards.map((treasure) => (
        <CircleMarker
          key={treasure.id}
          center={[treasure.location.lat, treasure.location.lng]}
          radius={10}
          pathOptions={{
            color: 'red',
            fillColor: 'red',
            fillOpacity: getHeatIntensity(treasure.rarity),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{treasure.name}</h3>
              <p>Rarity: {treasure.rarity}</p>
              <p>Points: {treasure.points}</p>
              {treasure.location.reward && (
                <>
                  <p>Reward Type: {treasure.location.reward.type}</p>
                  <p>Reward Value: {treasure.location.reward.value}</p>
                </>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
} 