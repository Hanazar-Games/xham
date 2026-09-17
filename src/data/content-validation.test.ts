import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { questionBanks } from './question-banks'
import { questionIssues } from './content-validation'
import { createExam } from '../game/exams'

describe('published question quality', () => {
  const bank = questionBanks[0]
  const question = bank.questions[0]

  it('checks every question, including exam-only additions and crossover questions', () => {
    for (const entry of questionBanks.flatMap((item) => item.questions)) {
      expect(questionIssues(entry), entry.id).toEqual([])
      expect(existsSync(new URL(`../../public${entry.image!.src}`, import.meta.url)), entry.id).toBe(true)
    }
  })

  it('rejects missing images, empty attribution, bad sources and invalid answers', () => {
    for (const entry of [
      { ...question, image: undefined },
      { ...question, image: {} as NonNullable<typeof question.image> },
      { ...question, image: { ...question.image!, src: '' } },
      { ...question, image: { ...question.image!, alt: ' ' } },
      { ...question, image: { ...question.image!, credit: '' } },
      { ...question, source: { label: '', url: 'https://' } },
      { ...question, source: {} as NonNullable<typeof question.source> },
      { ...question, answer: 0.5 },
      { ...question, answer: 4 },
      { ...question, explanation: ' ' },
      { ...question, options: ['a', ' a ', 'c', 'd'] as const },
      { ...question, difficulty: undefined },
    ]) expect(questionIssues(entry).length).toBeGreaterThan(0)
  })

  it('rejects duplicate IDs and invalid difficulty before mixed sampling', () => {
    expect(() => createExam({ ...bank, questions: [question, question] }, '混合', 2)).toThrow(/Invalid question bank/)
    const invalid = { ...question, difficulty: 'unknown' } as unknown as typeof question
    expect(() => createExam({ ...bank, questions: [invalid] }, '混合', 1)).toThrow(/Invalid question bank/)
  })

  it('preserves spoiler boundaries without claiming every bank image is official', () => {
    const rezero = questionBanks.find((item) => item.series === 'rezero')!
    expect(createExam(rezero, '混合', 10).scope).toContain('第 1–2 季')
    for (const entry of questionBanks) {
      const scope = createExam(entry, '混合', 10).scope!
      expect(scope).not.toMatch(/每题配有官方剧照|配图为官方漫画素材|配图来自官方角色资料/)
      expect(scope).toContain('原创')
    }
  })
})
