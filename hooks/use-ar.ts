import { useState, useEffect } from 'react';

export function useAR() {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check for camera access with more specific constraints
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const constraints = {
            video: {
              facingMode: 'environment',
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              aspectRatio: { ideal: 1.777777778 }
            }
          };

          try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            // Test if we can actually get video frames
            const video = document.createElement('video');
            video.srcObject = stream;
            await new Promise((resolve, reject) => {
              video.onloadedmetadata = resolve;
              video.onerror = reject;
            });
            stream.getTracks().forEach(track => track.stop());
            
            // Check for WebGL support
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl && gl instanceof WebGLRenderingContext) {
              setIsARSupported(true);
              setCameraError(null);
            } else {
              console.warn('WebGL not supported');
              setCameraError('WebGL is not supported on your device');
              setIsARSupported(false);
            }
          } catch (error) {
            console.error('Camera access error:', error);
            setCameraError('Could not access camera. Please ensure camera permissions are granted.');
            setIsARSupported(false);
          }
        } else {
          console.warn('Camera access not supported');
          setCameraError('Camera access is not supported on your device');
          setIsARSupported(false);
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setCameraError('Failed to initialize AR features');
        setIsARSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkARSupport();
  }, []);

  return { isARSupported, isLoading, cameraError };
} 