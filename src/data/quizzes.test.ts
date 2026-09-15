import { describe, expect, it } from 'vitest'
import { quizzes } from './quizzes'
import { createGame, gameReducer, summarize } from '../game/engine'
import { images as imageSources } from '../../public/images/anime/sources.json'

describe('built-in question bank', () => {
  it.each(['ghibli', 'rezero', 'frieren'])(
    '%s has 12 sourced questions and a local cover',
    (id) => {
      const quiz = quizzes.find((item) => item.id === id)
      expect(quiz).toBeDefined()
      expect(quiz!.questions).toHaveLength(12)
      expect(quiz!.image?.src).toMatch(/^\/images\/anime\//)
      for (const question of quiz!.questions) {
        expect(question.source?.url).toMatch(/^https:\/\//)
        expect(question.source?.label.trim()).toBeTruthy()
      }
    },
  )

  it('records source attribution for every referenced image', () => {
    const images = quizzes.flatMap((quiz) => [quiz.image, ...quiz.questions.map((q) => q.image)])
    for (const image of images.filter((image) => image !== undefined)) {
      expect(imageSources.some((source) => `/images/anime/${source.file}` === image.src)).toBe(true)
      expect(image.credit.trim()).toBeTruthy()
      expect(image.alt.trim()).toBeTruthy()
      expect(image.sourceUrl).toMatch(/^https:\/\//)
    }
  })
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
