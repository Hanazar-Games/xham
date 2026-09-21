import { test, expect, type Page } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'
import axe from 'axe-core'
import { createRequire } from 'node:module'

const { version } = createRequire(import.meta.url)('../package.json')

async function auditLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(document.getAnimations()
      .filter((animation) => animation instanceof CSSAnimation && animation.animationName === 'appear')
      .map((animation) => animation.finished.catch(() => {})))
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.addScriptTag({ content: axe.source })
  const violations = await page.evaluate(async () => {
    const result = await (window as typeof window & { axe: typeof axe }).axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
  })
  expect(violations).toEqual([])
}

async function start(page: Page, quiz = quizzes[0]) {
  await page.goto('/')
  await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
}

test('mobile feedback and its keyboard target stay visible, then the next question starts at the top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await start(page)
  await page.keyboard.press('2')
  await expect(page.getByRole('button', { name: '下一题' })).toBeFocused()
  await expect(page.getByRole('button', { name: '下一题' })).toBeInViewport({ ratio: 1 })
  await expect(page.locator('.correct-answer')).toBeInViewport({ ratio: 1 })
  await page.keyboard.press('Enter')
  await expect(page.locator('.question-panel h1')).toHaveText(quizzes[0].questions[1].prompt)
  await expect(page.locator('.question-panel h1')).toBeFocused()
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

test('closing game dialogs restores the opener while preserving the answer and timer', async ({ page }) => {
  await start(page)
  for (const label of ['暂停挑战', '声音设置', '退出挑战']) {
    const button = page.getByRole('button', { name: label, exact: true })
    await button.click()
    const remaining = await page.locator('.timer strong').textContent()
    await page.keyboard.press('2')
    await expect(page.locator('.answer-feedback')).toHaveCount(0)
    await expect(page.locator('.timer strong')).toHaveText(remaining!)
    await page.keyboard.press('Escape')
    await expect(button).toBeFocused()
  }
  await page.keyboard.press('2')
  for (const label of ['暂停挑战', '声音设置', '退出挑战']) {
    const button = page.getByRole('button', { name: label, exact: true })
    await button.click()
    await page.keyboard.press('Escape')
    await expect(button).toBeFocused()
    await expect(page.locator('.correct-answer')).toHaveText('正确答案：嗅觉')
  }
})

for (const quiz of quizzes) {
  test(`${quiz.id}: every question, image, score, review, history and replay`, async ({ page }) => {
    if (quiz.series && quiz.id !== quiz.series) await page.setViewportSize({ width: 390, height: 844 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await start(page, quiz)
    for (const [index, question] of quiz.questions.entries()) {
      await expect(page.locator('.question-panel h1')).toHaveText(question.prompt)
      if (question.image) {
        const image = page.locator('.question-image')
        await expect(image).toHaveAttribute('src', question.image.src)
        await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true)
        await expect(page.locator('.question-picture a')).toHaveCount(0)
      }
      await page.keyboard.press(String(question.answer + 1))
      await expect(page.locator('.answer-option:disabled')).toHaveCount(4)
      await expect(page.locator('.correct-answer')).toHaveText(`正确答案：${question.options[question.answer]}`)
      if (question.source) await expect(page.locator('.answer-source')).toHaveAttribute('href', question.source.url)
      if (question.image) await expect(page.locator('.question-picture a')).toHaveAttribute('href', question.image.sourceUrl)
      if (index === 0) await auditLayout(page)
      await page.keyboard.press('Enter')
    }
    await expect(page.locator('.result-stats > div').nth(1)).toContainText(String(quiz.questions.length))
    await expect(page.locator('.result-stats > div').nth(2)).toContainText('100%')
    const score = await page.locator('.result-stats > div').first().locator('strong').textContent()
    expect(Number(score!.replaceAll(',', ''))).toBeGreaterThanOrEqual(quiz.questions.length * 500)
    await page.getByRole('button', { name: '查看答案与解析' }).click()
    await expect(page.locator('.review-item')).toHaveCount(quiz.questions.length)
    await auditLayout(page)
    await page.getByRole('button', { name: '探索更多 Quiz' }).click()
    await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '挑战记录', exact: true }).click()
    await expect(page.locator('.history-item')).toHaveCount(1)
    await expect(page.locator('.history-item')).toContainText(score!)
    await page.getByRole('button', { name: '查看成绩', exact: true }).click()
    await expect(page.locator('.result-stats > div').first()).toContainText(score!)
    await page.getByRole('button', { name: '返回挑战记录' }).click()
    await page.getByRole('button', { name: '再来一局' }).click()
    await page.getByRole('button', { name: '准备好了，开始！' }).click()
    await expect(page.locator('.score-pill')).toHaveText('0分')
    await expect(page.locator('.question-panel h1')).toHaveText(quiz.questions[0].prompt)
    expect(errors).toEqual([])
  })
}

for (const [width, height] of [[320, 568], [390, 844], [540, 720], [768, 1024], [1024, 768], [1440, 1000], [844, 390]]) {
  test(`layout and dialogs at ${width}×${height}`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await auditLayout(page)
    await page.locator('.release-banner').click()
    await expect(page.locator('.latest-release')).toContainText(`v${version}`)
    await auditLayout(page)
    await page.getByRole('button', { name: '历史公告', exact: true }).click()
    await expect(page.locator('.historical-release')).toHaveCount(62)
    await page.locator('.historical-release summary').first().click()
    await expect(page.locator('.historical-release').first()).toContainText('v0.56.0')
    await expect(page.locator('.historical-release').first()).toContainText('新增《青春猪头少年不会梦到兔女郎学姐》50道配图题')
    await auditLayout(page)
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: /^(查看)?玩法指南$/ }).click()
    await auditLayout(page)
    await page.keyboard.press('Escape')
    const quiz = quizzes.find((item) => item.id === 'rezero')!
    await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
    await auditLayout(page)
    await page.getByRole('button', { name: '准备好了，开始！' }).click()
    await auditLayout(page)
    await page.keyboard.press(String((quiz.questions[0].answer + 1) % 4 + 1))
    await expect(page.getByRole('button', { name: '下一题' })).toBeInViewport({ ratio: 1 })
    await auditLayout(page)
    await page.getByRole('button', { name: '声音设置' }).click()
    await auditLayout(page)
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: '退出挑战', exact: true }).click()
    await auditLayout(page)
    await page.getByRole('button', { name: '结束挑战', exact: true }).click()
    await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: /^我的收藏/ }).click()
    await auditLayout(page)
    await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '挑战记录', exact: true }).click()
    await auditLayout(page)
  })
}

test('discovery filters, sorting, favorites and reset on refresh', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '2 dimention', exact: true }).click()
  for (const [query, id] of [['re0', 'rezero'], ['ONE PIECE', 'one-piece'], ['NARUTO', 'naruto'], ['鬼灭', 'demon-slayer']]) {
    await page.getByRole('textbox', { name: '搜索 Quiz' }).fill(query)
    const matches = quizzes.filter((quiz) => quiz.series === id || quiz.series === 'crossover' || (id === 'naruto' && quiz.series === 'naruto-shippuden') || (id === 'rezero' && quiz.series === 'rezero-season-1'))
    await expect(page.locator('.quiz-card')).toHaveCount(matches.length)
    await expect(page.locator('.quiz-card h3')).toHaveText(matches.map((quiz) => quiz.title))
  }
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('not-a-quiz')
  await expect(page.locator('.empty-state')).toBeVisible()
  await page.getByRole('button', { name: '重置筛选' }).click()
  await expect(page.locator('.quiz-card')).toHaveCount(quizzes.length)
  await expect(page.locator('.quiz-card')).toHaveCount(162)
  await page.getByRole('combobox', { name: '题库排序' }).selectOption('challenge')
  await expect(page.locator('.quiz-card .difficulty').first()).toHaveText('困难')
  await page.getByRole('button', { name: `收藏：${quizzes[0].title}`, exact: true }).click()
  await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: /^我的收藏/ }).click()
  await expect(page.locator('.quiz-card')).toHaveCount(1)
  await page.getByRole('button', { name: `取消收藏：${quizzes[0].title}`, exact: true }).click()
  await expect(page.locator('.empty-state')).toContainText('喜欢的动漫试卷，先收藏起来')
  await page.getByRole('button', { name: '去动漫题库' }).click()
  await page.getByRole('button', { name: `收藏：${quizzes[0].title}`, exact: true }).click()
  await page.reload()
  await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: /^我的收藏/ }).click()
  await expect(page.locator('.quiz-card')).toHaveCount(0)
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0])
  await page.getByRole('navigation', { name: '主导航' }).getByRole('button', { name: '2 dimention', exact: true }).click()
  await page.getByRole('button', { name: '随机来一局' }).click()
  expect(quizzes.map((quiz) => quiz.title)).toContain(await page.locator('.dialog-quiz-title').textContent())
})

test('failed and delayed images preserve playable text and recover on the next question', async ({ page }) => {
  const quiz = quizzes.find((item) => item.id === 'frieren')!
  await page.route(`**${quiz.questions[0].image!.src}`, (route) => route.abort())
  let release!: () => void
  const loaded = new Promise<void>((resolve) => { release = resolve })
  await page.route(`**${quiz.questions[1].image!.src}`, async (route) => {
    await loaded
    await route.continue()
  })
  await start(page, quiz)
  await expect(page.locator('.image-unavailable')).toBeVisible()
  await page.keyboard.press(String(quiz.questions[0].answer + 1))
  await page.keyboard.press('Enter')
  await expect(page.locator('.question-panel h1')).toHaveText(quiz.questions[1].prompt)
  await expect(page.locator('.answer-option:enabled')).toHaveCount(4)
  await page.evaluate(() => document.fonts.ready)
  const before = await page.locator('.answer-grid').boundingBox()
  release()
  await expect.poll(() => page.locator('.question-image').evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true)
  const after = await page.locator('.answer-grid').boundingBox()
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(1)
  await page.keyboard.press(String(quiz.questions[1].answer + 1))
  await expect(page.locator('.correct-answer')).toContainText(quiz.questions[1].options[quiz.questions[1].answer])
})

test('a real countdown freezes in dialogs and in the background, then expires once', async ({ page }) => {
  test.setTimeout(35_000)
  await start(page)
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: '暂停挑战' }).click()
  const seconds = await page.locator('.timer strong').textContent()
  await page.waitForTimeout(700)
  await expect(page.locator('.timer strong')).toHaveText(seconds!)
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: '继续挑战', exact: true }).click()
  await expect(page.locator('.answer-feedback')).toContainText('时间到', { timeout: 22_000 })
  await expect(page.locator('.timer strong')).toHaveText('0')
  await expect(page.locator('.score-pill')).toHaveText('0分')
  await page.keyboard.press('2')
  await expect(page.locator('.answer-feedback')).toContainText('时间到')
  await page.getByRole('button', { name: '下一题' }).click()
  await expect(page.locator('.question-position')).toContainText('02')
})

test('dialog keeps background controls inert and distinguishes an internal drag from a backdrop click', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '声音设置' }).click()
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest('dialog'))).toBe(true)
  }
  const slider = await page.getByRole('slider').boundingBox()
  await page.mouse.move(slider!.x + slider!.width / 2, slider!.y + slider!.height / 2)
  await page.mouse.down()
  await page.mouse.move(2, 2)
  await page.mouse.up()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.mouse.click(2, 2)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '声音设置' })).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('reduced motion preserves visible feedback without an entrance animation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await start(page)
  await page.keyboard.press('2')
  await expect(page.getByRole('button', { name: '下一题' })).toBeInViewport({ ratio: 1 })
  expect(await page.locator('.answer-feedback').evaluate((node) => getComputedStyle(node).animationName)).toBe('none')
})
