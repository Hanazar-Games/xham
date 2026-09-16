import { describe, expect, it } from 'vitest'
import type { Quiz } from '../types'
import { createGame, gameReducer, summarize } from './engine'

const quiz: Quiz = {
  id: 'test',
  title: 'Test',
  description: '',
  category: '二次元',
  series: 'ghibli',
  difficulty: '简单',
  color: 'green',
  tag: '',
  duration: 20,
  questions: [
    { id: 'a', prompt: 'A?', options: ['A', 'B', 'C', 'D'], answer: 1, explanation: 'B' },
    { id: 'b', prompt: 'B?', options: ['A', 'B', 'C', 'D'], answer: 0, explanation: 'A' },
  ],
}

describe('quiz game', () => {
  it('freezes a paused question and resumes without charging paused time', () => {
    let state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'pause',
      questionId: 'a',
      now: 5_000,
    })
    expect(state.phase).toBe('paused')
    expect(state.remainingMs).toBe(15_000)
    expect(gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: 50_000 })).toBe(
      state,
    )
    expect(gameReducer(state, { type: 'tick', questionId: 'a', now: 50_000 })).toBe(state)
    state = gameReducer(state, { type: 'resume', questionId: 'a', now: 50_000 })
    state = gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: 55_000 })
    expect(state.responses[0].points).toBe(750)
  })

  it('cannot rescue an expired question by pausing at the deadline', () => {
    const state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'pause',
      questionId: 'a',
      now: 20_000,
    })
    expect(state.phase).toBe('reveal')
    expect(state.responses[0].selected).toBeNull()
  })

  it('never increases remaining time when an older event arrives', () => {
    let state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'tick',
      questionId: 'a',
      now: 10_000,
    })
    state = gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: 5_000 })
    expect(state.responses[0].points).toBe(750)
  })

  it.each([NaN, Infinity, 0, -1])('rejects invalid duration %s', (duration) => {
    expect(() => createGame({ quiz: { ...quiz, duration }, now: 0 })).toThrow()
  })

  it('rejects missing answers and duplicate question IDs before a game starts', () => {
    expect(() =>
      createGame({ quiz: { ...quiz, questions: [{ ...quiz.questions[0], answer: 5 }] }, now: 0 }),
    ).toThrow()
    expect(() =>
      createGame({ quiz: { ...quiz, questions: [quiz.questions[0], quiz.questions[0]] }, now: 0 }),
    ).toThrow()
    expect(() => createGame({ quiz, now: NaN })).toThrow()
  })

  it('starts with a full countdown and no score', () => {
    const state = createGame({ quiz, now: 100 })
    expect(state.phase).toBe('answering')
    expect(state.remainingMs).toBe(20_000)
    expect(summarize(state).score).toBe(0)
  })

  it('awards speed-weighted points only for a correct answer', () => {
    const state = createGame({ quiz, now: 0 })
    const correct = gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: 5_000 })
    expect(correct.phase).toBe('reveal')
    expect(correct.responses[0].points).toBe(875)
    const wrong = gameReducer(state, { type: 'answer', questionId: 'a', option: 0, now: 5_000 })
    expect(wrong.responses[0].points).toBe(0)
    expect(wrong.responses[0].correct).toBe(false)
  })

  it('locks the answer against repeated clicks', () => {
    const state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'answer',
      questionId: 'a',
      option: 1,
      now: 1_000,
    })
    expect(gameReducer(state, { type: 'answer', questionId: 'a', option: 0, now: 2_000 })).toBe(
      state,
    )
  })

  it('expires using elapsed time even when timer callbacks are delayed', () => {
    const state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'tick',
      questionId: 'a',
      now: 28_000,
    })
    expect(state.phase).toBe('reveal')
    expect(state.remainingMs).toBe(0)
    expect(state.responses[0]).toMatchObject({ selected: null, correct: false, points: 0 })
  })

  it('treats an answer at the deadline as a timeout', () => {
    const state = gameReducer(createGame({ quiz, now: 0 }), {
      type: 'answer',
      questionId: 'a',
      option: 1,
      now: 20_000,
    })
    expect(state.responses[0].selected).toBeNull()
    expect(state.responses[0].points).toBe(0)
  })

  it('ignores invalid options, stale events, and advancing before answering', () => {
    const state = createGame({ quiz, now: 0 })
    expect(gameReducer(state, { type: 'answer', questionId: 'a', option: 9, now: 1 })).toBe(state)
    expect(gameReducer(state, { type: 'answer', questionId: 'a', option: 1.5, now: 1 })).toBe(state)
    expect(gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: NaN })).toBe(state)
    expect(gameReducer(state, { type: 'tick', questionId: 'b', now: 50_000 })).toBe(state)
    expect(gameReducer(state, { type: 'next', questionId: 'a', now: 1 })).toBe(state)
  })

  it('resets each timer and finishes with accurate totals and streak', () => {
    let state = createGame({ quiz, now: 0 })
    state = gameReducer(state, { type: 'answer', questionId: 'a', option: 1, now: 0 })
    state = gameReducer(state, { type: 'next', questionId: 'a', now: 3_000 })
    expect(state.index).toBe(1)
    expect(state.remainingMs).toBe(20_000)
    expect(gameReducer(state, { type: 'tick', questionId: 'a', now: 99_000 })).toBe(state)
    state = gameReducer(state, { type: 'answer', questionId: 'b', option: 0, now: 13_000 })
    state = gameReducer(state, { type: 'next', questionId: 'b', now: 15_000 })
    expect(state.phase).toBe('finished')
    expect(summarize(state)).toEqual({ score: 1750, correct: 2, accuracy: 100, bestStreak: 2 })
    expect(gameReducer(state, { type: 'next', questionId: 'b', now: 16_000 })).toBe(state)
  })

  it('rejects an empty quiz and resets all progress in a new game', () => {
    expect(() => createGame({ quiz: { ...quiz, questions: [] }, now: 0 })).toThrow()
    expect(createGame({ quiz, now: 100 }).responses).toEqual([])
  })
})
