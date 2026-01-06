import React from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Logic for processing file goes here later
      navigate("/sound-print");
    }
  };

  return (
    <div className="ritual-terminal">
      {/* 
         WARNING: Do not add <h1> or <p> tags here. 
         The background image already has the text.
      */}
      <div className="upload-hotspot">
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept="audio/mpeg"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}