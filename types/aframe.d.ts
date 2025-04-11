// types/aframe.d.ts
import 'aframe';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-marker': any;
      'a-entity': any;
      'a-camera': any;
      'a-light': any;
      'a-sky': any;
      'a-text': any;
    }
  }
}

declare module 'aframe' {
  const AFRAME: any;
  export default AFRAME;
}
