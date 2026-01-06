import React from 'react';
import { useApp } from '../state/AppContext';
import { useNavigate } from 'react-router-dom';
export const UploadPage = () => {
  const { setFile } = useApp();
  const navigate = useNavigate();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "audio/mpeg") {
      setFile(file);
      navigate('/sound-print');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#050810] text-white">
      <h1 className="text-6xl font-black text-[#FF003C] mb-8 italic">4B4KU5</h1>
      <div className="p-12 border-2 border-dashed border-[#00F0FF]/30 rounded-3xl hover:border-[#00F0FF] transition-all relative">
        <input type="file" accept="audio/mp3" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
        <p className="text-[#00F0FF] font-mono uppercase">Drop MP3 Ritual Seed</p>
      </div>
    </div>
  );
};
