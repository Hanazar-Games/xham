import type { AnimeSeriesId, Difficulty, Question } from '../types'
import { animeSeries } from './anime-series'
import { quizzes } from './quizzes'
import { bankAdditions } from './bank-additions'

export type BankQuestion = Question & { difficulty: Difficulty }
export interface QuestionBank {
  series: AnimeSeriesId
  title: string
  questions: BankQuestion[]
}

export const questionBanks: QuestionBank[] = animeSeries.map((series) => ({
  series: series.id,
  title: series.title,
  questions: [
    ...quizzes.filter((quiz) => quiz.series === series.id).flatMap((quiz) => quiz.questions.map((question) => {
      if (quiz.difficulty === '混合') throw new Error('Practice packs need a single difficulty')
      return { ...question, difficulty: quiz.difficulty }
    })),
    ...(bankAdditions[series.id] ?? []),
  ],
}))
