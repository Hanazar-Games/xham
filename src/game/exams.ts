import { difficulties, difficultySeconds, type Difficulty, type Quiz } from '../types'
import type { BankQuestion, QuestionBank } from '../data/question-banks'
import { originalArt } from '../data/original-art'
import { questionIssues } from '../data/content-validation'

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function createExam(bank: QuestionBank, difficulty: Difficulty | '混合', count: number, random = Math.random): Quiz {
  if (new Set(bank.questions.map((q) => q.id)).size !== bank.questions.length ||
      bank.questions.some((q) => questionIssues(q).length > 0)) throw new Error('Invalid question bank')
  const eligible = bank.questions.filter((q) => difficulty === '混合' || q.difficulty === difficulty)
  if (!Number.isInteger(count) || count < 1 || count > eligible.length) throw new Error('Invalid exam question count')
  let questions: BankQuestion[]
  if (difficulty === '混合') {
    const pools = shuffle(difficulties, random).map((level) => shuffle(eligible.filter((q) => q.difficulty === level), random))
    questions = []
    while (questions.length < count) {
      for (const pool of pools) {
        const question = pool.pop()
        if (question) questions.push(question)
        if (questions.length === count) break
      }
    }
  } else questions = shuffle(eligible, random).slice(0, count)
  return {
    id: `exam-${bank.series}`, series: bank.series, category: '二次元', mode: 'exam',
    title: `${bank.title} · ${difficulty}考试`, difficulty,
    description: `从 ${eligible.length} 道题中抽取 ${count} 题，每轮不重复。交卷后公布答案与解析。`,
    color: 'mint', tag: 'IP 考试', image: originalArt('academy'),
    duration: difficulty === '混合' ? 30 : difficultySeconds[difficulty],
    scope: `${bank.scope} 限时单选，选择后锁定，不能返回修改；超时视为未作答。允许暂停。按正确率折算百分制，60 分及格，不计速度奖励。`,
    questions: shuffle(questions, random).map((question) => {
      const order = shuffle([0, 1, 2, 3], random)
      return { ...question, options: order.map((index) => question.options[index]) as [string, string, string, string], answer: order.indexOf(question.answer) }
    }),
  }
}
