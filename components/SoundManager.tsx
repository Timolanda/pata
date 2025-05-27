import { useEffect, useRef, useState } from 'react';

interface Sound {
  id: string;
  src: string;
  loop?: boolean;
  volume?: number;
}

interface SoundManagerState {
  isMuted: boolean;
  globalVolume: number;
}

export const useSoundManager = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [state, setState] = useState<SoundManagerState>({
    isMuted: false,
    globalVolume: 1.0
  });

  // Initialize audio elements
  useEffect(() => {
    const sounds: Sound[] = [
      { id: 'treasure_found', src: '/sounds/treasure-found.mp3' },
      { id: 'marker_found', src: '/sounds/marker-found.mp3' },
      { id: 'background', src: '/sounds/background.mp3', loop: true }
    ];

    sounds.forEach(sound => {
      const audio = new Audio(sound.src);
      audio.loop = sound.loop || false;
      audio.volume = sound.volume || state.globalVolume;
      audioRefs.current[sound.id] = audio;
    });

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
        audio.load();
      });
      audioRefs.current = {};
    };
  }, []);

  const playSound = (id: string) => {
    try {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = state.isMuted ? 0 : state.globalVolume;
        audio.play().catch(error => {
          console.warn(`Failed to play sound ${id}:`, error);
        });
      }
    } catch (error) {
      console.error(`Error playing sound ${id}:`, error);
    }
  };

  const stopSound = (id: string) => {
    try {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (error) {
      console.error(`Error stopping sound ${id}:`, error);
    }
  };

  const setVolume = (id: string, volume: number) => {
    try {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    } catch (error) {
      console.error(`Error setting volume for sound ${id}:`, error);
    }
  };

  const toggleMute = () => {
    setState(prev => {
      const newIsMuted = !prev.isMuted;
      Object.values(audioRefs.current).forEach(audio => {
        audio.volume = newIsMuted ? 0 : prev.globalVolume;
      });
      return { ...prev, isMuted: newIsMuted };
    });
  };

  const setGlobalVolume = (volume: number) => {
    setState(prev => {
      const newVolume = Math.max(0, Math.min(1, volume));
      Object.values(audioRefs.current).forEach(audio => {
        audio.volume = prev.isMuted ? 0 : newVolume;
      });
      return { ...prev, globalVolume: newVolume };
    });
  };

  return { 
    playSound, 
    stopSound, 
    setVolume, 
    toggleMute, 
    setGlobalVolume,
    isMuted: state.isMuted,
    globalVolume: state.globalVolume
  };
}; 