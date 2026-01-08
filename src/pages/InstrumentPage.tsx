import React, { createContext, useContext, useMemo, useState } from "react";

export interface SoundPrintData {
  dataUrl?: string | null;
  createdAt: string;
  durationSec?: number;
  fileName?: string;
}

interface AppState {
  file: File | null;
  soundPrintData: SoundPrintData | null;
  isSubscribed: boolean;
  step: number;
}

export type Recording = {
  id: string;
  url: string;
  blob: Blob;
  createdAt: number;
  fileName?: string;
};

type AppContextValue = {
  state: AppState;
  setFile: (f: File) => void;
  setSoundPrint: (d: SoundPrintData) => void;
  setStep: (s: number) => void;
  reset: () => void;
  // InstrumentPage requirements
  audio: {
    audioBuffer: AudioBuffer | null;
    setAudioBuffer: React.Dispatch<React.SetStateAction<AudioBuffer | null>>;
  };
  recordings: Recording[];
  saveRecording: (blob: Blob, fileName?: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    file: null,
    soundPrintData: null,
    isSubscribed: false,
    step: 1,
  });

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const value = useMemo<AppContextValue>(() => {
    const setFile = (file: File) =>
      setState((prev) => ({ ...prev, file, step: 2 }));

    const setSoundPrint = (soundPrintData: SoundPrintData) =>
      setState((prev) => ({ ...prev, soundPrintData }));

    const setStep = (step: number) =>
      setState((prev) => ({ ...prev, step }));

    const reset = () => {
      setState({
        file: null,
        soundPrintData: null,
        isSubscribed: false,
        step: 1,
      });
      setAudioBuffer(null);
    };

    const saveRecording = (blob: Blob, fileName?: string) => {
      const url = URL.createObjectURL(blob);
      const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setRecordings((prev) => [
        { id, url, blob, createdAt: Date.now(), fileName },
        ...prev,
      ]);
    };

    return {
      state,
      setFile,
      setSoundPrint,
      setStep,
      reset,
      audio: { audioBuffer, setAudioBuffer },
      recordings,
      saveRecording,
    };
  }, [state, audioBuffer, recordings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}