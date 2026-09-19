import { test, expect } from '@playwright/test'

test('the illustrated homepage opens the series picker and credits a local licensed asset', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  const hero = page.getByRole('region', { name: '次元放映厅' })
  const art = hero.locator('img')
  await expect.poll(() => art.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  expect(new URL((await art.getAttribute('src'))!, page.url()).origin).toBe(new URL(page.url()).origin)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await hero.getByRole('button', { name: '挑选我的本命' }).click()
  await expect(page.locator('#anime-all-series')).toBeFocused()
  await expect(page.locator('#anime-all-series')).toBeInViewport()
  const credit = await hero.getByRole('link', { name: '插画来源与许可 ↗' }).getAttribute('href')
  await page.goto(credit!)
  await expect(page.locator('main')).toContainText('Kasuga')
  await expect(page.locator('main')).toContainText('Editor at Large')
  await expect(page.getByRole('link', { name: /Creative Commons/ })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/3.0/')
  await page.getByRole('link', { name: '返回动漫中心' }).click()
  await expect(page.locator('.anime-showcase')).toBeVisible()
})

test('a missing decorative illustration leaves homepage navigation playable', async ({ page }) => {
  await page.route('**/wikipe-tan.svg', (route) => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: '召唤随机试卷', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await expect(page.locator('.answer-option')).toHaveCount(4)
})
