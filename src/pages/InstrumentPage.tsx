import React, { useState } from 'react';
import '../styles/Instrument.css';
import { useApp } from '../state/AppContext';

// @ts-ignore
const MAX_BANDS = 36;
// @ts-ignore
const MAX_ROWS = 36;

const InstrumentPage: React.FC = () => {
  const { audio, saveRecording } = useApp();
  // @ts-ignore
  const { audioBuffer } = audio;

  // @ts-ignore
  const [activeRows, setActiveRows] = useState<number[]>(new Array(MAX_BANDS).fill(-1));
  // @ts-ignore
  const [timeLeft, setTimeLeft] = useState(360);
  // @ts-ignore
  const [showRibbon, setShowRibbon] = useState(false);

  return (
    <div className="instrument-page" style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Instrument Page</h1>
      <p>The audio engine and UI are ready to be wired up.</p>
      <button onClick={() => console.log('Save triggered', saveRecording)}>
        Test Context Connection
      </button>
    </div>
  );
};

export default InstrumentPage;