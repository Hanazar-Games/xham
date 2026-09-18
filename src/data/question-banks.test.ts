import { describe, expect, it } from 'vitest'
import { questionBanks } from './question-banks'
import { createExam } from '../game/exams'
import { createGame, gameReducer, summarize } from '../game/engine'
import { existsSync } from 'node:fs'

describe('IP question banks and exams', () => {
  it('provides exactly 50 sourced illustrated questions in three levels for each IP', () => {
    const banks = questionBanks.filter((bank) => bank.series !== 'crossover')
    expect(banks).toHaveLength(9)
    for (const bank of banks) {
      expect(bank.questions).toHaveLength(50)
      expect(new Set(bank.questions.map((q) => q.id)).size).toBe(50)
      expect(new Set(bank.questions.map((q) => q.prompt)).size).toBe(50)
      expect(['简单', '中等', '困难'].map((level) => bank.questions.filter((q) => q.difficulty === level).length)).toEqual([18, 17, 15])
      for (const question of bank.questions) {
        expect(question.image?.src).toMatch(/^\/images\//)
        expect(existsSync(new URL(`../../public${question.image!.src}`, import.meta.url))).toBe(true)
        expect(question.source?.url).toMatch(/^https:\/\//)
        expect(question.explanation.trim()).toBeTruthy()
        expect(new Set(question.options).size).toBe(4)
        expect(question.options[question.answer]).toBeTruthy()
      }
    }
  })

  it('draws distinct questions at the requested level without mutating the bank', () => {
    const bank = questionBanks[1]
    const original = JSON.stringify(bank)
    const exam = createExam(bank, '中等', 10, () => 0.25)
    expect(exam.questions).toHaveLength(10)
    expect(new Set(exam.questions.map((q) => q.id)).size).toBe(10)
    expect(exam.questions.every((q) => q.difficulty === '中等')).toBe(true)
    expect(JSON.stringify(bank)).toBe(original)
    expect(exam.mode).toBe('exam')
    for (const question of exam.questions) {
      const originalQuestion = bank.questions.find((item) => item.id === question.id)!
      expect(question.options[question.answer]).toBe(originalQuestion.options[originalQuestion.answer])
      expect(new Set(question.options)).toEqual(new Set(originalQuestion.options))
    }
  })

  it('keeps global IDs unique and produces new orders while preserving full bank membership', () => {
    const questions = questionBanks.flatMap((bank) => bank.questions)
    expect(questions).toHaveLength(522)
    expect(new Set(questions.map((q) => q.id)).size).toBe(522)
    const bank = questionBanks[1]
    const first = createExam(bank, '混合', 50, () => 0.1)
    const second = createExam(bank, '混合', 50, () => 0.9)
    expect(first.questions.map((q) => q.id)).not.toEqual(second.questions.map((q) => q.id))
    expect(new Set(first.questions.map((q) => q.id))).toEqual(new Set(second.questions.map((q) => q.id)))
  })

  it('balances mixed papers across all three levels and rejects impossible counts', () => {
    const bank = questionBanks[1]
    for (const count of [10, 20, 50]) {
      const exam = createExam(bank, '混合', count)
      expect(exam.questions).toHaveLength(count)
      expect(new Set(exam.questions.map((q) => q.id)).size).toBe(count)
      const counts = ['简单', '中等', '困难'].map((level) => exam.questions.filter((q) => q.difficulty === level).length)
      expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(count === 50 ? 3 : 1)
    }
    for (const count of [0, -1, 1.5, NaN, 51]) expect(() => createExam(bank, '混合', count)).toThrow()
    expect(() => createExam(bank, '困难', 20)).toThrow()
  })

  it('scores exams by accuracy, with no speed bonus, and supports a full 50-question paper', () => {
    const quiz = createExam(questionBanks[1], '混合', 50)
    let state = createGame({ quiz, now: 0 })
    quiz.questions.forEach((question, index) => {
      const option = index < 40 ? question.answer : (question.answer + 1) % 4
      state = gameReducer(state, { type: 'answer', questionId: question.id, option, now: index * 30_000 + 29_000 })
      state = gameReducer(state, { type: 'next', questionId: question.id, now: (index + 1) * 30_000 })
    })
    expect(state.phase).toBe('finished')
    expect(summarize(state)).toMatchObject({ score: 80, correct: 40, accuracy: 80 })
    expect(summarize(createGame({ quiz, now: 0 })).score).toBe(0)
  })

  it.each([0, 5, 6, 10])('scores %i correct answers on a ten-question paper independently of speed', (correctCount) => {
    for (const delay of [1, 19_000]) {
      const quiz = createExam(questionBanks[1], '简单', 10)
      let state = createGame({ quiz, now: 0 })
      quiz.questions.forEach((question, index) => {
        state = gameReducer(state, { type: 'answer', questionId: question.id, option: index < correctCount ? question.answer : (question.answer + 1) % 4, now: index * 20_000 + delay })
        state = gameReducer(state, { type: 'next', questionId: question.id, now: (index + 1) * 20_000 })
      })
      expect(summarize(state).score).toBe(correctCount * 10)
    }
  })
})
