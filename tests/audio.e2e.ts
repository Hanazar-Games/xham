import { test, expect, type Page } from '@playwright/test'

type AudioAudit = { contexts: (AudioContext & { channels: AnalyserNode[]; notes: number })[] }

async function sample(page: Page) {
  return page.evaluate(async () => {
    const peaks = [0, 0]
    const context = (window as typeof window & AudioAudit).contexts[0]
    for (let index = 0; index < 40; index++) {
      context.channels.forEach((channel, bus) => {
        const data = new Float32Array(channel.fftSize)
        channel.getFloatTimeDomainData(data)
        for (const value of data) peaks[bus] = Math.max(peaks[bus], Math.abs(value))
      })
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    return peaks
  })
}

for (const expired of [false, true]) {
test(`closing settings cancels a delayed preview (${expired ? 'expired' : 'still fresh'})`, async ({ page }) => {
  if (!expired) await page.addInitScript(() => { performance.now = () => 0 })
  await page.addInitScript(() => {
    const Native = window.AudioContext
    const audit = window as typeof window & { notes: number[]; releaseAudio: () => Promise<void> }
    audit.notes = []
    window.AudioContext = class extends Native {
      released = false
      get state() { return this.released ? super.state : 'suspended' }
      resume() {
        return new Promise<void>((resolve) => {
          audit.releaseAudio = async () => {
            this.released = true
            await super.resume()
            resolve()
          }
        })
      }
      createOscillator() {
        const oscillator = super.createOscillator()
        const start = oscillator.start.bind(oscillator)
        oscillator.start = (time) => {
          audit.notes.push(oscillator.frequency.value)
          start(time)
        }
        return oscillator
      }
    }
  })
  await page.goto('/')
  await page.getByRole('button', { name: '声音设置' }).click()
  await page.getByRole('button', { name: '试听音效' }).click()
  await page.getByRole('button', { name: '设置好了' }).click()
  if (expired) await page.waitForTimeout(550)
  await page.evaluate(() => (window as unknown as { releaseAudio: () => Promise<void> }).releaseAudio())
  expect(await page.evaluate(() => (window as unknown as { notes: number[] }).notes)).toEqual([])
})
}

test('native audio keeps buses independent, loops, mutes and recovers from pause and visibility changes', async ({ page }) => {
  test.setTimeout(45_000)
  await page.addInitScript(() => {
    const Native = window.AudioContext
    const audit = window as typeof window & AudioAudit
    audit.contexts = []
    window.AudioContext = class extends Native {
      channels: AnalyserNode[] = []
      notes = 0
      constructor() {
        super()
        audit.contexts.push(this)
      }
      createGain() {
        const gain = super.createGain()
        if (this.channels.length < 2) {
          const channel = this.createAnalyser()
          gain.connect(channel)
          this.channels.push(channel)
        }
        return gain
      }
      createOscillator() {
        this.notes++
        return super.createOscillator()
      }
    }
  })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  expect(await page.evaluate(() => (window as typeof window & AudioAudit).contexts.length)).toBe(0)
  await page.getByRole('button', { name: '声音设置' }).click()
  await page.getByRole('button', { name: '试听音效' }).click()
  let peaks = await sample(page)
  expect(peaks[0]).toBeGreaterThan(0.005)
  expect(peaks[1]).toBe(0)
  await page.getByRole('switch', { name: '背景音乐' }).click()
  await page.getByRole('switch', { name: '游戏音效' }).click()
  await expect(page.getByRole('button', { name: '试听音效' })).toBeDisabled()
  peaks = await sample(page)
  expect(peaks[0]).toBe(0)
  expect(peaks[1]).toBeGreaterThan(0.005)
  await page.waitForTimeout(19_300)
  expect((await sample(page))[1]).toBeGreaterThan(0.005)
  await page.getByRole('slider').fill('0')
  await page.waitForTimeout(150)
  expect(await sample(page)).toEqual([0, 0])
  await page.getByRole('slider').fill('55')
  await page.getByRole('switch', { name: '游戏音效' }).click()
  await page.getByRole('switch', { name: '背景音乐' }).click()
  await page.waitForTimeout(150)
  await page.getByRole('button', { name: '试听音效' }).click()
  peaks = await sample(page)
  expect(peaks[0]).toBeGreaterThan(0.005)
  expect(peaks[1]).toBe(0)
  await page.getByRole('switch', { name: '背景音乐' }).click()
  await page.getByRole('button', { name: '设置好了' }).click()
  await page.getByRole('button', { name: '开始：鬼灭之刃，鬼杀队入门课', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.getByRole('button', { name: '暂停挑战' }).click()
  await page.waitForTimeout(500)
  expect((await sample(page))[1]).toBe(0)
  await page.keyboard.press('Escape')
  expect((await sample(page))[1]).toBeGreaterThan(0.001)
  await page.getByRole('button', { name: '声音设置' }).click()
  const time = await page.locator('.timer strong').textContent()
  expect((await sample(page))[1]).toBeGreaterThan(0.001)
  await expect(page.locator('.timer strong')).toHaveText(time!)
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => page.evaluate(() => (window as typeof window & AudioAudit).contexts[0].state)).toBe('suspended')
  await page.evaluate(() => {
    for (let index = 0; index < 10; index++) {
      Object.defineProperty(document, 'hidden', { configurable: true, value: index % 2 === 0 })
      document.dispatchEvent(new Event('visibilitychange'))
    }
  })
  await expect.poll(() => page.evaluate(() => (window as typeof window & AudioAudit).contexts[0].state)).toBe('running')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.waitForTimeout(150)
  expect((await sample(page))[1]).toBe(0)
  await page.getByRole('button', { name: '继续挑战', exact: true }).click()
  expect((await sample(page))[1]).toBeGreaterThan(0.001)
  await page.getByRole('button', { name: '退出挑战', exact: true }).click()
  await page.waitForTimeout(150)
  expect((await sample(page))[1]).toBe(0)
  await page.getByRole('button', { name: '结束挑战', exact: true }).click()
  expect((await sample(page))[1]).toBeGreaterThan(0.001)
  await page.getByRole('button', { name: '声音设置' }).click()
  await expect(page.getByRole('switch', { name: '背景音乐' })).toHaveAttribute('aria-checked', 'true')
  expect(await page.evaluate(() => (window as typeof window & AudioAudit).contexts.length)).toBe(1)
  expect(errors).toEqual([])
})

test('unavailable audio reports its state and leaves the quiz playable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'AudioContext', { value: class {
      constructor() { throw new Error('Audio unavailable') }
    } })
  })
  await page.goto('/')
  await page.getByRole('button', { name: '声音设置' }).click()
  await expect(page.locator('.audio-error')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '开始：鬼灭之刃，鬼杀队入门课', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.keyboard.press('2')
  await expect(page.locator('.correct-answer')).toHaveText('正确答案：嗅觉')
})
