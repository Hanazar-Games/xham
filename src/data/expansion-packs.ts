import { difficulties, difficultySeconds, type AnimeSeriesId, type Question, type Quiz } from '../types'
import type { BankQuestion, QuestionBank } from './question-banks'
import type { ExpansionEntry } from './expansion-entry'
import { originalArt } from './original-art'
import { titanEntries } from './attack-on-titan'
import { deathNoteEntries } from './death-note'
import { brotherhoodEntries } from './fullmetal-alchemist-brotherhood'
import { onePunchManEntries } from './one-punch-man'

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
  bank('fullmetal-alchemist-brotherhood', '钢之炼金术师 Brotherhood', '仅含 2009–2010 年《钢之炼金术师 FULLMETAL ALCHEMIST》（Brotherhood／FA）电视动画第 1–64 集范围，包含人造人身份、贤者之石与约定之日剧情剧透；不混用 2003 年动画及剧场版设定。', brotherhoodEntries, (reference) => {
    if (reference === 'characters') return { label: 'FA 官网人物资料', url: 'https://www.hagaren.jp/fa/characters/index01.html' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 64) throw new Error('Brotherhood needs a valid episode reference')
    const page = Math.floor((reference - 1) / 10)
    return { label: `FA 官网第 ${reference} 集剧情简介`, url: `https://www.hagaren.jp/fa/about/story${page === 0 ? '' : String(page).padStart(2, '0')}.html` }
  }),
  bank('one-punch-man', '一拳超人 第一季', '仅含 2015 年电视动画第一季第 1–12 集及该季基础人物设定，包含英雄认证、深海王与波罗斯篇剧情剧透；不考第二季、第三季、OVA 或漫画后续剧情，等级以题目指定时点为准。', onePunchManEntries, (reference) => {
    if (reference === 'characters') return { label: '动画官网人物基础资料（页面含后续季度信息）', url: 'https://onepunchman-anime.net/character/' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 12) throw new Error('One Punch Man needs a first-season episode reference')
    return { label: `动画官网第一季第 ${reference} 集简介`, url: `https://onepunchman-anime.net/story/#/season1/${reference}` }
  }),
]

const titles = ['人物与世界入门', '行动与规则应用', '证据与战术推演']
export const expansionQuizzes: Quiz[] = expansionBanks.flatMap((bank) => difficulties.map((difficulty, index) => ({
  id: index === 0 ? bank.series : `${bank.series}-${index === 1 ? 'intermediate' : 'advanced'}`,
  series: bank.series, title: `${bank.title}，${titles[index]}`,
  description: `${bank.title}专题，12 道${difficulty}题。结合剧情与设定判断，每题附原创配图、解析和官方资料链接。`,
  category: '二次元', difficulty, duration: difficultySeconds[difficulty],
  image: originalArt(bank.series === 'attack-on-titan' || bank.series === 'one-punch-man' ? 'arena' : bank.series === 'fullmetal-alchemist-brotherhood' ? 'laboratory' : 'detective'),
  color: index === 0 ? 'mint' : 'lavender', tag: '新 IP · 原创配图',
  scope: `${bank.scope} 配图为原创主题示意图，并非作品场景。`,
  questions: bank.questions.filter((question) => question.difficulty === difficulty).slice(0, 12),
})))

export const expansionAdditions: Partial<Record<AnimeSeriesId, BankQuestion[]>> = Object.fromEntries(expansionBanks.map((bank) => [
  bank.series, difficulties.flatMap((level) => bank.questions.filter((question) => question.difficulty === level).slice(12)),
]))
