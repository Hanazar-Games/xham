import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes } from './expansion-packs'
import catalog from '../../docs/quiz-expansion/catalog.json'

const additions = [
  ['made-in-abyss', '第一季第 1–13 集', 'abyss'],
  ['attack-on-titan-final-season-part-2', '第 76–87 集', 'walls'],
  ['high-school-dxd', '第一季第 1–12 集', 'pact'],
  ['fire-force', '第一季第 1–24 集', 'fire-rescue'],
  ['clannad', '第一季第 1–22 集', 'theater'],
] as const

describe('catalog titles 91–95', () => {
  it.each(additions)('%s has a complete illustrated bank within its own continuity', (series, scope, scene) => {
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
    expect(expansionQuizzes.filter((quiz) => String(quiz.series) === series).map((quiz) => quiz.questions.length)).toEqual([12, 12, 12])
  })

  it('registers the new titles and restores the two existing catalog links', () => {
    const mappings = catalog.existingBanks as Record<string, string>
    expect(mappings['title-089']).toBe('mushoku-tensei')
    expect(mappings['title-090']).toBe('bungo-stray-dogs')
    additions.forEach(([series], index) => expect(mappings[`title-0${91 + index}`]).toBe(series))
  })

  it('uses the Part 2 endpoint for inherited powers without importing the finale', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'attack-on-titan-final-season-part-2')
    expect(bank).toBeDefined()
    const jaw = bank!.questions.find((q) => q.prompt.includes('Part 2 结束时') && q.prompt.includes('颚之巨人'))!
    expect(jaw.options[jaw.answer]).toBe('法尔科')
    expect(jaw.source?.url).toBe('https://shingeki.tv/final/keyword/')
    expect(bank!.scope).toContain('不混入完结篇')
  })
})
