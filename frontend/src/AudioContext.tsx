import { createContext, useContext, useState, type ReactNode } from 'react'

type AudioContextType = {
  audioFile: File | null
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>
}

const AudioCtx = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioFile, setAudioFile] = useState<File | null>(null)

  return (
    <AudioCtx.Provider value={{ audioFile, setAudioFile }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
  return ctx
}