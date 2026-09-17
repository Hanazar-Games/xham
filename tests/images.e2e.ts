import { test, expect } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'

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
