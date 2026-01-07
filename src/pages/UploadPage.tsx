// src/pages/UploadPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/AppContext";

export function UploadPage() {
  const navigate = useNavigate();
  const { setFile } = useApp(); // Pulling setter from your context

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Store the file in our global state so SoundPrintPage can see it
      setFile(file);
      
      // 2. Transition to the ritual
      navigate("/sound-print");
    }
  };

  return (
    <div className="ritual-terminal relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 
         The background image is handled via CSS (ritual-terminal).
         Ensure you save Image 2 as ritual-bg-v2.jpg in your /public folder.
      */}
      
      <div className="upload-hotspot relative z-10 w-[300px] h-[300px] rounded-full">
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
          accept="audio/mpeg"
          onChange={handleFileChange}
        />
        
        {/* Optional: Simple hover indicator for the hotspot */}
        <div className="absolute inset-0 rounded-full hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* 
         Accessibility Note: Since we aren't using <h1> tags, 
         screen readers won't know what this page is. 
         This invisible label helps without breaking your design.
      */}
      <span className="sr-only">4B4KU5 Upload Ritual Seed</span>
    </div>
  );
}