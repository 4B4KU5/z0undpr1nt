import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";

const MAX_MB = 50;

export function UploadPage() {
  const { setFile } = useApp();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const acceptFile = (file: File) => {
    setError(null);

    const isMp3 =
      file.type === "audio/mpeg" ||
      file.name.toLowerCase().endsWith(".mp3");

    if (!isMp3) {
      setError("Please upload an MP3 file.");
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_MB) {
      setError(`File too large. Max ${MAX_MB}MB.`);
      return;
    }

    setFile(file);
    navigate("/sound-print");
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <header className="mb-10">
          <div className="inline-block px-4 py-2 rounded-2xl border border-cyan-400/30 shadow-[0_0_40px_rgba(0,240,255,0.12)]">
            <h1 className="text-5xl font-black tracking-tight italic text-[#FF003C]">
              4B4KU5
            </h1>
          </div>
          <p className="mt-4 text-white/60 font-mono text-sm">
            Step 01 // Upload MP3 Ritual Seed
          </p>
        </header>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative rounded-3xl border-2 border-dashed border-cyan-400/25 bg-black/30 p-10 text-center"
        >
          <input
            type="file"
            accept="audio/mpeg,.mp3"
            onChange={onInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="text-5xl mb-4">💿</div>
          <div className="text-cyan-300 font-mono text-xs tracking-[0.22em] uppercase">
            Drag & drop or tap to select MP3
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-300 font-mono">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
