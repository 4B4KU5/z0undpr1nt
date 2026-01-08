import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useApp } from '../context/AppContext'; // CHANGED THIS IMPORT
import { audioEngine } from '../audio/AudioEngine';
import { BandColumn } from '../components/BandColumn';
import { Ribbon } from '../components/Ribbon';
import { BAND_COLORS } from '../config/bandColors';
import '../styles/Instrument.css'; 

const MAX_BANDS = 36;
const MAX_ROWS = 36;

const InstrumentPage: React.FC = () => {
  // CHANGED: Destructuring from 'audio' state object to match your context
  const { audio, saveRecording } = useApp();
  const { audioBuffer } = audio;
  
  const [activeRows, setActiveRows] = useState<number[]>(new Array(MAX_BANDS).fill(-1));
  const [timeLeft, setTimeLeft] = useState(360);
  const [showRibbon, setShowRibbon] = useState(false);
  
  const finalEQStateRef = useRef<number[]>(new Array(MAX_BANDS).fill(0));
  
  useEffect(() => {
    if (!audioBuffer) return;

    const initAudio = async () => {
      await audioEngine.init();
      audioEngine.startPlayback(audioBuffer, handleCompletion);
    };

    initAudio();

    const duration = Math.min(600, Math.floor(audioBuffer.duration));
    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 36) setShowRibbon(true);
        if (next <= 0) {
            clearInterval(interval);
            handleCompletion();
            return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
        clearInterval(interval);
        audioEngine.stop();
    };
  }, [audioBuffer]);

  const handleCompletion = () => {
    const blob = audioEngine.getRecordingBlob();
    saveRecording(blob, finalEQStateRef.current);
  };

  const handleInteraction = (clientX: number, clientY: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX / width) * 2 - 1;
    const y = -(clientY / height) * 2 + 1;

    const bandIndex = Math.floor(((x + 1) / 2) * MAX_BANDS);
    const rowIndex = Math.floor(((y + 1) / 2) * MAX_ROWS);

    if (bandIndex >= 0 && bandIndex < MAX_BANDS && rowIndex >= 0 && rowIndex < MAX_ROWS) {
        audioEngine.setBandGain(bandIndex, rowIndex);
        
        const newRows = [...activeRows];
        newRows[bandIndex] = rowIndex;
        setActiveRows(newRows);
        finalEQStateRef.current[bandIndex] = rowIndex;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
        handleInteraction(e.touches[i].clientX, e.touches[i].clientY);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { 
        handleInteraction(e.clientX, e.clientY);
    }
  };

  return (
    <div 
      className="instrument-container" 
      style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', touchAction: 'none' }}
      onTouchStart={onTouchMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseMove}
      onMouseMove={onMouseMove}
    >
      <div style={{ position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 10, fontFamily: 'monospace', fontSize: '24px' }}>
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>

      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 10], near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        {BAND_COLORS.map((color, i) => (
          <BandColumn 
            key={i}
            index={i}
            colorData={color}
            activeRow={activeRows[i]}
            maxRows={MAX_ROWS}
            maxBands={MAX_BANDS}
          />
        ))}

        {showRibbon && (
            <Ribbon 
                finalEQState={activeRows}
                maxRows={MAX_ROWS}
                maxBands={MAX_BANDS}
                isVisible={true}
            />
        )}
      </Canvas>
    </div>
  );
};

export default InstrumentPage;