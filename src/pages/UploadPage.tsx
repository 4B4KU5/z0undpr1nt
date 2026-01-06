import React from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In the future, we'll store the file in AppContext here
      navigate("/sound-print");
    }
  };

  return (
    <div className="ritual-terminal">
      {/* The visible UI is provided by the background image */}
      
      {/* The invisible functional hotspot */}
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