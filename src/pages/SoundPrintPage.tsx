import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";

export function SoundPrintPage() {
  const { state, setSoundPrint, reset } = useApp();
  const navigate = useNavigate();

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isStarted, setIsStarted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  React.useEffect(() => {
    if (!state.file) navigate("/");
  }, [state.file, navigate]);

  const objectUrl = React.useMemo(() => {
    if (!state.file) return null;
    return URL.createObjectURL(state.file);
  }, [state.file]);

  React.useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const startRitual = async () => {
    const el = audioRef.current;
    if (!el) return;

    try {
      await el.play();
      setIsStarted(true);
    } catch {
      // user gesture is required; tap again if needed
    }
  };

  // simple countdown + finish handler
  React.useEffect(() => {
    if (!isStarted) return;

    const id = window.setInterval(() => {
      const el = audioRef.current;
      if (!el || !Number.isFinite(el.duration)) return;

      const remaining = Math.max(0, el.duration - el.currentTime);
      setTimeLeft(remaining);

      if (remaining <= 0.25) {
        window.clearInterval(id);

        setSoundPrint({
          createdAt: new Date().toISOString(),
          durationSec: Math.round(el.duration),
          fileName: state.file?.name,
          // placeholder: later we capture canvas / analyser output
          dataUrl: null,
        });

        navigate("/login"); // next step later; for now you can add the route
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [isStarted, navigate, setSoundPrint, state.file?.name]);

  const bands = Array.from({ length: 36 });

  const getBandColor = (i: number) => {
    const colors = [
      "#00FF66",
      "#FDE047",
      "#FF4E00",
      "#FF003C",
      "#FF00FF",
      "#3B82F6",
      "#00F0FF",
      "#8B5CF6",
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {objectUrl && <audio ref={audioRef} src={objectUrl} className="hidden" />}

      {!isStarted && (
        <button
          onClick={startRitual}
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="text-[#00FF66] font-mono tracking-[0.22em] uppercase">
              Tap to begin ritual
            </div>
            <div className="mt-3 text-white/40 text-xs font-mono">
              Step 02 // Performance Mode
            </div>
          </div>
        </button>
      )}

      <header className="px-6 pt-6 flex items-center justify-between">
        <div className="text-[#FF003C] font-black italic text-2xl">4B4KU5</div>
        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="text-xs font-mono text-white/60 hover:text-white"
        >
          Start Over
        </button>
      </header>

      <main className="px-4 sm:px-8 pt-10 pb-28">
        <div className="mb-4 text-white/60 font-mono text-xs">
          Now Playing: {state.file?.name ?? "—"}
        </div>

        <div className="flex items-end gap-1 h-[62vh]">
          {bands.map((_, i) => (
            <div key={i} className="flex-1">
              <div className="relative h-full rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className="absolute bottom-0 w-full transition-all duration-75"
                  style={{
                    height: `${Math.random() * 55 + 10}%`,
                    backgroundColor: getBandColor(i),
                    boxShadow: `0 0 16px ${getBandColor(i)}88`,
                    filter: timeLeft < 36 ? "blur(10px)" : "none",
                    borderRadius: timeLeft < 6 ? "0px" : "999px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-24 border-t border-cyan-400/20 bg-black/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div>
          <div className="text-cyan-300 font-mono text-[10px] tracking-[0.22em] uppercase">
            Live Haptic Feedback
          </div>
          <div className="mt-2 h-1 w-44 bg-cyan-300/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-cyan-300 animate-pulse" />
          </div>
        </div>

        <div className="text-right">
          <div className="text-white/40 font-mono text-[10px] tracking-[0.22em] uppercase">
            Time to Sound Print
          </div>
          <div className="text-[#FDE047] font-mono text-xl">
            {Math.floor(timeLeft)}s
          </div>
        </div>
      </footer>
    </div>
  );
}
