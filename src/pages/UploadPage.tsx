import React from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
            if (file) {
                  console.log("File detected:", file.name);
                        // In the future, we process the file here. 
                              // For now, we just navigate to the next step:
                                    navigate("/sound-print");
                                        }
                                          };

                                            return (
                                                <div className="ritual-terminal">
                                                      {/* Top Header Section */}
                                                            <div className="mt-12 text-center">
                                                                    <h1 className="text-6xl font-bold glow-text-red mb-2 uppercase">
                                                                              4B4KU5
                                                                                      </h1>
                                                                                              <p className="glow-text-green text-xl tracking-widest uppercase">
                                                                                                        Step 01 // Upload MP3 Ritual Seed
                                                                                                                </p>
                                                                                                                      </div>

                                                                                                                            {/* Interactive Upload Zone */}
                                                                                                                                  <div className="upload-overlay">
                                                                                                                                          <div className="text-center">
                                                                                                                                                    <p className="text-xs glow-text-green tracking-[0.3em] font-bold">
                                                                                                                                                                DRAG & DROP OR TAP TO SELECT MP3
                                                                                                                                                                          </p>
                                                                                                                                                                                  </div>
                                                                                                                                                                                          
                                                                                                                                                                                                  {/* Actual hidden input that makes it work */}
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