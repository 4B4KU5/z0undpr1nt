import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AudioState {
  file: File | null;
  audioBuffer: AudioBuffer | null;
  isProcessing: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  recordingBlob: Blob | null; // Added this
}

interface RitualState {
  phase: 'upload' | 'ritual' | 'capture' | 'complete';
  countdown: number;
  soundPrintDataUrl: string | null;
  finalEQState: number[]; // Added this to store the visual pattern
}

interface AppContextType {
  audio: AudioState;
  state: AudioState; // Alias
  ritual: RitualState;
  setFile: (file: File) => void;
  setAudioFile: (file: File) => void;
  setAudioBuffer: (buffer: AudioBuffer) => void;
  setPlaying: (playing: boolean) => void;
  updateCurrentTime: (time: number) => void;
  setRitualPhase: (phase: RitualState['phase']) => void;
  setCountdown: (count: number) => void;
  setSoundPrint: (data: any) => void; 
  captureSoundPrint: (dataUrl: string) => void;
  saveRecording: (blob: Blob, finalEQ: number[]) => void; // Added this
  reset: () => void;
}

const initialAudioState: AudioState = {
  file: null,
  audioBuffer: null,
  isProcessing: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  recordingBlob: null,
};

const initialRitualState: RitualState = {
  phase: 'upload',
  countdown: 36,
  soundPrintDataUrl: null,
  finalEQState: [],
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [audio, setAudio] = useState<AudioState>(initialAudioState);
  const [ritual, setRitual] = useState<RitualState>(initialRitualState);

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

  const setSoundPrint = useCallback((data: any) => {
    if (data.dataUrl) captureSoundPrint(data.dataUrl);
  }, [captureSoundPrint]);

  // New function to handle the end of the instrument session
  const saveRecording = useCallback((blob: Blob, finalEQ: number[]) => {
    setAudio(prev => ({ ...prev, recordingBlob: blob }));
    setRitual(prev => ({ ...prev, finalEQState: finalEQ, phase: 'capture' }));
  }, []);

  const reset = useCallback(() => {
    setAudio(initialAudioState);
    setRitual(initialRitualState);
  }, []);

  return (
    <AppContext.Provider value={{
      audio,
      state: audio,
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
      saveRecording,
      reset,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Exporting as useApp to match your existing code
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Alias for compatibility if needed, but we will update InstrumentPage to use useApp
export const useAppContext = useApp;