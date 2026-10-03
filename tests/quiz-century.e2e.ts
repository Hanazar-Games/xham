import { test, expect } from '@playwright/test'

const additions = [
  [96, 'Durarara', '无头骑士异闻录!! 第一季', 'urban-rider'],
  [97, 'Kaguya-sama: Love is War Season 2', '辉夜大小姐想让我告白 第二季', 'student-council'],
  [98, 'Bakemonogatari', '化物语', 'oddities'],
  [99, "Howl's Moving Castle", '哈尔的移动城堡', 'walking-castle'],
  [100, 'Hyouka', '冰菓', 'anthology'],
] as const

for (const [number, alias, title, scene] of additions) {
  test(`catalog century: ${alias} opens an illustrated bank on a narrow screen`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')
    await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
    await page.getByLabel('目录分段').selectOption('5')
    await expect(page.locator('.catalog-item').filter({ hasText: '50 / 50' })).toHaveCount(20)
    const item = page.locator(`.catalog-item[data-number="${number}"]`)
    await item.getByRole('button').click()
    await expect(page.locator('#exam-title')).toHaveText(`${title} · 模拟考试`)
    await expect(page.locator('.quiz-card')).toHaveCount(3)
    const cover = page.locator(`.quiz-card img[src$="/${scene}.svg"]`).first()
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.getByRole('button', { name: '全部 50 题', exact: true }).click()
    await page.getByRole('button', { name: '生成试卷', exact: true }).click()
    await expect(page.getByRole('dialog')).toContainText('50 道单选题')
    await expect(page.getByRole('dialog')).toContainText('剧透')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: '全部专区', exact: true }).click()
    await page.getByRole('textbox', { name: '搜索 Quiz' }).fill(alias)
    await expect(page.locator('.quiz-card').filter({ hasText: title })).toHaveCount(3)
    if (number === 97) await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('辉夜二期')
    await expect(page.locator('.quiz-card')).toHaveCount(3)
  })
}

test('catalog century: batch six keeps its first pending entry closed', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
  await expect(page.locator('.catalog-summary')).toContainText('101 / 200')
  await expect(page.locator('.catalog-summary')).toContainText('5,050 / 10,000')
  await page.getByLabel('目录分段').selectOption('6')
  const pending = page.locator('.catalog-item[data-number="101"]')
  await expect(pending).toContainText('待制作')
  await expect(pending.getByRole('button')).toHaveCount(0)
})
