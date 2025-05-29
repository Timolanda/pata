'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TREASURE_MARKERS } from './ar/markers/arMarkers'

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

export function Map() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <MapContainer
      center={[-1.2833, 36.8167]} // Nairobi coordinates
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {TREASURE_MARKERS.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.location.latitude, marker.location.longitude]}
          icon={DefaultIcon}
        >
          <Popup>
            <div>
              <h3>{marker.location.name}</h3>
              <p>{marker.location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
} 