import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes } from './expansion-packs'
import catalog from '../../docs/quiz-expansion/catalog.json'

const additions = [
  ['durarara', '第一季第 1–24 集', 'urban-rider'],
  ['kaguya-sama-season-2', '第二季第 1–12 集', 'student-council'],
  ['bakemonogatari', '第 1–15 集', 'oddities'],
  ['howls-moving-castle', '2004年动画电影', 'walking-castle'],
  ['hyouka', '第 1–22 集', 'anthology'],
] as const

describe('catalog titles 96–100', () => {
  it.each(additions)('%s exposes 50 illustrated questions in its own continuity', (series, scope, scene) => {
    const bank = expansionBanks.find((item) => String(item.series) === series)
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain(scope)
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => q.prompt)).size).toBe(50)
    expect(['简单', '中等', '困难'].map((level) => bank!.questions.filter((q) => q.difficulty === level).length)).toEqual([18, 17, 15])
    expect(bank!.questions.some((q) => q.image?.src === `/images/original/${scene}.svg`)).toBe(true)
    for (const question of bank!.questions) {
      expect(question.image?.src).toMatch(/^\/images\/original\/[\w-]+\.svg$/)
      expect(question.explanation.length).toBeGreaterThan(15)
      expect(question.source?.url).toMatch(/^https:\/\//)
    }
    const quizzes = expansionQuizzes.filter((quiz) => String(quiz.series) === series)
    expect(quizzes.map((quiz) => quiz.questions.length)).toEqual([12, 12, 12])
    const practiceIds = new Set(quizzes.flatMap((quiz) => quiz.questions.map((q) => q.id)))
    expect(bank!.questions.filter((q) => !practiceIds.has(q.id))).toHaveLength(14)
  })

  it('completes the fifth catalog segment without opening the next pending title', () => {
    const mappings = catalog.existingBanks as Record<string, string>
    additions.forEach(([series], index) => expect(mappings[`title-${String(96 + index).padStart(3, '0')}`]).toBe(series))
    expect(mappings['title-122']).toBeUndefined()
  })

  it('includes the last Bakemonogatari episode and keeps the television Hyouka timeline', () => {
    const bake = expansionBanks.find((bank) => String(bank.series) === 'bakemonogatari')
    expect(bake?.questions.some((q) => q.source?.url === 'https://www.b-ch.com/titles/2774/015')).toBe(true)
    const hyouka = expansionBanks.find((bank) => String(bank.series) === 'hyouka')
    const history = hyouka?.questions.find((q) => q.prompt.includes('多少年前'))
    expect(history?.options[history.answer]).toBe('45年前')
  })
})
