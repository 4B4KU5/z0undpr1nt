import React, { createContext, useContext, useMemo, useState } from "react";

export interface SoundPrintData {
  dataUrl?: string | null;
  createdAt: string; // ISO string
  durationSec?: number;
  fileName?: string;
}

interface AppState {
  file: File | null;
  soundPrintData: SoundPrintData | null;
  isSubscribed: boolean;
  step: number;
}

type AppContextValue = {
  state: AppState;
  setFile: (f: File) => void;
  setSoundPrint: (d: SoundPrintData) => void;
  setStep: (s: number) => void;
  reset: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    file: null,
    soundPrintData: null,
    isSubscribed: false,
    step: 1,
  });

  const value = useMemo<AppContextValue>(() => {
    const setFile = (file: File) =>
      setState((prev) => ({ ...prev, file, step: 2 }));

    const setSoundPrint = (soundPrintData: SoundPrintData) =>
      setState((prev) => ({ ...prev, soundPrintData }));

    const setStep = (step: number) =>
      setState((prev) => ({ ...prev, step }));

    const reset = () =>
      setState({
        file: null,
        soundPrintData: null,
        isSubscribed: false,
        step: 1,
      });

    return { state, setFile, setSoundPrint, setStep, reset };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
