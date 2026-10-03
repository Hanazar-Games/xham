import { test, expect } from '@playwright/test'
import { createServer } from 'vite'

test('development effect replay preserves audible start feedback', async ({ page }) => {
  const server = await createServer({
    server: { host: '127.0.0.1', port: 4176, strictPort: false, hmr: false },
  })
  try {
    await server.listen()
    const address = server.httpServer!.address()
    if (!address || typeof address === 'string') throw new Error('Missing development server port')
    await page.addInitScript(() => {
      const Native = window.AudioContext
      const audit = window as typeof window & { notes: { start: number; stop: number }[] }
      audit.notes = []
      window.AudioContext = class extends Native {
        createOscillator() {
          const oscillator = super.createOscillator()
          const note = { start: 0, stop: 0 }
          audit.notes.push(note)
          const start = oscillator.start.bind(oscillator)
          const stop = oscillator.stop.bind(oscillator)
          oscillator.start = (time = 0) => { note.start = time; start(time) }
          oscillator.stop = (time = 0) => { note.stop = time; stop(time) }
          return oscillator
        }
      }
    })
    await page.goto(`http://127.0.0.1:${address.port}`)
    await page.getByRole('button', { name: '开始：鬼灭之刃，鬼杀队入门课', exact: true }).click()
    await page.evaluate(() => { (window as unknown as { notes: unknown[] }).notes = [] })
    await page.getByRole('button', { name: '准备好了，开始！' }).click()
    await expect.poll(() => page.evaluate(() =>
      (window as unknown as { notes: { start: number; stop: number }[] }).notes
        .filter((note) => note.stop > note.start + 0.2).length,
    )).toBe(3)
  } finally {
    await server.close()
  }
})
