import { test, expect } from '@playwright/test'
import { questionBanks } from '../src/data/question-banks'

for (const query of ['PSYCHO‑PASS', 'ＰＳＹＣＨＯ－ＰＡＳＳ', 'psycho–pass']) {
  test(`copied title typography finds the same first-season library: ${query}`, async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: '搜索 Quiz' }).fill(query)
    await expect(page.locator('.quiz-card')).toHaveCount(3)
    await expect(page.locator('.quiz-card h3').first()).toContainText('心理测量者 第一季')
    await page.getByRole('button', { name: '清空搜索', exact: true }).click()
    await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
    await page.getByLabel('目录分段').selectOption('4')
    await page.getByLabel('目录作品搜索').fill(query)
    await expect(page.locator('.catalog-item')).toHaveCount(1)
    await expect(page.locator('.catalog-item')).toHaveAttribute('data-number', '71')
  })
}

test('exam timeout has a distinct cue while submitted answers remain neutral', async ({ page }) => {
  await page.clock.install()
  await page.addInitScript(() => {
    const Native = window.AudioContext
    const audit = window as typeof window & { pitches: number[] }
    audit.pitches = []
    window.AudioContext = class extends Native {
      createOscillator() {
        const oscillator = super.createOscillator()
        const set = oscillator.frequency.setValueAtTime.bind(oscillator.frequency)
        oscillator.frequency.setValueAtTime = (value, time) => {
          audit.pitches.push(value)
          return set(value, time)
        }
        return oscillator
      }
    }
  })
  const pitches = () => page.evaluate(() => (window as unknown as { pitches: number[] }).pitches)
  const reset = () => page.evaluate(() => { (window as unknown as { pitches: number[] }).pitches = [] })
  await page.goto('/')
  await page.getByRole('button', { name: '进入专区：心理测量者 第一季', exact: true }).click()
  await page.getByRole('button', { name: '简单 18 题可用', exact: true }).click()
  await page.getByRole('button', { name: '生成试卷', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await reset()
  await page.clock.runFor(20_100)
  await expect(page.locator('.answer-feedback')).toContainText('时间到，本题记为未作答')
  const ending = (await pitches()).slice(-3)
  expect(ending).toHaveLength(3)
  for (const [index, midi] of [60, 55, 48].entries()) {
    expect(ending[index]).toBeCloseTo(440 * 2 ** ((midi - 69) / 12), 2)
  }
  await expect(page.locator('.correct-answer, .answer-source, .answer-correct, .answer-wrong')).toHaveCount(0)
  const bank = questionBanks.find((item) => item.series === 'psycho-pass')!
  for (const correct of [true, false]) {
    await page.getByRole('button', { name: '下一题', exact: true }).click()
    const prompt = await page.locator('.question-panel h1').innerText()
    const question = bank.questions.find((item) => item.prompt === prompt)!
    const answer = question.options[correct ? question.answer : (question.answer + 1) % 4]
    await reset()
    await page.locator('.answer-option').filter({ has: page.getByText(answer, { exact: true }).and(page.locator('span')) }).click()
    await expect(page.locator('.answer-feedback')).toContainText('答案已记录')
    await expect.poll(async () => (await pitches()).length).toBe(1)
    expect((await pitches())[0]).toBeCloseTo(440 * 2 ** ((72 - 69) / 12), 2)
    await expect(page.locator('.correct-answer, .answer-source, .answer-correct, .answer-wrong')).toHaveCount(0)
  }
})

test('mobile image attribution has a usable touch target', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.getByRole('button', { name: '开始：心理测量者 第一季，人物与公安局入门', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.locator('.answer-option').first().click()
  const link = page.getByRole('link', { name: '图片来源', exact: true })
  const bounds = await link.boundingBox()
  expect(bounds!.height).toBeGreaterThanOrEqual(24)
  expect(bounds!.width).toBeGreaterThanOrEqual(24)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('the 72-question crossover exam retains every image, grading and review', async ({ page }) => {
  test.setTimeout(90_000)
  const bank = questionBanks.find((item) => item.series === 'crossover')!
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.getByRole('button', { name: '进入专区：跨番联考', exact: true }).click()
  await expect(page.locator('.exam-setup')).toContainText('某档题量不足时由其余难度补足')
  await page.getByRole('button', { name: '全部 72 题', exact: true }).click()
  await page.getByRole('button', { name: '生成试卷', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  const seen = new Set<string>()
  for (let index = 0; index < 72; index++) {
    const prompt = await page.locator('.question-panel h1').innerText()
    const question = bank.questions.find((item) => item.prompt === prompt)!
    expect(question).toBeTruthy()
    expect(seen.has(question.id)).toBe(false)
    seen.add(question.id)
    await expect.poll(() => page.locator('img.question-image').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    const answer = question.options[question.answer]
    await page.locator('.answer-option').filter({ has: page.getByText(answer, { exact: true }).and(page.locator('span')) }).click()
    await expect(page.locator('.correct-answer, .answer-source, .answer-correct, .answer-wrong')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: index === 71 ? '交卷并查看成绩' : '下一题', exact: true }).click()
  }
  expect(seen.size).toBe(72)
  await expect(page.locator('.result-stats > div').first().locator('strong')).toHaveText('100')
  await expect(page.locator('.exam-breakdown')).toContainText('简单：48 / 48')
  await expect(page.locator('.exam-breakdown')).toContainText('中等：12 / 12')
  await expect(page.locator('.exam-breakdown')).toContainText('困难：12 / 12')
  await page.getByRole('button', { name: '查看答案与解析' }).click()
  await expect(page.locator('.review-item')).toHaveCount(72)
  await expect(page.locator('.review-item .question-picture')).toHaveCount(72)
})
