import { useState, useEffect, useCallback } from 'react';

interface Position {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

export const useGPS = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const initializeGPS = useCallback(() => {
    setIsInitializing(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsInitializing(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Validate coordinates
        if (position.coords.latitude < -90 || position.coords.latitude > 90 ||
            position.coords.longitude < -180 || position.coords.longitude > 180) {
          setError('Invalid GPS coordinates received');
          return;
        }

        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy
        });
        setError(null);
        setIsInitializing(false);
        setRetryCount(0); // Reset retry count on success
      },
      (error) => {
        let errorMessage = 'An error occurred while getting your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to use AR features';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setIsInitializing(false);

        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            initializeGPS();
          }, 2000 * (retryCount + 1)); // Exponential backoff
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [retryCount]);

  useEffect(() => {
    const cleanup = initializeGPS();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeGPS]);

  return {
    position,
    error,
    isInitializing,
    retryCount,
    initializeGPS
  };
}; 