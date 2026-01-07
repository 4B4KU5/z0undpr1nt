// src/context/AppContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
// FIX: Use 'import type' for Typescript interfaces
import type { ReactNode } from 'react';

interface AudioState {
  file: File | null;
  audioBuffer: AudioBuffer | null;
  isProcessing: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface RitualState {
  phase: 'upload' | 'ritual' | 'capture' | 'complete';
  countdown: number;
  soundPrintDataUrl: string | null;
}

interface AppContextType {
  audio: AudioState;
  state: AudioState; // Alias for backward compatibility if you used 'state' elsewhere
  ritual: RitualState;
  setFile: (file: File) => void; // Explicitly named for UploadPage
  setAudioFile: (file: File) => void;
  setAudioBuffer: (buffer: AudioBuffer) => void;
  setPlaying: (playing: boolean) => void;
  updateCurrentTime: (time: number) => void;
  setRitualPhase: (phase: RitualState['phase']) => void;
  setCountdown: (count: number) => void;
  setSoundPrint: (data: any) => void; // Simplified for the result object
  captureSoundPrint: (dataUrl: string) => void;
  reset: () => void;
}

const initialAudioState: AudioState = {
  file: null,
  audioBuffer: null,
  isProcessing: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const initialRitualState: RitualState = {
  phase: 'upload',
  countdown: 36,
  soundPrintDataUrl: null,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [audio, setAudio] = useState<AudioState>(initialAudioState);
  const [ritual, setRitual] = useState<RitualState>(initialRitualState);

  // Helper to match UploadPage expectations
  const setFile = useCallback((file: File) => {
    setAudio(prev => ({ ...prev, file, isProcessing: true }));
  }, []);

  const setAudioFile = setFile;

  const setAudioBuffer = useCallback((buffer: AudioBuffer) => {
    setAudio(prev => ({ 
      ...prev, 
      audioBuffer: buffer, 
      isProcessing: false, 
      duration: buffer.duration 
    }));
  }, []);

  const setPlaying = useCallback((playing: boolean) => {
    setAudio(prev => ({ ...prev, isPlaying: playing }));
  }, []);

  const updateCurrentTime = useCallback((time: number) => {
    setAudio(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setRitualPhase = useCallback((phase: RitualState['phase']) => {
    setRitual(prev => ({ ...prev, phase }));
  }, []);

  const setCountdown = useCallback((count: number) => {
    setRitual(prev => ({ ...prev, countdown: count }));
  }, []);

  const captureSoundPrint = useCallback((dataUrl: string) => {
    setRitual(prev => ({ 
      ...prev, 
      soundPrintDataUrl: dataUrl,
      phase: 'complete' 
    }));
  }, []);

  // Placeholder for the result object structure
  const setSoundPrint = useCallback((data: any) => {
    console.log("SoundPrint Captured:", data);
    if (data.dataUrl) captureSoundPrint(data.dataUrl);
  }, [captureSoundPrint]);

  const reset = useCallback(() => {
    setAudio(initialAudioState);
    setRitual(initialRitualState);
  }, []);

  return (
    <AppContext.Provider value={{
      audio,
      state: audio, // Alias
      ritual,
      setFile,
      setAudioFile,
      setAudioBuffer,
      setPlaying,
      updateCurrentTime,
      setRitualPhase,
      setCountdown,
      setSoundPrint,
      captureSoundPrint,
      reset,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}