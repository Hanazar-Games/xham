import { test, expect } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'

test('answer review retains every question image, credits and retry without timer instructions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  const quiz = quizzes[0]
  await page.goto('/')
  await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  for (const question of quiz.questions) {
    await page.keyboard.press(String(question.answer + 1))
    await page.keyboard.press('Enter')
  }
  let fail = true
  await page.route(`**${quiz.questions[0].image!.src}`, (route) => fail ? route.abort() : route.continue())
  await page.getByRole('button', { name: '查看答案与解析' }).click()
  await expect(page.locator('.answer-review .question-picture')).toHaveCount(quiz.questions.length)
  const first = page.locator('.review-item').first()
  await first.scrollIntoViewIfNeeded()
  await expect(first.locator('.image-unavailable')).toBeVisible()
  await expect(first).not.toContainText('重试不会暂停计时')
  fail = false
  await first.getByRole('button', { name: '重新加载图片' }).click()
  await expect(first.locator('.question-picture')).toBeFocused()
  await expect.poll(() => first.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect(page.locator('.answer-review').getByRole('link', { name: '图片来源', exact: true })).toHaveCount(quiz.questions.length)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: '收起答案回顾' }).click()
  await expect(page.locator('.answer-review')).toHaveCount(0)
})

test('a failed question image can be retried without resetting the question or losing focus', async ({ page }) => {
  await page.clock.install()
  const quiz = quizzes[0]
  let fail = true
  await page.route(`**${quiz.questions[0].image!.src}`, async (route) => fail ? route.abort() : route.continue())
  await page.goto('/')
  await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await expect(page.locator('.image-unavailable')).toBeVisible()
  await page.clock.runFor(3000)
  const remaining = Number(await page.locator('.timer strong').textContent())
  expect(remaining).toBeLessThan(quiz.duration)
  await page.getByRole('button', { name: '重新加载图片', exact: true }).click()
  await expect(page.locator('.image-unavailable')).toBeVisible()
  fail = false
  await page.getByRole('button', { name: '重新加载图片', exact: true }).click()
  await expect.poll(() => page.locator('img.question-image').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect(page.locator('.question-picture')).toBeFocused()
  await expect(page.locator('.question-panel h1')).toHaveText(quiz.questions[0].prompt)
  await expect(page.locator('.answer-feedback')).toHaveCount(0)
  expect(Number(await page.locator('.timer strong').textContent())).toBeLessThanOrEqual(remaining)
  await page.clock.runFor(1000)
  expect(Number(await page.locator('.timer strong').textContent())).toBeLessThan(remaining)
})

test('a temporary image failure does not persist into the next question sharing its image', async ({ page }) => {
  const quiz = quizzes.find((pack) => pack.questions.some((q, index) => q.image?.src === pack.questions[index + 1]?.image?.src))!
  const index = quiz.questions.findIndex((q, i) => q.image?.src === quiz.questions[i + 1]?.image?.src)
  let fail = index === 0
  await page.route(`**${quiz.questions[index].image!.src}`, async (route) => {
    if (fail) await route.abort()
    else await route.continue()
  })
  await page.goto('/')
  await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  for (let i = 0; i < index; i++) {
    await page.locator('.answer-option').first().click()
    fail = i + 1 === index
    await page.getByRole('button', { name: '下一题', exact: true }).click()
  }
  await expect(page.locator('.image-unavailable')).toBeVisible()
  fail = false
  await page.locator('.answer-option').first().click()
  await page.getByRole('button', { name: '下一题', exact: true }).click()
  await expect(page.locator('img.question-image')).toBeVisible()
  await expect.poll(() => page.locator('img.question-image').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
})
