import { describe, expect, it } from 'vitest'
import { quizzes } from './quizzes'
import { createGame, gameReducer, summarize } from '../game/engine'

describe('built-in question bank', () => {
  it.each(quizzes)('$title completes with correct scoring and clean replay', (quiz) => {
    let now = 0
    let game = createGame({ quiz, now })
    for (const question of quiz.questions) {
      now += quiz.duration * 500
      game = gameReducer(game, {
        type: 'answer',
        questionId: question.id,
        option: question.answer,
        now,
      })
      expect(game.phase).toBe('reveal')
      game = gameReducer(game, { type: 'next', questionId: question.id, now })
    }
    expect(game.phase).toBe('finished')
    expect(summarize(game)).toEqual({
      score: quiz.questions.length * 750,
      correct: quiz.questions.length,
      accuracy: 100,
      bestStreak: quiz.questions.length,
    })
    expect(summarize(createGame({ quiz, now })).score).toBe(0)
  })

  it('has unique quiz and question identifiers', () => {
    expect(new Set(quizzes.map((quiz) => quiz.id)).size).toBe(quizzes.length)
    const ids = quizzes.flatMap((quiz) => quiz.questions.map((question) => question.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(quizzes)('$title has playable questions and explanations', (quiz) => {
    expect(quiz.questions.length).toBeGreaterThan(0)
    expect(quiz.duration).toBeGreaterThan(0)
    for (const question of quiz.questions) {
      expect(question.options).toHaveLength(4)
      expect(new Set(question.options).size).toBe(4)
      expect(Number.isInteger(question.answer)).toBe(true)
      expect(question.options[question.answer]).toBeTruthy()
      expect(question.prompt.trim()).not.toBe('')
      expect(question.explanation.trim()).not.toBe('')
    }
  })
})
