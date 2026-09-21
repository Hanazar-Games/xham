import { test, expect } from '@playwright/test'

test('the app loads and starts a quiz when external font services never respond', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', () => new Promise<void>(() => {}))
  await page.route('https://fonts.gstatic.com/**', () => new Promise<void>(() => {}))
  await page.goto('/', { timeout: 5000 })
  await expect(page.locator('.quiz-card')).toHaveCount(264)
  await page.locator('.quiz-card .cover-link').first().click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await expect(page.locator('.answer-option')).toHaveCount(4)
  await expect.poll(() => page.locator('img.question-image').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
})
