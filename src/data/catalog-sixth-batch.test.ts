import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes } from './expansion-packs'
import catalog from '../../docs/quiz-expansion/catalog.json'

const additions = [
  ['chunibyo-season-1', '第一季第 1–12 集', 'eyepatch'],
  ['seraph-of-the-end', '第 1–12 集', 'blood-moon'],
  ['classroom-of-the-elite', '第一季第 1–12 集', 'merit-class'],
  ['madoka-magica', '第 1–12 集', 'soul-gem'],
  ['tokyo-revengers', '第一季第 1–24 集', 'time-rider'],
  ['princess-mononoke', '1997年动画电影', 'forest-spirit'],
  ['dororo', '2019年电视动画第 1–24 集', 'prosthetic-sword'],
  ['jojo-stardust-crusaders', '第 1–24 集', 'star-journey'],
  ['samurai-champloo', '第 1–26 集', 'sunflower'],
  ['my-hero-academia-season-5', '第 89–113 集', 'hero-training'],
] as const

describe('catalog titles 101–110', () => {
  it.each(additions)('%s adds an illustrated bank with a distinct scope', (series, scope, scene) => {
    const bank = expansionBanks.find((item) => String(item.series) === series)
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain(scope)
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => q.prompt)).size).toBe(50)
    expect(['简单', '中等', '困难'].map((level) => bank!.questions.filter((q) => q.difficulty === level).length)).toEqual([18, 17, 15])
    for (const question of bank!.questions) {
      expect(question.image?.src).toMatch(/^\/images\/original\/[\w-]+\.svg$/)
      expect(question.source?.url).toMatch(/^https:\/\//)
      expect(question.explanation.length).toBeGreaterThan(15)
    }
    const quizzes = expansionQuizzes.filter((quiz) => String(quiz.series) === series)
    expect(quizzes.map((quiz) => quiz.questions.length)).toEqual([12, 12, 12])
    expect(quizzes.every((quiz) => quiz.image?.src === `/images/original/${scene}.svg`)).toBe(true)
    const practice = new Set(quizzes.flatMap((quiz) => quiz.questions.map((q) => q.id)))
    expect(bank!.questions.filter((q) => !practice.has(q.id))).toHaveLength(14)
  })

  it('opens precisely the next ten catalog entries', () => {
    const mappings = catalog.existingBanks as Record<string, string>
    additions.forEach(([series], index) => expect(mappings[`title-${101 + index}`]).toBe(series))
    expect(mappings['title-182']).toBe('ancient-magus')
  })
})
