import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AudioEngine, defaultAudio, type AudioOptions, type Cue } from './engine'

interface AudioControl {
  options: AudioOptions
  unavailable: boolean
  configure: (options: Partial<AudioOptions>) => void
  play: (cue: Cue) => void
  stopSfx: () => void
  pauseMusic: (paused: boolean) => void
  unlock: () => Promise<boolean>
}
const AudioContext = createContext<AudioControl | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const engine = useRef<AudioEngine | null>(null)
  const [options, setOptions] = useState(defaultAudio)
  const [unavailable, setUnavailable] = useState(false)
  const unlock = useCallback(async () => {
    const current = engine.current
    if (!current) return false
    const ready = await current.unlock()
    if (current === engine.current && !document.hidden) setUnavailable(!ready)
    return ready
  }, [])
  const play = useCallback((cue: Cue) => engine.current?.play(cue), [])
  const stopSfx = useCallback(() => engine.current?.stopSfx(), [])
  const pauseMusic = useCallback((paused: boolean) => engine.current?.setPaused(paused), [])
  const configure = useCallback((patch: Partial<AudioOptions>) => {
    setOptions((previous) => ({ ...previous, ...patch }))
    engine.current?.configure(patch)
  }, [])

  useEffect(() => {
    const current = new AudioEngine()
    engine.current = current
    const activate = () => {
      void unlock()
    }
    const visibility = () => current.setVisible(!document.hidden)
    visibility()
    window.addEventListener('pointerdown', activate, true)
    window.addEventListener('click', activate, true)
    window.addEventListener('keydown', activate, true)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('pointerdown', activate, true)
      window.removeEventListener('click', activate, true)
      window.removeEventListener('keydown', activate, true)
      document.removeEventListener('visibilitychange', visibility)
      current.dispose()
      engine.current = null
    }
  }, [unlock])

  const value = useMemo(
    () => ({ options, unavailable, configure, play, stopSfx, pauseMusic, unlock }),
    [options, unavailable, configure, play, stopSfx, pauseMusic, unlock],
  )
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const audio = useContext(AudioContext)
  if (!audio) throw new Error('AudioProvider is required')
  return audio
}
