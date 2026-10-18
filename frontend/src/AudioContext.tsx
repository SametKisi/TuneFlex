import { createContext, useContext, useState } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const [audioFile, setAudioFile] = useState(null);

  return (
    <AudioCtx.Provider value={{ audioFile, setAudioFile }}>
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);