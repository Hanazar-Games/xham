import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes, expansionAdditions } from './expansion-packs'
import { questionIssues } from './content-validation'

describe('catalog additions', () => {
  it('separates Hero Academia season two and preserves festival and training mechanics', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'my-hero-academia-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 14–38 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['20', '1000万分'], ['28', '让力量遍布全身'], ['36', '左侧火焰、右侧冰冻']]) {
      const q = bank!.questions.find((q) => q.id === `my-hero-academia-season-2-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.label))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => `读卖电视台第二季累计第 ${i + 14} 集简介`)))
  })
  it('scopes Shippuden to the Kazekage rescue and preserves its combat constraints', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'naruto-shippuden')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–32 集')
    expect(bank!.scope).toContain('风影夺还篇')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['25', '同时揭下五张符'], ['30', '约三分钟'], ['36', '解毒只暂时处理毒性，不等于治好所有创伤或永久免疫']]) {
      const q = bank!.questions.find((q) => q.id === `naruto-shippuden-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    for (const q of bank!.questions) expect(Number(q.source!.url.split('/').at(-1))).toBeLessThanOrEqual(32)
  })
  it('keeps Steins Gate in the 2011 TV scope with distinct mail and memory mechanisms', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'steins-gate')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–24 集')
    expect(bank!.scope).toContain('不混用')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => Number(q.source!.url.split('/').at(-1))))).toEqual(new Set(Array.from({ length: 24 }, (_, i) => i + 1)))
    for (const [number, answer] of [['19', '把记忆数据送给过去的自己'], ['27', '胸针'], ['36', 'D-mail传递邮件，Time Leap传递记忆数据']]) {
      const q = bank!.questions.find((q) => q.id === `steins-gate-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
  })
  it('keeps Titan season two separate with all twelve episode sources', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'attack-on-titan-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 26–37 集')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => Number(q.source!.url.split('#')[1])))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => i + 26)))
    for (const [number, answer] of [['19', '墙上没有找到破洞'], ['28', '战斗后体力不足'], ['36', '巨人在墙内出现，但没有发现墙洞，入侵路径仍需调查']]) {
      const q = bank!.questions.find((q) => q.id === `attack-on-titan-season-2-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
  })
  it('adds 700 distinct illustrated sourced questions with explicit anime scopes', () => {
    const sources: Record<string, RegExp> = {
      'attack-on-titan': /^https:\/\/shingeki.tv\/season1\//,
      'death-note': /^https:\/\/www.ntv.co.jp\/deathnote\/static\/story2?\.html$/,
      'fullmetal-alchemist-brotherhood': /^https:\/\/www.hagaren.jp\/fa\/(about\/story(?:0[1-6])?\.html|characters\/index01\.html)$/,
      'one-punch-man': /^https:\/\/onepunchman-anime.net\/(story\/#\/season1\/(?:[1-9]|1[0-2])|character\/)$/,
      'my-hero-academia': /^https:\/\/www.ytv.co.jp\/heroaca\/story\/$/,
      'sword-art-online': /^https:\/\/www.swordart-online.net\/(?:aincrad\/story\/\?id=ep(?:0[1-9]|1[0-4])|fairy\/(?:story\/\?id=ep(?:1[5-9]|2[0-5]))?)$/,
      'hunter-x-hunter': /^https:\/\/www\.ntv\.co\.jp\/hunterhunter\/(?:dictionary\/index\.html|story\/(?:00[1-9]|0[1-9]\d|1[0-3]\d|14[0-8])\.html)$/,
      'jujutsu-kaisen': /^https:\/\/www\.b-ch\.com\/titles\/7071\/0(?:0[1-9]|1\d|2[0-4])$/,
      'tokyo-ghoul': /^https:\/\/www\.marv\.jp\/special\/tokyoghoul\/first\/(?:story_1st|glossary)\.html$/,
      'your-name': /^https:\/\/www\.kiminona\.com\/(?:#(?:story|chara|staff|interview_tanaka|interview_ando)|production\/|interview\/01shinkai\.html)$/,
      'attack-on-titan-season-2': /^https:\/\/shingeki\.tv\/season2\/story\/episode\.php#(?:2[6-9]|3[0-7])$/,
      'steins-gate': /^https:\/\/www\.b-ch\.com\/titles\/2985\/0(?:0[1-9]|1\d|2[0-4])$/,
      'naruto-shippuden': /^https:\/\/www\.b-ch\.com\/titles\/3316\/0(?:0[1-9]|[12]\d|3[0-2])$/,
      'my-hero-academia-season-2': /^https:\/\/www\.ytv\.co\.jp\/heroaca\/story\/$/,
    }
    expect(expansionBanks.map((bank) => bank.series)).toEqual(Object.keys(sources))
    for (const bank of expansionBanks) {
      expect(bank.questions).toHaveLength(50)
      expect(new Set(bank.questions.map((q) => q.prompt)).size).toBe(50)
      expect(['简单', '中等', '困难'].map((level) => bank.questions.filter((q) => q.difficulty === level).length)).toEqual([18, 17, 15])
      for (const question of bank.questions) {
        expect(questionIssues(question), question.id).toEqual([])
        expect(question.image!.src).toMatch(/^\/images\/original\//)
        expect(question.source!.url).toMatch(sources[bank.series])
      }
      const practice = expansionQuizzes.filter((quiz) => quiz.series === bank.series)
      expect(practice).toHaveLength(3)
      expect(practice.every((quiz) => quiz.questions.length === 12 && quiz.scope?.includes('剧透'))).toBe(true)
      const published = [...practice.flatMap((quiz) => quiz.questions), ...expansionAdditions[bank.series]!]
      expect(published).toHaveLength(50)
      expect(new Set(published.map((q) => q.id))).toEqual(new Set(bank.questions.map((q) => q.id)))
    }
  })

  it('keeps Your Name character, exchange and production facts sourced separately', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'your-name')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2016 年动画电影')
    expect(bank!.scope).toContain('制作知识')
    for (const [number, answer, source] of [
      ['16', '小学四年级', '#chara'],
      ['28', '千年', '#story'],
      ['42', '第4稿确定基本方向，第6稿完成最终脚本', 'production/'],
      ['44', '4首人声歌曲与22首配乐', 'production/'],
    ]) {
      const q = bank!.questions.find((question) => question.id === `your-name-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
      expect(q.source!.url).toContain(source)
    }
  })

  it('keeps Tokyo Ghoul season one and the glossary mechanisms distinct', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'tokyo-ghoul')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集')
    expect(bank!.scope).toContain('不混用 √A')
    for (const [number, answer] of [
      ['11', '赫包'], ['13', '羽赫、甲赫、鳞赫、尾赫'],
      ['36', '赫包储存Rc细胞，赫子由其中释放的Rc细胞形成'],
      ['38', '用电信号使加工过的赫包人工产生赫子'],
      ['50', '兴奋或使用特殊能力时会出现，平常外貌仍可能与人无异'],
    ]) {
      const q = bank!.questions.find((question) => question.id === `tokyo-ghoul-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
      expect(q.source!.url).toContain('/glossary.html')
    }
    const episodeLabels = bank!.questions.filter((q) => q.source!.url.endsWith('story_1st.html')).map((q) => q.source!.label)
    for (let episode = 1; episode <= 12; episode++) expect(episodeLabels).toContain(`动画官网第一季第 ${episode} 集简介`)
  })

  it('limits Jujutsu Kaisen to season one and preserves mission and combat causes', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'jujutsu-kaisen')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–24 集')
    expect(bank!.scope).toContain('不考第二季')
    for (const [number, answer] of [
      ['02', '20 根'],
      ['36', '取出虎杖的心脏，让虎杖切回身体就面临死亡'],
      ['43', '自身的血液'],
      ['50', '承受血液术式的同时，用共鸣反击兄弟'],
    ]) {
      const q = bank!.questions.find((question) => question.id === `jujutsu-kaisen-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => Number(q.source!.url.split('/').at(-1))))).toEqual(new Set(Array.from({ length: 24 }, (_, i) => i + 1)))
  })

  it('keeps the 2011 Hunter adaptation and Nen and card restrictions explicit', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'hunter-x-hunter')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–148 集')
    expect(bank!.scope).toContain('不混用 1999 年版')
    for (const [number, answer] of [
      ['23', '幻影旅团成员'],
      ['29', '集齐指定口袋所要求的 100 种卡片'],
      ['41', '不能，已经解除为道具的物品无法再次卡片化'],
      ['47', '由具现化系变为特质系'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `hunter-x-hunter-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source!.url).toContain('/dictionary/')
    }
    expect(bank!.questions.at(-1)!.source!.url).toContain('/story/148.html')
  })

  it('keeps SAO first-season arcs and system constraints distinct', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'sword-art-online')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–25 集')
    expect(bank!.scope).toContain('不考 SAO II')
    for (const [number, answer] of [
      ['11', '二刀流'], ['12', '神圣剑'],
      ['28', '战斗空间禁用了转移水晶'],
      ['44', '需要有相应权限的系统控制台解除束缚'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `sword-art-online-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('?id='))
    expect(new Set(episodes.map((q) => Number(q.source!.url.split('ep').at(-1))))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => i + 1)))
  })

  it('keeps My Hero Academia within season one and preserves training and Nomu rules', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'my-hero-academia')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–13 集')
    expect(bank!.scope).toContain('不考第二季')
    for (const [number, answer] of [
      ['20', '回收模拟核武器，或捕获对手'],
      ['31', '冲击吸收与超再生'],
      ['40', '冲击吸收与超再生分别处理冲击和已经形成的损伤'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `my-hero-academia-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.label))).toEqual(new Set(Array.from({ length: 13 }, (_, i) => `读卖电视台第一季第 ${i + 1} 集简介（入口含后续剧透）`)))
  })

  it('uses first-season exam results and keeps later One Punch Man seasons out of scope', () => {
    const bank = expansionBanks.find((bank) => bank.series === 'one-punch-man')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集')
    expect(bank!.scope).toContain('不考第二季')
    for (const [number, answer] of [
      ['10', 'C 级'], ['11', 'S 级'],
      ['21', '每周至少提交一次英雄活动报告'],
      ['31', '为保护孩子，挡下深海王的溶解液'],
      ['32', '未来半年以内'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `one-punch-man-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source?.url).toContain('/story/#/season1/')
    }
    expect(new Set(bank!.questions.filter((q) => q.source?.url.includes('/story/')).map((q) => q.source!.url.split('/').at(-1)))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => String(i + 1))))
  })

  it('keeps Brotherhood mechanics and version boundaries explicit', () => {
    const bank = expansionBanks.find((bank) => bank.series === 'fullmetal-alchemist-brotherhood')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2009–2010')
    expect(bank!.scope).toContain('不混用 2003 年动画')
    for (const [number, answer] of [
      [19, '人体炼成失去左腿，固定弟弟灵魂又失去右臂'],
      [20, '手套起火花，配合对目标周围氧气的控制'],
      [21, '改变身体中碳的结构，使表层达到极高硬度'],
      [28, '两人的意识共存，通常由格利德主导身体'],
    ] as const) {
      const question = bank!.questions.find((q) => q.id.endsWith(`-${number}`))!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source?.url).toBe('https://www.hagaren.jp/fa/characters/index01.html')
    }
    for (const [episode, page] of [[8, 'story.html'], [20, 'story01.html'], [31, 'story03.html'], [59, 'story05.html'], [62, 'story06.html']] as const) {
      expect(bank!.questions.some((q) => q.source?.label === `FA 官网第 ${episode} 集剧情简介` && q.source.url.endsWith(`/${page}`))).toBe(true)
    }
  })
})
