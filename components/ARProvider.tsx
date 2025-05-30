import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useIsMobile } from '@/hooks/use-mobile';

interface ARProviderProps {
  children: React.ReactNode;
}

export function ARProvider({ children }: ARProviderProps) {
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if the device supports AR
    const checkARSupport = async () => {
      try {
        // Check for camera access
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            } 
          });
          stream.getTracks().forEach(track => track.stop());
          
          // Check for WebGL support
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          
          if (gl && gl instanceof WebGLRenderingContext) {
            setARSupported(true);
          } else {
            console.warn('WebGL not supported');
            setARSupported(false);
          }
        } else {
          console.warn('Camera access not supported');
          setARSupported(false);
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setARSupported(false);
      }
    };

    checkARSupport();
  }, []);

  const handleScriptsLoaded = () => {
    setScriptsLoaded(true);
    console.log('AR scripts loaded successfully');
  };

  if (arSupported === false) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-lg font-bold text-red-700">AR Not Supported</h3>
        <p className="text-red-600">
          Your device doesn't support Augmented Reality features. 
          Please ensure you have camera access and WebGL support.
        </p>
        {children}
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('A-Frame loaded')}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
        onLoad={handleScriptsLoaded}
      />
      
      {/* Add CORS headers for AR.js */}
      <Script id="ar-cors-headers">
        {`
          if (window.AFRAME) {
            AFRAME.registerComponent('ar-cors-hack', {
              init: function () {
                this.el.sceneEl.systems.material.loadImage = function (src, crossorigin) {
                  return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () { resolve(img); };
                    img.onerror = reject;
                    img.src = src;
                  });
                };
              }
            });
          }
        `}
      </Script>
      
      {children}
    </>
  );
} 
