import { afterEach, describe, expect, it, vi } from 'vitest'
import { AudioEngine } from './engine'

function audioContext() {
  const parameter = () => ({
    value: 0,
    cancelScheduledValues: vi.fn(),
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
  })
  const oscillators: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] = []
  const context = {
    state: 'running',
    currentTime: 0,
    destination: {},
    createGain: () => ({ gain: parameter(), connect: vi.fn(), disconnect: vi.fn() }),
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
  return { context, oscillators, factory: vi.fn(() => context as unknown as AudioContext) }
}

afterEach(() => vi.useRealTimers())

describe('audio lifecycle', () => {
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
