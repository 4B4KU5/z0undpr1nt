// src/pages/SoundPrintPage.tsx
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";
import { BAND_COLORS } from "../config/bandColors";

const RITUAL_DURATION = 36; // seconds
const FFT_SIZE = 2048;
const BAND_COUNT = 36;

export function SoundPrintPage() {
  const { state, setSoundPrint, reset } = useApp();
  const navigate = useNavigate();

  // Refs for Web Audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  
  // Refs for Visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const historyRef = useRef<number[][]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RITUAL_DURATION);
  const [phase, setPhase] = useState<'waiting' | 'ritual' | 'diffusion' | 'capture'>('waiting');

  // Redirect if no file
  useEffect(() => {
    if (!state.file) navigate("/");
  }, [state.file, navigate]);

  // Create object URL for audio element
  const objectUrl = useMemo(() => {
    if (!state.file) return null;
    return URL.createObjectURL(state.file);
  }, [state.file]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // Initialize Web Audio API
  const initAudioEngine = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    // Fix for Safari/Webkit
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const analyser = ctx.createAnalyser();
    
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.82;
    
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
    frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, []);

  // Get 36-band frequency data
  const getFrequencyBands = useCallback((): number[] => {
    const analyser = analyserRef.current;
    const frequencyData = frequencyDataRef.current;
    
    if (!analyser || !frequencyData) {
      return new Array(BAND_COUNT).fill(0);
    }

    // FIX: Type assertion added here to satisfy strict TS
    analyser.getByteFrequencyData(frequencyData as any);
    
    const bands: number[] = [];
    const binCount = frequencyData.length;
    
    for (let i = 0; i < BAND_COUNT; i++) {
      // Logarithmic mapping for perceptual accuracy
      const lowFreq = Math.pow(i / BAND_COUNT, 2);
      const highFreq = Math.pow((i + 1) / BAND_COUNT, 2);
      
      const lowBin = Math.floor(lowFreq * binCount);
      const highBin = Math.min(Math.floor(highFreq * binCount), binCount - 1);
      
      let sum = 0;
      let count = 0;
      
      for (let j = lowBin; j <= highBin; j++) {
        sum += frequencyData[j];
        count++;
      }
      
      bands.push(count > 0 ? (sum / count) / 255 : 0);
    }
    
    return bands;
  }, []);

  // Start the ritual
  const startRitual = async () => {
    const el = audioRef.current;
    if (!el) return;

    try {
      initAudioEngine();
      
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      await el.play();
      setIsStarted(true);
      setPhase('ritual');
      setTimeLeft(RITUAL_DURATION);
    } catch (err) {
      console.error('Playback failed:', err);
    }
  };

  // Canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!canvas || !trailCanvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const trailCtx = trailCanvas.getContext('2d');
    if (!ctx || !trailCtx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;
    const minRadius = maxRadius * 0.12;

    const currentBands = getFrequencyBands();
    
    // Performance Note: We do NOT set React state (setBands) here anymore.
    // This keeps the loop running at 60fps without triggering React re-renders.

    // Store history for trails
    historyRef.current.push([...currentBands]);
    if (historyRef.current.length > 45) {
      historyRef.current.shift();
    }

    // Clear main canvas
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, width, height);

    // Fade trail canvas
    trailCtx.fillStyle = 'rgba(5, 8, 16, 0.04)';
    trailCtx.fillRect(0, 0, width, height);

    // Draw historical trails
    const historyLen = historyRef.current.length;
    for (let h = 0; h < historyLen; h++) {
      const historicBands = historyRef.current[h];
      const age = (historyLen - h) / historyLen;
      const trailAlpha = age * 0.12;

      for (let i = 0; i < BAND_COUNT; i++) {
        const value = historicBands[i];
        if (value < 0.08) continue;

        const { rgb } = BAND_COLORS[i];
        const radius = minRadius + (maxRadius - minRadius) * value * age;
        const startAngle = (i / BAND_COUNT) * Math.PI * 2 - Math.PI / 2;
        const endAngle = ((i + 1) / BAND_COUNT) * Math.PI * 2 - Math.PI / 2;

        trailCtx.beginPath();
        trailCtx.moveTo(centerX, centerY);
        trailCtx.arc(centerX, centerY, radius, startAngle, endAngle);
        trailCtx.closePath();
        trailCtx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${trailAlpha})`;
        trailCtx.fill();
      }
    }

    // Draw current frame bands
    for (let i = 0; i < BAND_COUNT; i++) {
      const value = currentBands[i];
      // We removed 'hex' destructuring to silence the warning
      const { rgb } = BAND_COLORS[i];
      const radius = minRadius + (maxRadius - minRadius) * value;
      const startAngle = (i / BAND_COUNT) * Math.PI * 2 - Math.PI / 2;
      const endAngle = ((i + 1) / BAND_COUNT) * Math.PI * 2 - Math.PI / 2;

      // Glow layer
      const gradient = ctx.createRadialGradient(
        centerX, centerY, minRadius,
        centerX, centerY, radius * 1.3
      );
      gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
      gradient.addColorStop(0.6, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${value * 0.5})`);
      gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius * 1.3, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core band
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.35 + value * 0.65})`;
      ctx.fill();

      // Edge highlight
      if (value > 0.15) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${value * 0.9})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Center void
    const voidGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, minRadius * 1.1
    );
    voidGradient.addColorStop(0, '#050810');
    voidGradient.addColorStop(0.85, '#050810');
    voidGradient.addColorStop(1, 'rgba(5, 8, 16, 0.7)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, minRadius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = voidGradient;
    ctx.fill();

    // Composite trail layer
    ctx.globalAlpha = 0.6;
    ctx.drawImage(trailCanvas, 0, 0);
    ctx.globalAlpha = 1;

    if (isStarted && phase !== 'capture') {
      rafRef.current = requestAnimationFrame(renderCanvas);
    }
  }, [getFrequencyBands, isStarted, phase]);

  // Start render loop when ritual begins
  useEffect(() => {
    if (isStarted && phase === 'ritual') {
      rafRef.current = requestAnimationFrame(renderCanvas);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isStarted, phase, renderCanvas]);

  // Countdown timer
  useEffect(() => {
    if (!isStarted || phase === 'capture') return;

    const startTime = Date.now();
    
    // Timer runs separately from canvas loop
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, RITUAL_DURATION - elapsed);
      
      setTimeLeft(remaining);

      if (remaining <= 6 && phase === 'ritual') {
        setPhase('diffusion');
      }

      if (remaining <= 0.1) {
        window.clearInterval(id);
        captureAndFinish();
      }
    }, 50);

    return () => window.clearInterval(id);
  }, [isStarted, phase]);

  // Capture final canvas state
  const captureAndFinish = useCallback(() => {
    setPhase('capture');
    
    const canvas = canvasRef.current;
    const el = audioRef.current;
    
    if (el) {
      el.pause();
    }

    setTimeout(() => {
      const dataUrl = canvas?.toDataURL('image/png', 1.0) ?? null;
      
      setSoundPrint({
        createdAt: new Date().toISOString(),
        durationSec: RITUAL_DURATION,
        fileName: state.file?.name,
        dataUrl,
      });

      navigate("/result");
    }, 150);
  }, [setSoundPrint, state.file?.name, navigate]);

  // Canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const trailCanvas = trailCanvasRef.current;
      if (!canvas || !trailCanvas) return;

      const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.55, 500);
      canvas.width = size;
      canvas.height = size;
      trailCanvas.width = size;
      trailCanvas.height = size;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Calculate blur intensity
  const blurIntensity = phase === 'diffusion' 
    ? Math.pow((6 - timeLeft) / 6, 1.5) * 16 
    : 0;

  // Haptic feedback
  useEffect(() => {
    if (phase === 'diffusion' && 'vibrate' in navigator) {
      const pattern = timeLeft < 3 ? [50, 30, 50] : [30];
      navigator.vibrate(pattern);
    }
  }, [phase, timeLeft]); // Note: timeLeft causes effect to run often, which is okay for haptics

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-hidden">
      {objectUrl && (
        <audio 
          ref={audioRef} 
          src={objectUrl} 
          crossOrigin="anonymous"
          className="hidden" 
        />
      )}

      {/* Tap to begin overlay */}
      {!isStarted && (
        <button
          onClick={startRitual}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#00FF66]/50 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-[#00FF66]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-[#00FF66] font-mono tracking-[0.22em] uppercase text-sm">
              Tap to begin ritual
            </div>
            <div className="mt-3 text-white/40 text-xs font-mono">
              {RITUAL_DURATION} seconds // Crystallization Mode
            </div>
          </div>
        </button>
      )}

      {/* Header */}
      <header className="px-6 pt-5 flex items-center justify-between relative z-10">
        <div className="text-[#FF003C] font-black italic text-2xl tracking-tight">
          4B4KU5
        </div>
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            reset();
            navigate("/");
          }}
          className="text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          ✕ Cancel
        </button>
      </header>

      {/* Main visualization area */}
      <main className="flex flex-col items-center justify-center px-4 pt-4">
        <div className="mb-4 text-white/50 font-mono text-xs truncate max-w-[80vw]">
          {state.file?.name ?? "—"}
        </div>

        <div className="relative">
          <canvas ref={trailCanvasRef} className="hidden" />
          
          <canvas
            ref={canvasRef}
            className="rounded-full"
            style={{
              filter: blurIntensity > 0 ? `blur(${blurIntensity}px)` : 'none',
              transition: 'filter 0.3s ease-out',
              boxShadow: `
                0 0 ${40 + blurIntensity * 2}px rgba(0, 255, 102, 0.15),
                0 0 ${80 + blurIntensity * 3}px rgba(0, 255, 102, 0.08),
                inset 0 0 60px rgba(0, 0, 0, 0.5)
              `,
            }}
          />

          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: phase === 'diffusion' ? 0 : 1, transition: 'opacity 0.5s' }}
          >
            <div className="text-center">
              <div 
                className={`font-mono text-5xl font-bold tabular-nums ${
                  timeLeft <= 6 ? 'text-[#FF003C] animate-pulse' : 'text-white/90'
                }`}
              >
                {Math.ceil(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        {/* Phase indicator dots */}
        <div className="flex gap-2 mt-6">
          {['waiting', 'ritual', 'diffusion', 'capture'].map((p) => (
            <div
              key={p}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                phase === p 
                  ? 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 border-t border-white/10 bg-[#050810]/90 backdrop-blur-md px-6 flex items-center justify-between">
        <div>
          <div className="text-[#00FF66]/70 font-mono text-[10px] tracking-[0.2em] uppercase">
            {phase === 'diffusion' ? 'Field Diffusion Active' : 'Crystallizing Sound Print'}
          </div>
          <div className="mt-2 h-1.5 w-36 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00FF66] to-[#00FF66]/60 transition-all duration-100"
              style={{ 
                width: `${((RITUAL_DURATION - timeLeft) / RITUAL_DURATION) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase">
            {phase === 'capture' ? 'Captured' : 'Time Remaining'}
          </div>
          <div 
            className={`font-mono text-2xl font-semibold tabular-nums ${
              timeLeft <= 6 ? 'text-[#FF003C]' : 'text-[#FDE047]'
            }`}
          >
            {timeLeft.toFixed(1)}s
          </div>
        </div>
      </footer>
    </div>
  );
}