import { test, expect } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'

test('clearing search returns keyboard focus to the input', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('火影')
  await page.getByRole('button', { name: '清空搜索' }).click()
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toBeFocused()
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toHaveValue('')
})

test('IME composition digits do not submit an answer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: `开始：${quizzes[0].title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', isComposing: true, bubbles: true })))
  await expect(page.locator('.answer-feedback')).toHaveCount(0)
  await page.keyboard.press('1')
  await expect(page.locator('.answer-feedback')).toBeVisible()
})
