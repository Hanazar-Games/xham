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
type Voice = {
  oscillator: OscillatorNode
  envelope: GainNode
  channel: 'music' | 'sfx'
  time: number
  duration: number
  volume: number
  stopping: boolean
}

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
  private duckUntil = 0
  private transition?: Promise<boolean>
  private pendingCue?: { cue: Cue; expires: number }

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
        this.applyVolume(true)
      }
      return await this.reconcile()
    } catch {
      return false
    }
  }

  configure(options: Partial<AudioOptions>) {
    if (this.disposed) return
    this.options = { ...this.options, ...options }
    this.options.volume = Number.isFinite(this.options.volume)
      ? Math.max(0, Math.min(1, this.options.volume))
      : defaultAudio.volume
    if (!this.options.sfx || this.options.volume === 0) {
      this.stopSfx()
    } else this.applyVolume()
    this.syncMusic()
  }

  play(cue: Cue) {
    if (
      !this.context ||
      this.disposed ||
      !this.visible ||
      !this.options.sfx ||
      !this.options.volume
    )
      return
    if (this.context.state !== 'running' || this.transition) {
      this.pendingCue = { cue, expires: performance.now() + 400 }
      return
    }
    this.stopVoices('sfx')
    const time = this.context.currentTime + 0.01
    this.duckUntil = cue === 'tick' || cue === 'tap' ? 0 : time + (cues[cue].length - 1) * 0.11 + 0.25
    this.applyVolume()
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
    if (paused) this.pendingCue = undefined
    this.syncMusic()
  }

  stopSfx() {
    this.pendingCue = undefined
    this.stopVoices('sfx')
    this.duckUntil = 0
    this.applyVolume()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (!visible) {
      this.stopMusic()
      this.stopSfx()
    }
    if (this.context && !this.disposed) void this.reconcile()
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    this.pendingCue = undefined
    this.stopMusic()
    this.stopVoices('sfx')
    for (const voice of this.voices) {
      voice.oscillator.disconnect()
      voice.envelope.disconnect()
    }
    this.voices.clear()
    void this.context?.close().catch(() => {})
  }

  private reconcile(): Promise<boolean> {
    if (this.transition) return this.transition
    let visible = this.visible
    const reconcile = async () => {
      do {
        visible = this.visible
        if (this.disposed || !this.context) return false
        if (visible && this.context.state !== 'running') await this.context.resume()
        if (!visible && this.context.state !== 'suspended') await this.context.suspend()
      } while (visible !== this.visible)
      return !this.disposed && visible && this.context?.state === 'running'
    }
    this.transition = reconcile()
      .catch(() => false)
      .then((ready) => {
        this.transition = undefined
        if (!this.disposed && visible !== this.visible) return this.reconcile()
        if (ready && !this.disposed && this.visible) {
          this.syncMusic()
          const pending = this.pendingCue
          this.pendingCue = undefined
          if (pending && pending.expires >= performance.now()) this.play(pending.cue)
        }
        return ready && !this.disposed
      })
    return this.transition
  }

  private applyVolume(initial = false) {
    if (!this.context || !this.sfx || !this.music) return
    for (const [node, value] of [
      [this.sfx, this.options.sfx ? this.options.volume * 0.8 : 0],
      [this.music, this.options.music ? this.options.volume * 0.35 : 0],
    ] as const) {
      if (initial) node.gain.setValueAtTime(value, this.context.currentTime)
      else {
        const now = this.context.currentTime
        node.gain.cancelScheduledValues(now)
        const ducked = node === this.music && this.duckUntil > now
        node.gain.setTargetAtTime(ducked ? value * 0.35 : value, now, 0.025)
        if (ducked) node.gain.setTargetAtTime(value, this.duckUntil, 0.12)
      }
    }
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
    envelope.gain.setValueAtTime(0, context.currentTime)
    envelope.gain.setValueAtTime(0, time)
    envelope.gain.linearRampToValueAtTime(volume, time + 0.012)
    envelope.gain.linearRampToValueAtTime(0, time + duration)
    oscillator.connect(envelope)
    envelope.connect(channel === 'sfx' ? this.sfx! : this.music!)
    const voice = { oscillator, envelope, channel, time, duration, volume, stopping: false }
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
      if (voice.channel !== channel || voice.stopping) continue
      voice.stopping = true
      if (now <= voice.time) {
        voice.oscillator.stop(now)
        voice.oscillator.disconnect()
        voice.envelope.disconnect()
        this.voices.delete(voice)
        continue
      }
      const elapsed = now - voice.time
      const gain =
        voice.volume *
        Math.max(
          0,
          elapsed < 0.012 ? elapsed / 0.012 : (voice.duration - elapsed) / (voice.duration - 0.012),
        )
      voice.envelope.gain.cancelScheduledValues(now)
      // Preserve the canceled ramp up to the release point.
      voice.envelope.gain.linearRampToValueAtTime(gain, now)
      voice.envelope.gain.linearRampToValueAtTime(0, now + 0.015)
      voice.oscillator.stop(now + 0.02)
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
