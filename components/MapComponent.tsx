import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  userLocation: { lat: number; lng: number }
  treasureLocation: { lat: number; lng: number }
}

export function MapComponent({ userLocation, treasureLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const userIcon = L.icon({
      iconUrl: '/user-icon.png',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })

    const treasureIcon = L.icon({
      iconUrl: '/treasure-icon.png',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: 'treasure-marker', // custom CSS class for animation
    })

    const distance = getDistance(userLocation, treasureLocation)

    // Add user marker
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)

    // Add treasure marker with highlight if close
    const treasureMarker = L.marker([treasureLocation.lat, treasureLocation.lng], {
      icon: treasureIcon,
    }).addTo(map)

    if (distance <= 0.5) {
      treasureMarker.bindPopup('You are very close! 🗝️').openPopup()
    }

    return () => map.remove()
  }, [userLocation, treasureLocation])

  return <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden shadow-md" />
}

// Helper function to calculate distance in KM
function getDistance(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371 // km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180)
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
