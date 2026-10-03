import { test, expect } from '@playwright/test'

const additions = [
  [91, 'Made in Abyss', '来自深渊 第一季', 'abyss'],
  [92, 'Attack on Titan: The Final Season Part 2', '进击的巨人 最终季 Part 2', 'walls'],
  [93, 'High School DxD', '恶魔高校 D×D 第一季', 'pact'],
  [94, 'Fire Force', '炎炎消防队 第一季', 'fire-rescue'],
  [95, 'Clannad', 'CLANNAD 第一季', 'theater'],
] as const

for (const [number, alias, title, scene] of additions) {
  test(`batch five: ${alias} opens through the catalog and search on a narrow screen`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')
    await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
    await page.getByLabel('目录分段').selectOption('5')
    await expect(page.locator('.catalog-item').filter({ hasText: '50 / 50' })).toHaveCount(15)
    await expect(page.locator('.catalog-item[data-number="96"]')).toContainText('待制作')
    const item = page.locator(`.catalog-item[data-number="${number}"]`)
    await expect(item).toContainText('50 / 50')
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
    if (number === 92) await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('巨人最终季后半部')
    await expect(page.locator('.quiz-card')).toHaveCount(3)
  })
}
