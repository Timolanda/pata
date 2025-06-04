import { useState, useEffect, useCallback } from 'react'

interface Position {
  lat: number
  lng: number
  timestamp: number
}

export const useGPS = () => {
  const [position, setPosition] = useState<Position | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const initializeGPS = useCallback(() => {
    setIsInitializing(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsInitializing(false)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp
        })
        setIsInitializing(false)
      },
      (error) => {
        let errorMessage = 'An error occurred while getting your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to use AR features'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setError(errorMessage)
        setIsInitializing(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const cleanup = initializeGPS()
    return () => {
      if (cleanup) cleanup()
    }
  }, [initializeGPS])

  return {
    position,
    error,
    isInitializing
  }
} 