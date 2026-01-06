import React, { createContext, useContext, useState } from 'react';
interface AppState {
  file: File | null;
  soundPrintData: any | null;
  isSubscribed: boolean;
  step: number;
}
const AppContext = createContext<{
  state: AppState;
  setFile: (f: File) => void;
  setSoundPrint: (d: any) => void;
  setStep: (s: number) => void;
} | undefined>(undefined);
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({ file: null, soundPrintData: null, isSubscribed: false, step: 1 });
  const setFile = (file: File) => setState(prev => ({ ...prev, file, step: 2 }));
  const setSoundPrint = (soundPrintData: any) => setState(prev => ({ ...prev, soundPrintData }));
  const setStep = (step: number) => setState(prev => ({ ...prev, step }));
  return <AppContext.Provider value={{ state, setFile, setSoundPrint, setStep }}>{children}</AppContext.Provider>;
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
