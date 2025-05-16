import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Player, Treasure } from '../types/game';

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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapRef.current && currentPosition) {
      // Initialize map
      mapRef.current = L.map('treasure-map').setView(
        [currentPosition.latitude, currentPosition.longitude],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Custom marker icons
      const treasureIcon = L.icon({
        iconUrl: '/images/treasure-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const playerIcon = L.icon({
        iconUrl: '/images/player-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Add treasure markers
      treasures.forEach(treasure => {
        if (treasure.latitude && treasure.longitude) {
          const marker = L.marker([treasure.latitude, treasure.longitude], {
            icon: treasureIcon
          })
            .bindPopup(
              `<b>${treasure.name}</b><br>${treasure.hint || 'No hint available'}`
            )
            .on('click', () => onTreasureClick?.(treasure));

          marker.addTo(mapRef.current!);
          markersRef.current[`treasure-${treasure.id}`] = marker;
        }
      });

      // Add player markers
      players.forEach(player => {
        if (player.position) {
          const marker = L.marker(
            [player.position.latitude, player.position.longitude],
            { icon: playerIcon }
          ).bindPopup(`<b>${player.username}</b><br>Score: ${player.score}`);

          marker.addTo(mapRef.current!);
          markersRef.current[`player-${player.id}`] = marker;
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when positions change
  useEffect(() => {
    if (!mapRef.current) return;

    // Update player positions
    players.forEach(player => {
      const markerId = `player-${player.id}`;
      const marker = markersRef.current[markerId];

      if (marker && player.position) {
        marker.setLatLng([
          player.position.latitude,
          player.position.longitude
        ]);
      }
    });

    // Center map on current position if available
    if (currentPosition) {
      mapRef.current.setView(
        [currentPosition.latitude, currentPosition.longitude],
        mapRef.current.getZoom()
      );
    }
  }, [currentPosition, players]);

  return (
    <div
      id="treasure-map"
      className={`w-full h-full min-h-[300px] ${className}`}
    />
  );
}; 