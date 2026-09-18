import { test, expect } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'

test('removing saved quizzes retains focus on the next card or the empty-state action', async ({ page }) => {
  await page.goto('/')
  for (const quiz of quizzes.slice(0, 2)) {
    await page.getByRole('button', { name: `收藏：${quiz.title}`, exact: true }).click()
  }
  await page.getByRole('navigation').getByRole('button', { name: /^我的收藏/ }).click()
  const first = page.getByRole('button', { name: `取消收藏：${quizzes[0].title}`, exact: true })
  await first.focus()
  await page.keyboard.press('Enter')
  const last = page.getByRole('button', { name: `取消收藏：${quizzes[1].title}`, exact: true })
  await expect(last).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '去动漫题库', exact: true })).toBeFocused()
})

test('clearing search returns keyboard focus to the input', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('火影')
  await page.getByRole('button', { name: '清空搜索' }).click()
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toBeFocused()
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toHaveValue('')
})

test('removing the only filtered favorite focuses reset without removing other favorites', async ({ page }) => {
  await page.goto('/')
  for (const quiz of quizzes.slice(0, 2)) {
    await page.getByRole('button', { name: `收藏：${quiz.title}`, exact: true }).click()
  }
  await page.getByRole('navigation').getByRole('button', { name: /^我的收藏/ }).click()
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('鬼灭')
  await page.getByRole('button', { name: `取消收藏：${quizzes[0].title}`, exact: true }).click()
  await expect(page.getByRole('button', { name: '重置筛选', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('.quiz-card')).toHaveCount(1)
  await expect(page.locator('.quiz-card')).toHaveAttribute('data-quiz-id', quizzes[1].id)
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
