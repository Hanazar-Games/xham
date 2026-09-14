import { describe, expect, it } from 'vitest'
import { quizzes } from './quizzes'

describe('built-in question bank', () => {
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
