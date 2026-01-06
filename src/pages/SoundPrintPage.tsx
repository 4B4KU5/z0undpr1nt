import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../state/AppContext';
import { useNavigate } from 'react-router-dom';
export const SoundPrintPage = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  useEffect(() => { if (!state.file) navigate('/'); }, [state.file]);
  return (
    <div className="h-screen bg-[#050810] flex items-center justify-center text-white">
      {!isStarted ? (
        <button onClick={() => setIsStarted(true)} className="text-[#00FF66] font-mono animate-pulse text-2xl">INITIATE RITUAL</button>
      ) : (
        <div className="flex gap-1 items-end h-64">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-2 bg-[#00F0FF]" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
      )}
    </div>
  );
};
