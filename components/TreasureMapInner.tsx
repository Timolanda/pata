import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Player, Treasure } from '../types/game'

interface TreasureMapInnerProps {
  currentPosition: { latitude: number; longitude: number } | null;
  treasures: Treasure[];
  players?: Player[];
  onTreasureClick?: (treasure: Treasure) => void;
}

export default function TreasureMapInner({
  currentPosition,
  treasures,
  players = [],
  onTreasureClick
}: TreasureMapInnerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  // Add validation and logging
  useEffect(() => {
    console.log('TreasureMapInner props:', { 
      currentPosition, 
      treasuresCount: treasures.length,
      playersCount: players.length 
    });
    
    // Validate currentPosition
    if (!currentPosition || 
        typeof currentPosition.latitude !== 'number' || 
        typeof currentPosition.longitude !== 'number' ||
        isNaN(currentPosition.latitude) || 
        isNaN(currentPosition.longitude)) {
      console.warn('Invalid currentPosition:', currentPosition);
    }
    
    // Validate treasures
    treasures.forEach((treasure, index) => {
      if (!treasure.latitude || !treasure.longitude || 
          isNaN(treasure.latitude) || isNaN(treasure.longitude)) {
        console.warn(`Invalid coordinates for treasure at index ${index}:`, treasure);
      }
    });
    
    // Validate players
    players.forEach((player, index) => {
      if (!player.position?.latitude || !player.position?.longitude ||
          isNaN(player.position.latitude) || isNaN(player.position.longitude)) {
        console.warn(`Invalid coordinates for player at index ${index}:`, player);
      }
    });
  }, [currentPosition, treasures, players]);

  // Initialize map with defensive coding
  useEffect(() => {
    // Default position if currentPosition is null or invalid
    const defaultPosition = { latitude: -1.2921, longitude: 36.8219 }; // Default to Nairobi
    
    // Validate currentPosition
    const position = (currentPosition && 
                     typeof currentPosition.latitude === 'number' && 
                     typeof currentPosition.longitude === 'number' &&
                     !isNaN(currentPosition.latitude) && 
                     !isNaN(currentPosition.longitude))
                     ? currentPosition 
                     : defaultPosition;

    // Initialize map
    mapRef.current = L.map('treasure-map').setView(
      [position.latitude, position.longitude],
      15
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)

    // Custom marker icons
    const treasureIcon = L.icon({
      iconUrl: '/images/treasure-marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    const playerIcon = L.icon({
      iconUrl: '/images/player-marker.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    // Add treasure markers
    treasures.forEach(treasure => {
      if (treasure.latitude && treasure.longitude) {
        const marker = L.marker([treasure.latitude, treasure.longitude], {
          icon: treasureIcon
        })
          .bindPopup(
            `<b>${treasure.name}</b><br>${treasure.hint || 'No hint available'}`
          )
          .on('click', () => onTreasureClick?.(treasure))

        marker.addTo(mapRef.current!)
        markersRef.current[`treasure-${treasure.id}`] = marker
      }
    })

    // Add player markers
    players.forEach(player => {
      if (player.position?.latitude && player.position?.longitude) {
        const marker = L.marker(
          [player.position.latitude, player.position.longitude],
          { icon: playerIcon }
        ).bindPopup(`<b>${player.username}</b><br>Score: ${player.score}`)

        marker.addTo(mapRef.current!)
        markersRef.current[`player-${player.id}`] = marker
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [currentPosition, treasures, players, onTreasureClick])

  // Update markers when positions change
  useEffect(() => {
    if (!mapRef.current) return

    // Update player positions
    players.forEach(player => {
      if (!player.position?.latitude || !player.position?.longitude) return;
      
      const markerId = `player-${player.id}`
      const marker = markersRef.current[markerId]

      if (marker) {
        marker.setLatLng([
          player.position.latitude,
          player.position.longitude
        ])
      }
    })

    // Center map on current position if available
    if (currentPosition?.latitude && currentPosition?.longitude) {
      mapRef.current.setView(
        [currentPosition.latitude, currentPosition.longitude],
        mapRef.current.getZoom()
      )
    }
  }, [currentPosition, players])

  return <div id="treasure-map" className="w-full h-full" />
}
