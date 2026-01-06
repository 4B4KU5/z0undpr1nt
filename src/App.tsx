import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import { AppProvider } from "./state/AppContext";
import { UploadPage } from "./pages/UploadPage";
import { SoundPrintPage } from "./pages/SoundPrintPage";

/**
 * Home skin: shows the JPG + header + one big "upload" hotspot.
 * It also mounts your existing <UploadPage /> off-screen so its file input + logic can still be used.
 *
 * The hotspot simply "clicks" the first file input it finds inside UploadPage.
 * This preserves functionality without needing to edit UploadPage right now.
 */
function RitualUploadSkin() {
  const hiddenHostRef = useRef<HTMLDivElement>(null);

  const pickFile = () => {
    const host = hiddenHostRef.current;
    if (!host) return;

    // Most projects have a single file input on the upload page.
    // If you have more later, we can make this selector stricter.
    const input =
      host.querySelector<HTMLInputElement>('input[type="file"][accept*="audio"]') ??
      host.querySelector<HTMLInputElement>('input[type="file"]');

    if (input) input.click();
    else console.warn("No <input type='file'> found inside UploadPage.");
  };

  return (
    <div className="terminal-stage">
      <header className="terminal-header">
        <div className="glow-text-red" style={{ fontSize: "clamp(44px, 7vw, 88px)" }}>
          4B4KU5
        </div>
        <div className="glow-text-green" style={{ marginTop: 10, fontSize: "clamp(14px, 2vw, 22px)" }}>
          Step 01 // Upload MP3 Ritual Seed
        </div>
      </header>

      <button type="button" className="upload-hotspot" onClick={pickFile} aria-label="Select MP3 file">
        <div className="upload-hotspot-label">DRAG &amp; DROP OR TAP TO SELECT MP3</div>
      </button>

      {/* Hidden functional page: keeps your existing upload logic alive */}
      <div
        ref={hiddenHostRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: 0,
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <UploadPage />
      </div>
    </div>
  );
}

/** Global layout: applies the JPG skin on every route. */
function RitualLayout() {
  const { pathname } = useLocation();
  const isHome = useMemo(() => pathname === "/", [pathname]);

  return (
    <div className="ritual-terminal">
      {/* On non-home pages, give content a readable glass panel */}
      <div className={isHome ? "" : "terminal-page"}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RitualLayout />}>
            <Route index element={<RitualUploadSkin />} />
            <Route path="/sound-print" element={<SoundPrintPage />} />
            <Route
              path="/login"
              element={<div className="p-8 text-white">Step 3: Login (stub)</div>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}