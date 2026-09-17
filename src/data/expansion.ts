import catalog from '../../docs/quiz-expansion/catalog.json'
import { questionBanks } from './question-banks'
import { animeSeries } from './anime-series'
import { quizzes } from './quizzes'

const mappings: Record<string, string> = catalog.existingBanks
const notes: Record<number, string> = {
  23: '已有跨季题库，待按季度整理',
  128: '已有跨季题库，待按季度整理',
  173: '已有跨季题库，待按季度整理',
  44: '已有电影综合题库，待单独整理',
  99: '已有电影综合题库，待单独整理',
  106: '已有电影综合题库，待单独整理',
  144: '已有电影综合题库，待单独整理',
}

export const expansionItems = catalog.entries.map((entry) => {
  const candidate = questionBanks.find((bank) => bank.series === mappings[entry.id])
  const ready = candidate?.questions.length === catalog.questionsPerTitle &&
    candidate.questions.every((q) => q.image && q.source) &&
    Object.entries(catalog.difficultyTargets).every(([level, count]) => candidate.questions.filter((q) => q.difficulty === level).length === count)
  const bank = ready ? candidate : undefined
  const series = animeSeries.find((item) => item.id === bank?.series)
  return {
    ...entry, bank,
    searchText: `${entry.title} ${series?.title ?? ''} ${series?.aliases ?? ''}`.normalize('NFKC').toLowerCase(),
    note: bank ? quizzes.find((quiz) => quiz.id === bank.series)?.scope?.replace(/每题\s*\d+\s*秒。?/g, '').trim() : notes[entry.number],
  }
})

export const expansionTarget = catalog.questionsPerTitle
export const expansionBatchCount = Math.ceil(expansionItems.length / catalog.batchSize)
export const expansionReady = expansionItems.filter((item) => item.bank).length

export function filterExpansion(batch: number | 'all', query: string) {
  const terms = query.normalize('NFKC').trim().toLowerCase().split(/\s+/).filter(Boolean)
  return expansionItems.filter((item) => (batch === 'all' || item.batch === batch) && terms.every((term) => item.searchText.includes(term)))
}
