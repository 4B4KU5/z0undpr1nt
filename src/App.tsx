import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/AppContext";
import { UploadPage } from "./pages/UploadPage";
import { SoundPrintPage } from "./pages/SoundPrintPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/sound-print" element={<SoundPrintPage />} />
          <Route path="/login" element={<div className="p-8 text-white">Step 3: Login (stub)</div>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}