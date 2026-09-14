export type Cue = 'start' | 'correct' | 'wrong' | 'timeout' | 'tick' | 'finish' | 'tap'
export interface AudioOptions {
  sfx: boolean
  music: boolean
  volume: number
}
export const defaultAudio: AudioOptions = { sfx: true, music: false, volume: 0.55 }

const cues: Record<Cue, number[]> = {
  start: [60, 64, 67],
  correct: [72, 76, 79],
  wrong: [55, 52],
  timeout: [60, 55, 48],
  tick: [81],
  finish: [60, 64, 67, 72, 76],
  tap: [72],
}
const chords = [
  [60, 64, 67, 71],
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [55, 59, 62, 67],
]
const melody = [0, -1, 2, -1, 1, 2, 3, -1, 2, -1, 1, 0, -1, 1, 2, -1]
type Voice = { oscillator: OscillatorNode; envelope: GainNode; channel: 'music' | 'sfx' }

export class AudioEngine {
  private context?: AudioContext
  private sfx?: GainNode
  private music?: GainNode
  private options = { ...defaultAudio }
  private visible = true
  private paused = false
  private disposed = false
  private timer?: ReturnType<typeof setInterval>
  private voices = new Set<Voice>()
  private step = 0
  private nextNote = 0

  constructor(private factory: () => AudioContext = () => new AudioContext()) {}

  async unlock(): Promise<boolean> {
    if (this.disposed || !this.visible) return false
    try {
      if (!this.context) {
        this.context = this.factory()
        this.sfx = this.context.createGain()
        this.music = this.context.createGain()
        this.sfx.connect(this.context.destination)
        this.music.connect(this.context.destination)
        this.applyVolume()
      }
      if (this.context.state !== 'running') await this.context.resume()
      if (this.disposed || !this.visible) return false
      this.syncMusic()
      return this.context.state === 'running'
    } catch {
      return false
    }
  }

  configure(options: Partial<AudioOptions>) {
    this.options = { ...this.options, ...options }
    this.options.volume = Number.isFinite(this.options.volume)
      ? Math.max(0, Math.min(1, this.options.volume))
      : defaultAudio.volume
    this.applyVolume()
    if (!this.options.sfx || this.options.volume === 0) this.stopVoices('sfx')
    this.syncMusic()
  }

  play(cue: Cue) {
    if (
      !this.context ||
      this.context.state !== 'running' ||
      this.disposed ||
      !this.visible ||
      !this.options.sfx ||
      !this.options.volume
    )
      return
    const time = this.context.currentTime + 0.01
    cues[cue].forEach((note, index) =>
      this.note(
        note,
        time + index * 0.11,
        cue === 'tick' ? 0.055 : 0.25,
        cue === 'tick' ? 0.035 : 0.16,
        'sfx',
      ),
    )
  }

  setPaused(paused: boolean) {
    this.paused = paused
    this.syncMusic()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (!visible) {
      this.stopMusic()
      this.stopVoices('sfx')
      void this.context?.suspend().catch(() => {})
    } else if (this.context) {
      void this.unlock()
    }
  }

  dispose() {
    this.disposed = true
    this.stopMusic()
    this.stopVoices('sfx')
    void this.context?.close().catch(() => {})
  }

  private applyVolume() {
    if (!this.context || !this.sfx || !this.music) return
    this.sfx.gain.setTargetAtTime(
      this.options.sfx ? this.options.volume * 0.8 : 0,
      this.context.currentTime,
      0.025,
    )
    this.music.gain.setTargetAtTime(
      this.options.music ? this.options.volume * 0.35 : 0,
      this.context.currentTime,
      0.04,
    )
  }

  private note(
    midi: number,
    time: number,
    duration: number,
    volume: number,
    channel: Voice['channel'],
  ) {
    const context = this.context!
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440 * 2 ** ((midi - 69) / 12), time)
    envelope.gain.setValueAtTime(0, time)
    envelope.gain.linearRampToValueAtTime(volume, time + 0.012)
    envelope.gain.linearRampToValueAtTime(0, time + duration)
    oscillator.connect(envelope)
    envelope.connect(channel === 'sfx' ? this.sfx! : this.music!)
    const voice = { oscillator, envelope, channel }
    this.voices.add(voice)
    oscillator.onended = () => {
      oscillator.disconnect()
      envelope.disconnect()
      this.voices.delete(voice)
    }
    oscillator.start(time)
    oscillator.stop(time + duration + 0.015)
  }

  private stopVoices(channel: Voice['channel']) {
    const now = this.context?.currentTime ?? 0
    for (const voice of this.voices) {
      if (voice.channel !== channel) continue
      voice.envelope.gain.cancelScheduledValues(now)
      voice.envelope.gain.setTargetAtTime(0, now, 0.008)
      voice.oscillator.stop(now + 0.04)
      this.voices.delete(voice)
    }
  }

  private stopMusic() {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
    this.stopVoices('music')
  }

  private syncMusic() {
    if (
      !this.options.music ||
      !this.options.volume ||
      !this.visible ||
      this.paused ||
      this.disposed ||
      this.context?.state !== 'running'
    ) {
      this.stopMusic()
      return
    }
    if (this.timer !== undefined) return
    this.nextNote = this.context.currentTime + 0.06
    const schedule = () => {
      const now = this.context!.currentTime
      // Background throttling must not replay a backlog of missed notes.
      if (this.nextNote < now) this.nextNote = now + 0.06
      while (this.nextNote < now + 0.15) {
        const chord = chords[Math.floor(this.step / 16) % chords.length]
        const tone = melody[this.step % melody.length]
        if (tone >= 0) this.note(chord[tone] + 12, this.nextNote, 0.38, 0.13, 'music')
        if (this.step % 4 === 0) this.note(chord[0] - 12, this.nextNote, 0.8, 0.12, 'music')
        if (this.step % 16 === 0)
          chord.forEach((note) => this.note(note, this.nextNote, 1.6, 0.035, 'music'))
        this.step = (this.step + 1) % 64
        this.nextNote += 0.3
      }
    }
    schedule()
    this.timer = setInterval(schedule, 50)
  }
}
