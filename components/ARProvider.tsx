import { useEffect } from 'react';
import Script from 'next/script';

interface ARProviderProps {
  children: React.ReactNode;
}

export function ARProvider({ children }: ARProviderProps) {
  useEffect(() => {
    // Check if the device supports AR
    const checkARSupport = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
        } else {
          console.warn('Camera access not supported');
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
      }
    };

    checkARSupport();
  }, []);

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
} 