import { difficulties, difficultySeconds, type AnimeSeriesId, type Question, type Quiz } from '../types'
import type { BankQuestion, QuestionBank } from './question-banks'
import type { ExpansionEntry } from './expansion-entry'
import { originalArt } from './original-art'
import { titanEntries } from './attack-on-titan'
import { deathNoteEntries } from './death-note'

function bank(series: AnimeSeriesId, title: string, scope: string, entries: ExpansionEntry[], source: (reference: ExpansionEntry[0]) => NonNullable<Question['source']>): QuestionBank {
  if (entries.length !== 50) throw new Error(`Expected 50 questions: ${series}`)
  return {
    series, title, scope,
    questions: entries.map(([reference, scene, prompt, choices, explanation], index) => {
      const answer = index % 4
      const options: [string, string, string, string] = [...choices]
      ;[options[0], options[answer]] = [options[answer], options[0]]
      return {
        id: `${series}-${String(index + 1).padStart(2, '0')}`,
        difficulty: index < 18 ? '简单' : index < 35 ? '中等' : '困难',
        prompt, options, answer, explanation, image: originalArt(scene), source: source(reference),
      }
    }),
  }
}

export const expansionBanks = [
  bank('attack-on-titan', '进击的巨人 第一季', '仅含电视动画第一季第 1–25 集及第一季术语，包含女型巨人身份剧透；不考第二季及后续内容。', titanEntries, (reference) => ({
    label: reference === 'terms' ? '第一季官网术语表' : `第一季官网第 ${reference} 集简介`,
    url: reference === 'terms' ? 'https://shingeki.tv/season1/yougo/' : `https://shingeki.tv/season1/story/episode_${String(reference).padStart(2, '0')}.php`,
  })),
  bank('death-note', '死亡笔记', '仅含 2006–2007 年电视动画第 1–37 集，包含结局与关键人物命运剧透；不混用真人版和漫画版结局。', deathNoteEntries, (reference) => {
    if (typeof reference !== 'number') throw new Error('Death Note needs an episode reference')
    return { label: `日本电视台动画第 ${reference} 集剧情资料`, url: `https://www.ntv.co.jp/deathnote/static/story${reference <= 19 ? '' : '2'}.html` }
  }),
]

const titles = ['人物与世界入门', '行动与规则应用', '证据与战术推演']
export const expansionQuizzes: Quiz[] = expansionBanks.flatMap((bank) => difficulties.map((difficulty, index) => ({
  id: index === 0 ? bank.series : `${bank.series}-${index === 1 ? 'intermediate' : 'advanced'}`,
  series: bank.series, title: `${bank.title}，${titles[index]}`,
  description: `${bank.title}专题，12 道${difficulty}题。结合剧情与设定判断，每题附原创配图、解析和官方资料链接。`,
  category: '二次元', difficulty, duration: difficultySeconds[difficulty],
  image: originalArt(bank.series === 'attack-on-titan' ? 'arena' : 'detective'),
  color: index === 0 ? 'mint' : 'lavender', tag: '新 IP · 原创配图',
  scope: `${bank.scope} 配图为原创主题示意图，并非作品场景。`,
  questions: bank.questions.filter((question) => question.difficulty === difficulty).slice(0, 12),
})))

export const expansionAdditions: Partial<Record<AnimeSeriesId, BankQuestion[]>> = Object.fromEntries(expansionBanks.map((bank) => [
  bank.series, difficulties.flatMap((level) => bank.questions.filter((question) => question.difficulty === level).slice(12)),
]))
