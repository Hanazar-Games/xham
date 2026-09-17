import type { AnimeSeriesId, Difficulty, Question } from '../types'
import { animeSeries } from './anime-series'
import { quizzes } from './quizzes'
import { bankAdditions } from './bank-additions'
import { expansionAdditions } from './expansion-packs'

export type BankQuestion = Question & { difficulty: Difficulty }
export interface QuestionBank {
  series: AnimeSeriesId
  title: string
  scope: string
  questions: BankQuestion[]
}

export const questionBanks: QuestionBank[] = animeSeries.map((series) => ({
  series: series.id,
  title: series.title,
  scope: `${quizzes.find((quiz) => quiz.id === series.id)!.scope!
    .replace(/每题\s*\d+\s*秒。?|每题配有官方剧照。|配图为官方漫画素材。|配图来自官方角色资料。/g, '')
    .trim().replace(/；$/, '。')} 题库包含原创主题示意图，各题图片类型与来源以署名为准。`,
  questions: [
    ...quizzes.filter((quiz) => quiz.series === series.id).flatMap((quiz) => quiz.questions.map((question) => {
      if (quiz.difficulty === '混合') throw new Error('Practice packs need a single difficulty')
      return { ...question, difficulty: quiz.difficulty }
    })),
    ...(bankAdditions[series.id] ?? []),
    ...(expansionAdditions[series.id] ?? []),
  ],
}))
