import { afterEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine } from './engine'

function audioContext() {
  const parameter = () => ({
    value: 1,
    cancelScheduledValues: vi.fn(),
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
  })
  const oscillators: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] = []
  const gains: ReturnType<typeof parameter>[] = []
  const context = {
    state: 'running',
    currentTime: 0,
    destination: {},
    createGain: () => {
      const gain = parameter()
      gains.push(gain)
      return { gain, connect: vi.fn(), disconnect: vi.fn() }
    },
    createOscillator: () => {
      const oscillator = {
        type: 'sine',
        frequency: parameter(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      }
      oscillators.push(oscillator)
      return oscillator
    },
    resume: vi.fn(async () => {
      context.state = 'running'
    }),
    suspend: vi.fn(async () => {
      context.state = 'suspended'
    }),
    close: vi.fn(async () => {
      context.state = 'closed'
    }),
  }
  return { context, oscillators, gains, factory: vi.fn(() => context as unknown as AudioContext) }
}

afterEach(() => vi.useRealTimers())

describe('audio lifecycle', () => {
  it('cancels preview voices without stopping music or blocking future feedback', async () => {
    vi.useFakeTimers()
    const { factory, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    engine.configure({ music: true })
    const music = [...oscillators]
    engine.play('correct')
    const preview = oscillators.slice(music.length)
    for (const oscillator of oscillators) oscillator.stop.mockClear()
    engine.stopSfx()
    expect(preview.every((oscillator) => oscillator.stop.mock.calls.length === 1)).toBe(true)
    expect(music.every((oscillator) => oscillator.stop.mock.calls.length === 0)).toBe(true)
    const count = oscillators.length
    engine.play('wrong')
    expect(oscillators).toHaveLength(count + 2)
    expect(vi.getTimerCount()).toBe(1)
    engine.dispose()
  })

  it('does not replay delayed feedback after muting or a long activation delay', async () => {
    vi.useFakeTimers({ toFake: ['performance'] })
    for (const muted of [true, false]) {
      const { factory, context, oscillators } = audioContext()
      context.state = 'suspended'
      let release!: () => void
      context.resume.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            release = () => {
              context.state = 'running'
              resolve()
            }
          }),
      )
      const engine = new AudioEngine(factory)
      const ready = engine.unlock()
      engine.play('correct')
      if (muted) engine.configure({ sfx: false })
      else vi.advanceTimersByTime(500)
      release()
      await ready
      expect(oscillators).toHaveLength(0)
      engine.dispose()
    }
  })

  it('releases an active note from its current envelope, without a gain spike', async () => {
    const { factory, context, gains } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    engine.play('correct')
    context.currentTime = 0.1
    engine.configure({ sfx: false })
    const heldGain = gains[2].linearRampToValueAtTime.mock.calls.at(-2)?.[0]
    expect(heldGain).toBeCloseTo((0.16 * (0.25 - 0.09)) / (0.25 - 0.012))
    expect(gains[2].linearRampToValueAtTime).toHaveBeenLastCalledWith(0, 0.115)
    engine.dispose()
    engine.dispose()
    expect(context.close).toHaveBeenCalledTimes(1)
  })

  it('coalesces activation and honors a hide request while resume is pending', async () => {
    const { factory, context } = audioContext()
    context.state = 'suspended'
    let release!: () => void
    context.resume.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = () => {
            context.state = 'running'
            resolve()
          }
        }),
    )
    const engine = new AudioEngine(factory)
    const first = engine.unlock()
    const second = engine.unlock()
    expect(context.resume).toHaveBeenCalledTimes(1)
    engine.setVisible(false)
    release()
    await Promise.all([first, second])
    expect(context.state).toBe('suspended')
    engine.dispose()
  })

  it('returns to running when visibility changes during a pending suspension', async () => {
    const { factory, context } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    let release!: () => void
    context.suspend.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = () => {
            context.state = 'suspended'
            resolve()
          }
        }),
    )
    engine.setVisible(false)
    engine.setVisible(true)
    release()
    await vi.waitFor(() => expect(context.state).toBe('running'), { timeout: 100, interval: 5 })
    engine.dispose()
  })

  it('plays the freshest feedback after delayed activation without stacking stale cues', async () => {
    const { factory, context, oscillators } = audioContext()
    context.state = 'suspended'
    let release!: () => void
    context.resume.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = () => {
            context.state = 'running'
            resolve()
          }
        }),
    )
    const engine = new AudioEngine(factory)
    const ready = engine.unlock()
    engine.play('start')
    engine.play('correct')
    release()
    await ready
    expect(oscillators).toHaveLength(3)
    engine.dispose()
  })

  it('cancels future notes silently and starts buses at the configured gain', async () => {
    const { factory, context, oscillators, gains } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    expect(gains[0].setValueAtTime).toHaveBeenCalledWith(0.55 * 0.8, 0)
    engine.play('finish')
    engine.configure({ sfx: false })
    expect(
      oscillators.every((oscillator) => oscillator.stop.mock.lastCall?.[0] <= context.currentTime),
    ).toBe(true)
    engine.dispose()
  })

  it('bounds overlapping effects during rapid repeated interactions', async () => {
    const { factory, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    for (let count = 0; count < 12; count++) engine.play('correct')
    const stillScheduled = oscillators.filter(
      (oscillator) => oscillator.stop.mock.lastCall?.[0] > 0,
    )
    expect(stillScheduled.length).toBeLessThanOrEqual(3)
    engine.dispose()
  })

  it('does not create audio or play before user activation; reuses one context', async () => {
    const { factory, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    engine.play('correct')
    expect(factory).not.toHaveBeenCalled()
    await engine.unlock()
    await engine.unlock()
    expect(factory).toHaveBeenCalledTimes(1)
    engine.play('correct')
    expect(oscillators.length).toBeGreaterThan(0)
    engine.dispose()
  })

  it('keeps music and effects independent and stops the loop when muted', async () => {
    vi.useFakeTimers()
    const { factory, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    engine.configure({ sfx: false, music: true })
    const musicNotes = oscillators.length
    engine.play('correct')
    expect(oscillators).toHaveLength(musicNotes)
    expect(vi.getTimerCount()).toBe(1)
    engine.configure({ music: false })
    expect(vi.getTimerCount()).toBe(0)
    engine.configure({ sfx: true })
    engine.play('correct')
    expect(oscillators.length).toBeGreaterThan(musicNotes)
    engine.dispose()
  })

  it('suspends hidden audio, does not catch up stale notes, and clears resources', async () => {
    vi.useFakeTimers()
    const { factory, context, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    engine.configure({ music: true })
    engine.setVisible(false)
    expect(vi.getTimerCount()).toBe(0)
    expect(context.suspend).toHaveBeenCalledOnce()
    const count = oscillators.length
    engine.play('finish')
    expect(oscillators).toHaveLength(count)
    context.currentTime = 100
    engine.setVisible(true)
    await engine.unlock()
    expect(oscillators.length - count).toBeLessThan(10)
    engine.dispose()
    expect(vi.getTimerCount()).toBe(0)
    expect(context.close).toHaveBeenCalledOnce()
    expect(oscillators.every((oscillator) => oscillator.stop.mock.calls.length > 0)).toBe(true)
  })

  it('can pause music without muting feedback and safely handles unavailable audio', async () => {
    vi.useFakeTimers()
    const { factory, oscillators } = audioContext()
    const engine = new AudioEngine(factory)
    await engine.unlock()
    engine.configure({ music: true })
    engine.setPaused(true)
    expect(vi.getTimerCount()).toBe(0)
    const count = oscillators.length
    engine.play('wrong')
    expect(oscillators.length).toBeGreaterThan(count)
    engine.dispose()
    const unsupported = new AudioEngine(() => {
      throw new Error('unsupported')
    })
    expect(await unsupported.unlock()).toBe(false)
    expect(() => unsupported.play('start')).not.toThrow()
    unsupported.dispose()
  })
})
