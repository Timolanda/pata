import { useEffect, useRef } from 'react';

interface Sound {
  id: string;
  src: string;
  loop?: boolean;
  volume?: number;
}

const SOUNDS: Sound[] = [
  { id: 'scan', src: '/sounds/scan.mp3', volume: 0.7 },
  { id: 'found', src: '/sounds/found.mp3', volume: 1.0 },
  { id: 'proximity', src: '/sounds/proximity_ping.mp3', volume: 0.5 },
  { id: 'background', src: '/sounds/background_hum.mp3', loop: true, volume: 0.3 }
];

export const SoundManager = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Initialize audio elements
    SOUNDS.forEach(sound => {
      const audio = new Audio(sound.src);
      audio.loop = !!sound.loop;
      audio.volume = sound.volume || 1.0;
      audioRefs.current[sound.id] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    }
  };

  const stopSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const setVolume = (id: string, volume: number) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return null; // This is a non-visual component
};

export const useSoundManager = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    }
  };

  const stopSound = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const setVolume = (id: string, volume: number) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return { playSound, stopSound, setVolume };
}; 