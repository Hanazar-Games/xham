import type { Quiz } from '../types'

export interface Response {
  questionId: string
  selected: number | null
  correct: boolean
  points: number
}

export interface GameState {
  quiz: Quiz
  index: number
  phase: 'answering' | 'paused' | 'reveal' | 'finished'
  startedAt: number
  remainingMs: number
  responses: Response[]
}

type GameAction = { questionId: string; now: number } & (
  { type: 'answer'; option: number } | { type: 'tick' | 'next' | 'pause' | 'resume' }
)

export function createGame({ quiz, now }: { quiz: Quiz; now: number }): GameState {
  if (
    !Number.isFinite(now) ||
    !Number.isFinite(quiz.duration) ||
    quiz.duration <= 0 ||
    !quiz.questions.length
  )
    throw new Error('Quiz needs questions, a finite start time and a positive duration')
  const ids = new Set<string>()
  for (const question of quiz.questions) {
    if (
      !question.id ||
      ids.has(question.id) ||
      question.options.length !== 4 ||
      !Number.isInteger(question.answer) ||
      !question.options[question.answer]
    )
      throw new Error('Quiz contains an invalid question')
    ids.add(question.id)
  }
  return {
    quiz,
    index: 0,
    phase: 'answering',
    startedAt: now,
    remainingMs: quiz.duration * 1000,
    responses: [],
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const question = state.quiz.questions[state.index]
  if (
    !Number.isFinite(action.now) ||
    action.questionId !== question.id ||
    state.phase === 'finished'
  )
    return state
  if (action.type === 'next') {
    if (state.phase !== 'reveal') return state
    return state.index === state.quiz.questions.length - 1
      ? { ...state, phase: 'finished' }
      : {
          ...state,
          index: state.index + 1,
          phase: 'answering',
          startedAt: action.now,
          remainingMs: state.quiz.duration * 1000,
        }
  }
  if (action.type === 'resume') {
    return state.phase === 'paused'
      ? {
          ...state,
          phase: 'answering',
          startedAt: action.now - (state.quiz.duration * 1000 - state.remainingMs),
        }
      : state
  }
  if (state.phase !== 'answering') return state
  if (
    action.type === 'answer' &&
    (!Number.isInteger(action.option) ||
      action.option < 0 ||
      action.option >= question.options.length)
  )
    return state

  const durationMs = state.quiz.duration * 1000
  const remainingMs = Math.max(
    0,
    Math.min(state.remainingMs, durationMs - (action.now - state.startedAt)),
  )
  if (action.type === 'pause' && remainingMs > 0) return { ...state, remainingMs, phase: 'paused' }
  if (action.type === 'tick' && remainingMs > 0) return { ...state, remainingMs }
  const selected = action.type === 'answer' && remainingMs > 0 ? action.option : null
  const correct = selected === question.answer
  const points = correct ? state.quiz.mode === 'exam' ? 1 : Math.round(500 + (500 * remainingMs) / durationMs) : 0
  return {
    ...state,
    remainingMs,
    phase: 'reveal',
    responses: [...state.responses, { questionId: question.id, selected, correct, points }],
  }
}

export function summarize(state: GameState) {
  let streak = 0
  let bestStreak = 0
  let score = 0
  let correct = 0
  for (const response of state.responses) {
    score += response.points
    streak = response.correct ? streak + 1 : 0
    if (response.correct) correct++
    bestStreak = Math.max(bestStreak, streak)
  }
  return {
    score: state.quiz.mode === 'exam' ? Math.round((correct / state.quiz.questions.length) * 100) : score,
    correct,
    accuracy: Math.round((correct / state.quiz.questions.length) * 100),
    bestStreak,
  }
}
