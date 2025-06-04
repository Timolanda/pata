'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TREASURE_MARKERS } from './ar/markers/arMarkers'
import { MarkerTreasure, LocationTreasure } from './ar/shared/types'

// Define interface for location coordinates
interface Location {
  lat: number;
  lng: number;
}

// Define props interface for Map component
interface MapProps {
  userLocation: Location;
  treasureLocation: Location;
  zoom: number;
}

// Define a type for the combined treasure markers
type TreasureMarker = {
  id: string;
  name?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  // Other properties might be present but we don't need them for the map
}

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

// Component to update map view when props change
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

// Helper function to check if a marker has valid location data
function hasValidLocation(marker: any): marker is TreasureMarker & { location: { lat: number, lng: number } } {
  return marker && 
         marker.location && 
         typeof marker.location.lat === 'number' && 
         typeof marker.location.lng === 'number' &&
         !isNaN(marker.location.lat) && 
         !isNaN(marker.location.lng);
}

export function Map({ userLocation, treasureLocation, zoom }: MapProps) {
  // Set default zoom if not provided
  const mapZoom = zoom || 13;
  
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Update map view when props change */}
      <MapUpdater 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={mapZoom} 
      />
      
      {/* User location marker */}
      <Marker 
        position={[userLocation.lat, userLocation.lng]}
        icon={PlayerIcon}
      >
        <Popup>
          Your location
        </Popup>
      </Marker>
      
      {/* Treasure location marker */}
      {treasureLocation && (
        <Marker 
          position={[treasureLocation.lat, treasureLocation.lng]}
          icon={DefaultIcon}
        >
          <Popup>
            Treasure location
          </Popup>
        </Marker>
      )}
      
      {/* Render other treasure markers */}
      {TREASURE_MARKERS.filter(hasValidLocation).map((marker) => {
        // TypeScript still needs this assertion even with the filter
        const location = marker.location as { lat: number, lng: number };
        
        return (
          <Marker
            key={marker.id}
            position={[location.lat, location.lng]}
            icon={DefaultIcon}
          >
            <Popup>
              {marker.name || 'Treasure'}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  )
} 
