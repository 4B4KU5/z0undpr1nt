import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/AppContext";
import { UploadPage } from "./pages/UploadPage"; // Keeping your existing named import
import InstrumentPage from "./pages/InstrumentPage"; // New default import for the Instrument

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          
          {/* Swapped SoundPrintPage for InstrumentPage */}
          <Route path="/sound-print" element={<InstrumentPage />} />
          
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}