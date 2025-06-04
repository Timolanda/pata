import { useState, useEffect } from 'react';

export function useAR() {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check for camera access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          stream.getTracks().forEach(track => track.stop());
          
          // Check for WebGL support
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          
          if (gl && gl instanceof WebGLRenderingContext) {
            setIsARSupported(true);
          } else {
            console.warn('WebGL not supported');
            setIsARSupported(false);
          }
        } else {
          console.warn('Camera access not supported');
          setIsARSupported(false);
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setIsARSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkARSupport();
  }, []);

  return { isARSupported, isLoading };
} 