import React, { useEffect } from 'react';
import AFRAME from 'aframe';

// Define the types for the props
type ARSceneProps = {
  onMarkerFound: () => void;
  onMarkerLost: () => void;
};

const ARScene: React.FC<ARSceneProps> = ({ onMarkerFound, onMarkerLost }) => {
  useEffect(() => {
    // Add event listeners for AR marker detection
    const markerFoundHandler = () => {
      onMarkerFound(); // Trigger onMarkerFound when the marker is detected
    };

    const markerLostHandler = () => {
      onMarkerLost(); // Trigger onMarkerLost when the marker is lost
    };

    // Set up event listeners for AR markers
    const scene = document.querySelector('a-scene');
    const marker = document.querySelector('a-marker');

    if (scene && marker) {
      marker.addEventListener('markerFound', markerFoundHandler);
      marker.addEventListener('markerLost', markerLostHandler);
    }

    // Cleanup the event listeners when the component is unmounted
    return () => {
      if (scene && marker) {
        marker.removeEventListener('markerFound', markerFoundHandler);
        marker.removeEventListener('markerLost', markerLostHandler);
      }
    };
  }, [onMarkerFound, onMarkerLost]);

  return (
    <a-scene embedded arjs>
      {/* Define the assets for AR */}
      <a-assets>
        {/* You can add assets here */}
      </a-assets>

      {/* Define the AR marker */}
      <a-marker preset="hiro">
        <a-entity 
          geometry="primitive: box;" 
          material="color: red;" 
          position="0 0.5 0" 
        />
      </a-marker>

      {/* Define the camera */}
      <a-entity camera="active: true"></a-entity>/
    </a-scene>
  );
};

export default ARScene;
