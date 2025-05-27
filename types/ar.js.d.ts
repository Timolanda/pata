declare module 'ar.js/aframe/build/aframe-ar';
declare module 'aframe' {
  // Add any specific type definitions if needed
}

// Extend JSX.IntrinsicElements to include A-Frame elements
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-camera': any;
    'a-marker': any;
    'a-assets': any;
    'a-asset-item': any;
    'a-gltf-model': any;
    'a-text': any;
  }
} 