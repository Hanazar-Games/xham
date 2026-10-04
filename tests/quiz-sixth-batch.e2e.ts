import { test, expect } from '@playwright/test'

const additions = [
  [101, "Love, Chunibyo & Other Delusions!", "中二病也要谈恋爱！ 第一季", "eyepatch"],
  [102, "Seraph of the End", "终结的炽天使 第一部分", "blood-moon"],
  [103, "Classroom of the Elite", "欢迎来到实力至上主义的教室 第一季", "merit-class"],
  [104, "Puella Magi Madoka Magica", "魔法少女小圆 2011电视版", "soul-gem"],
  [105, "Tokyo Revengers", "东京复仇者 第一季", "time-rider"],
  [106, "Princess Mononoke", "幽灵公主", "forest-spirit"],
  [107, "Dororo", "多罗罗 2019版", "prosthetic-sword"],
  [108, "JoJo's Bizarre Adventure: Stardust Crusaders", "JOJO的奇妙冒险 星尘斗士 前半部", "star-journey"],
  [109, "Samurai Champloo", "混沌武士", "sunflower"],
  [110, "My Hero Academia 5th Season", "我的英雄学院 第五季", "hero-training"],
] as const

for (const [number, alias, title, scene] of additions) {
  test(`sixth batch: ${alias} has a mobile entry, cover and scoped exam`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')
    await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
    await page.getByLabel('目录分段').selectOption('6')
    await expect(page.locator('.catalog-item').filter({ hasText: '50 / 50' })).toHaveCount(11)
    await page.locator(`.catalog-item[data-number="${number}"]`).getByRole('button').click()
    await expect(page.locator('#exam-title')).toHaveText(`${title} · 模拟考试`)
    await expect(page.locator('.quiz-card')).toHaveCount(3)
    const cover = page.locator(`.quiz-card img[src$="/${scene}.svg"]`).first()
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.getByRole('button', { name: '全部 50 题', exact: true }).click()
    await page.getByRole('button', { name: '生成试卷', exact: true }).click()
    await expect(page.getByRole('dialog')).toContainText('50 道单选题')
    await expect(page.getByRole('dialog')).toContainText('剧透')
    if (number === 106) await expect(page.getByRole('dialog')).toContainText('1998年交响组曲')
    if (number === 110) await expect(page.getByRole('dialog')).toContainText('第 89–113 集')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: '全部专区', exact: true }).click()
    await page.getByRole('textbox', { name: '搜索 Quiz' }).fill(alias)
    await expect(page.locator('.quiz-card').filter({ hasText: title })).toHaveCount(3)
    await expect(page.locator('.quiz-card')).toHaveCount(3)
  })
}

test('sixth batch: summary and pending sequel stay consistent', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '查看 200 条目制作目录', exact: true }).click()
  await expect(page.locator('.catalog-summary')).toContainText('111 / 200')
  await expect(page.locator('.catalog-summary')).toContainText('5,550 / 10,000')
  await page.getByLabel('目录分段').selectOption('6')
  const pending = page.locator('.catalog-item[data-number="111"]')
  await expect(pending).toContainText('待制作')
  await expect(pending.getByRole('button')).toHaveCount(0)
})
