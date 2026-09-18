import { difficulties, difficultySeconds, type AnimeSeriesId, type Question, type Quiz } from '../types'
import type { BankQuestion, QuestionBank } from './question-banks'
import type { ExpansionEntry } from './expansion-entry'
import { originalArt } from './original-art'
import { titanEntries } from './attack-on-titan'
import { deathNoteEntries } from './death-note'
import { brotherhoodEntries } from './fullmetal-alchemist-brotherhood'
import { onePunchManEntries } from './one-punch-man'
import { myHeroAcademiaEntries } from './my-hero-academia'
import { swordArtOnlineEntries } from './sword-art-online'
import { hunterXHunterEntries } from './hunter-x-hunter'
import { jujutsuKaisenEntries } from './jujutsu-kaisen'
import { tokyoGhoulEntries } from './tokyo-ghoul'

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
  bank('my-hero-academia', '我的英雄学院 第一季', '仅含 2016 年电视动画第一季第 1–13 集，包含入学考核、对人战斗训练与 USJ 袭击剧情剧透；不考第二季体育祭、后续季度、OVA 或剧场版，能力以第一季披露的信息为准。', myHeroAcademiaEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 13) throw new Error('My Hero Academia needs a first-season episode reference')
    return { label: `读卖电视台第一季第 ${reference} 集简介（入口含后续剧透）`, url: 'https://www.ytv.co.jp/heroaca/story/' }
  }),
  bank('sword-art-online', '刀剑神域 第一季', '仅含 2012 年电视动画第一季第 1–25 集，即艾恩葛朗特篇与妖精之舞篇，包含隐藏身份、SAO 结局与世界树救援剧透；不考 SAO II、Extra Edition、后续季度或剧场版，不混用 Progressive 的改编细节。', swordArtOnlineEntries, (reference) => {
    if (reference === 'characters') return { label: '妖精之舞篇官网简介与人物资料', url: 'https://www.swordart-online.net/fairy/' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 25) throw new Error('Sword Art Online needs a first-season episode reference')
    return { label: `动画官网第一季第 ${reference} 集简介`, url: `https://www.swordart-online.net/${reference <= 14 ? 'aincrad' : 'fairy'}/story/?id=ep${String(reference).padStart(2, '0')}` }
  }),
  bank('hunter-x-hunter', '全职猎人 2011版', '限定 2011 年开播的日本电视台版动画第 1–148 集，重点考念能力、制约与贪婪之岛规则，含猎人考试、旅团、嵌合蚁及父子相会剧情剧透；不混用 1999 年版、OVA、剧场版或动画结束后的漫画设定。', hunterXHunterEntries, (reference) => {
    if (reference === 'terms') return { label: '日本电视台动画官网术语与规则', url: 'https://www.ntv.co.jp/hunterhunter/dictionary/index.html' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 148) throw new Error('Hunter x Hunter needs a 2011-series episode reference')
    return { label: `日本电视台2011版第 ${reference} 集简介`, url: `https://www.ntv.co.jp/hunterhunter/story/${String(reference).padStart(3, '0')}.html` }
  }),
  bank('jujutsu-kaisen', '咒术回战 第一季', '仅含 2020–2021 年电视动画第一季第 1–24 集，包含少年院、顺平、京都交流会及起首雷同篇剧情剧透；不考第二季、剧场版 0、后续季度或漫画后续设定。', jujutsuKaisenEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 24) throw new Error('Jujutsu Kaisen needs a first-season episode reference')
    return { label: `Bandai Channel 第一季第 ${reference} 集剧情简介`, url: `https://www.b-ch.com/titles/7071/${String(reference).padStart(3, '0')}` }
  }),
  bank('tokyo-ghoul', '东京喰种 第一季', '仅含 2014 年电视动画第一季第 1–12 集及官网基础术语，包含利世、凉子、月山与青桐树篇剧情剧透；不混用 √A 第二季、:re、OVA、真人版或漫画独有剧情。', tokyoGhoulEntries, (reference) => {
    if (reference === 'terms') return { label: '动画官网基础术语表', url: 'https://www.marv.jp/special/tokyoghoul/first/glossary.html' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 12) throw new Error('Tokyo Ghoul needs a first-season episode reference')
    return { label: `动画官网第一季第 ${reference} 集简介`, url: 'https://www.marv.jp/special/tokyoghoul/first/story_1st.html' }
  }),
]

const titles = ['人物与世界入门', '行动与规则应用', '证据与战术推演']
export const expansionQuizzes: Quiz[] = expansionBanks.flatMap((bank) => difficulties.map((difficulty, index) => ({
  id: index === 0 ? bank.series : `${bank.series}-${index === 1 ? 'intermediate' : 'advanced'}`,
  series: bank.series, title: `${bank.title}，${titles[index]}`,
  description: `${bank.title}专题，12 道${difficulty}题。结合剧情与设定判断，每题附原创配图、解析和官方资料链接。`,
  category: '二次元', difficulty, duration: difficultySeconds[difficulty],
  image: originalArt(bank.series === 'tokyo-ghoul' ? 'city' : bank.series === 'jujutsu-kaisen' ? 'magic' : bank.series === 'hunter-x-hunter' ? 'adventure' : bank.series === 'my-hero-academia' ? 'academy' : bank.series === 'attack-on-titan' || bank.series === 'one-punch-man' || bank.series === 'sword-art-online' ? 'arena' : bank.series === 'fullmetal-alchemist-brotherhood' ? 'laboratory' : 'detective'),
  color: index === 0 ? 'mint' : 'lavender', tag: '新 IP · 原创配图',
  scope: `${bank.scope} 配图为原创主题示意图，并非作品场景。`,
  questions: bank.questions.filter((question) => question.difficulty === difficulty).slice(0, 12),
})))

export const expansionAdditions: Partial<Record<AnimeSeriesId, BankQuestion[]>> = Object.fromEntries(expansionBanks.map((bank) => [
  bank.series, difficulties.flatMap((level) => bank.questions.filter((question) => question.difficulty === level).slice(12)),
]))
