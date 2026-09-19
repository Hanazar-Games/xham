import { test, expect } from '@playwright/test'
import { quizzes } from '../src/data/quizzes'

for (const control of ['.card-content h3 button', '.card-footer button']) {
  test(`abandoning a card challenge restores its actual opener: ${control}`, async ({ page }) => {
    await page.goto('/')
    const opener = page.locator('.quiz-card[data-quiz-id="attack-on-titan-season-3-part-2"]').locator(control)
    await opener.click()
    await page.getByRole('button', { name: '准备好了，开始！' }).click()
    await page.getByRole('button', { name: '退出挑战', exact: true }).click()
    await page.getByRole('button', { name: '结束挑战', exact: true }).click()
    await expect(opener).toBeFocused()
    await expect(opener).toBeInViewport()
  })
}

test('exam choices survive search and an abandoned attempt, then reset for another IP', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '进入专区：进击的巨人 第三季后半部', exact: true }).click()
  const setup = page.locator('.exam-setup')
  await setup.getByRole('button', { name: '困难 15 题可用', exact: true }).click()
  await setup.getByRole('button', { name: '全部 15 题', exact: true }).click()
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('雷枪')
  await expect(setup).not.toBeVisible()
  await page.getByRole('button', { name: '清空搜索', exact: true }).click()
  await expect(setup.getByRole('button', { name: '困难 15 题可用', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(setup.getByRole('button', { name: '全部 15 题', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: '生成试卷', exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.getByRole('button', { name: '退出挑战', exact: true }).click()
  await page.getByRole('button', { name: '结束挑战', exact: true }).click()
  await expect(setup.getByRole('button', { name: '困难 15 题可用', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(setup.getByRole('button', { name: '全部 15 题', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: '进入专区：声之形', exact: true }).click()
  await expect(setup.getByRole('button', { name: '混合 50 题可用', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(setup.getByRole('button', { name: '10 题', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

for (const openerName of ['随机来一局', '全站随机抽卷', '开启第一场挑战']) {
  test(`abandoning a random challenge restores its actual opener: ${openerName}`, async ({ page }) => {
    await page.goto('/')
    if (openerName === '开启第一场挑战') await page.getByRole('navigation').getByRole('button', { name: '挑战记录', exact: true }).click()
    const opener = page.getByRole('button', { name: openerName, exact: true })
    await opener.click()
    await page.getByRole('button', { name: '准备好了，开始！' }).click()
    await page.getByRole('button', { name: '退出挑战', exact: true }).click()
    await page.getByRole('button', { name: '结束挑战', exact: true }).click()
    await expect(opener).toBeFocused()
    await expect(opener).toBeInViewport()
  })
}

test('character and skill search reaches matching questions and crossover exams', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('螺旋丸')
  await expect(page.getByRole('button', { name: '开始：跨番联考，能力边界推理', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '开始：火影忍者，木叶成长试卷', exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('库珥修')
  await expect(page.getByRole('button', { name: '开始：跨番联考，人物职业入门', exact: true })).toBeVisible()
})

test('abandoning a saved challenge restores filters and keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const title = '跨番联考，能力边界推理'
  await page.getByRole('button', { name: `收藏：${title}`, exact: true }).click()
  await page.getByRole('navigation').getByRole('button', { name: /^我的收藏/ }).click()
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('跨番')
  await page.getByRole('button', { name: '中等', exact: true }).click()
  await page.getByRole('button', { name: `开始：${title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  await page.getByRole('button', { name: '退出挑战', exact: true }).click()
  await page.getByRole('button', { name: '结束挑战', exact: true }).click()
  await expect(page.locator('h1')).toContainText('收藏')
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toHaveValue('跨番')
  await expect(page.getByRole('button', { name: '中等', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: `开始：${title}`, exact: true })).toBeFocused()
  await expect(page.getByRole('button', { name: `开始：${title}`, exact: true })).toBeInViewport()
})

test('an empty scoped library cannot randomly start an unrelated exam', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('no-such-exam')
  await expect(page.locator('.quiz-card')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '随机来一局', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '重置筛选', exact: true }).click()
  await expect(page.locator('.library-heading h2')).toBeFocused()
  const random = page.getByRole('button', { name: '随机来一局', exact: true })
  await random.click()
  await page.keyboard.press('Escape')
  await expect(random).toBeFocused()
})

test('mobile search hides the directory and switching series restores a reachable focus target', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.getByRole('button', { name: '进入专区：跨番联考', exact: true }).click()
  await page.getByRole('textbox', { name: '搜索 Quiz' }).fill('螺旋丸')
  await expect(page.locator('.anime-hub')).toHaveCount(0)
  await expect(page.locator('.library-heading')).toContainText('搜索结果')
  await page.getByRole('button', { name: '切换专区', exact: true }).click()
  await expect(page.getByRole('textbox', { name: '搜索 Quiz' })).toHaveValue('')
  await expect(page.getByRole('button', { name: '全部专区', exact: true })).toBeFocused()
  await expect(page.getByRole('button', { name: '全部专区', exact: true })).toBeInViewport()
})

test('history review returns to its opener and replay cancellation restores it', async ({ page }) => {
  await page.goto('/')
  const quiz = quizzes.find((quiz) => quiz.id === 'crossover')!
  await page.getByRole('button', { name: `开始：${quiz.title}`, exact: true }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  for (const question of quiz.questions) {
    await page.keyboard.press(String(question.answer + 1))
    await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: '探索更多 Quiz' }).click()
  await page.getByRole('navigation').getByRole('button', { name: '挑战记录', exact: true }).click()
  await page.getByRole('button', { name: '查看成绩', exact: true }).click()
  await page.getByRole('button', { name: '返回挑战记录' }).click()
  await expect(page.getByRole('button', { name: '查看成绩', exact: true })).toBeFocused()
  await page.getByRole('button', { name: '查看成绩', exact: true }).click()
  await page.getByRole('button', { name: '再挑战一次' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '查看成绩', exact: true })).toBeFocused()
  await page.getByRole('button', { name: '查看成绩', exact: true }).click()
  await page.getByRole('button', { name: '再挑战一次' }).click()
  await page.getByRole('button', { name: '准备好了，开始！' }).click()
  for (const question of quiz.questions) {
    await page.keyboard.press(String(question.answer + 1))
    await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: '再挑战一次' }).click()
  await page.getByRole('button', { name: '退出挑战', exact: true }).click()
  await page.getByRole('button', { name: '结束挑战', exact: true }).click()
  await expect(page.locator('.history-item')).toHaveCount(2)
  await expect(page.locator('.history-item').last().getByRole('button', { name: '查看成绩', exact: true })).toBeFocused()
})
