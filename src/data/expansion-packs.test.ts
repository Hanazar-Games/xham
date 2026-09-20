import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes, expansionAdditions } from './expansion-packs'
import { questionIssues } from './content-validation'

describe('catalog additions', () => {
  it('keeps Parasyte in the 24-episode TV continuity with sourced abilities and investigation facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'parasyte')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–24 集')
    expect(bank!.scope).toContain('不混入真人电影')
    for (const [number, answer] of [['02', '右臂'], ['06', '田宫良子'], ['12', '美术部'], ['21', '小右的细胞散布到全身'], ['30', '特殊传感器']]) {
      const question = bank!.questions.find((q) => q.id === `parasyte-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    const episodes = bank!.questions.flatMap((q) => {
      const match = q.source!.url.match(/\/story\/(\d+)\.html$/)
      return match ? [Number(match[1])] : []
    })
    expect(new Set(episodes)).toEqual(new Set(Array.from({ length: 24 }, (_, i) => i + 1)))
  })
  it('separates the 2011 Blue Exorcist continuity and resolves its finale source', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'blue-exorcist')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2011年电视动画第一季第 1–25 集')
    expect(bank!.scope).toContain('动画原创展开')
    expect(bank!.scope).toContain('不混入京都不净王篇')
    for (const [number, answer] of [['01', '15岁'], ['06', '奥村雪男'], ['09', '手骑士'], ['25', '三天'], ['33', '虚无界']]) {
      const q = bank!.questions.find((q) => q.id === `blue-exorcist-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 25 }, (_, i) =>
      `https://www.ao-ex.com/tv/story/${i === 24 ? '' : `${String(i + 1).padStart(2, '0')}.html`}`)))
  })
  it('keeps Cowboy Bebop in the TV series with sourced crew and case facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'cowboy-bebop')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('电视动画第 1–26 集')
    expect(bank!.scope).toContain('不混入剧场版')
    for (const [number, answer] of [['01', 'Bebop号'], ['06', '拥有接近人类智力的数据犬'], ['13', '木卫三盖尼米德'], ['17', 'Beta录像带'], ['32', '三亿乌龙']]) {
      const q = bank!.questions.find((q) => q.id === `cowboy-bebop-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      'https://www.cowboy-bebop.net/world/#tv',
      'https://www.cowboy-bebop.net/story/',
      ...['02', '03', '04', '05'].map((page) => `https://www.cowboy-bebop.net/story/${page}.html`),
    ]))
  })
  it('covers all three SAO II arcs without mixing recap or later adaptations', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'sword-art-online-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–24 集')
    expect(bank!.scope).toContain('不含14.5集总集篇')
    for (const [number, answer] of [['04', '赫卡忒Ⅱ'], ['15', '第22层'], ['18', 'Medicuboid（医疗立方）'], ['22', '30人'], ['34', '第27层']]) {
      const q = bank!.questions.find((q) => q.id === `sword-art-online-2-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 24 }, (_, index) => {
      const episode = index + 1
      const arc = episode <= 14 ? 'phantom' : episode <= 17 ? 'calibur' : 'mothers'
      return `https://www.swordart-online.net/${arc}/story/?id=ep${String(episode).padStart(2, '0')}`
    })))
  })
  it('keeps Future Diary in the TV series and preserves prediction limits', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'future-diary')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–26 集')
    expect(bank!.scope).toContain('不混入Redial')
    for (const [number, answer] of [['02', '无差别日记'], ['04', '10分钟'], ['11', '录音机'], ['19', '早、午、晚三次'], ['28', '不会仅因手机损坏而消失']]) {
      const q = bank!.questions.find((q) => q.id === `future-diary-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions.some((q) => q.source!.url.endsWith('/story/story26.html'))).toBe(true)
    expect(bank!.questions.some((q) => q.source!.url.endsWith('/chara/8th.html'))).toBe(true)
    expect(bank!.questions.every((q) => !q.source!.url.includes('redial'))).toBe(true)
  })
  it('keeps KonoSuba in season one with skill limits and party roles intact', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'konosuba')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–10 集')
    expect(bank!.scope).toContain('不混入第二季')
    for (const [number, answer] of [['03', '冒险者（初级职业）'], ['07', '每天一发'], ['14', '幸运'], ['24', '惠惠与维兹'], ['35', '厄里斯']]) {
      const q = bank!.questions.find((q) => q.id === `konosuba-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions.filter((q) => q.source!.url.endsWith('/character/')).length).toBeGreaterThan(0)
    expect(bank!.questions.filter((q) => q.source!.url.endsWith('/story/')).length).toBeGreaterThan(0)
  })
  it('limits Promised Neverland to season one and preserves informer and escape facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'promised-neverland')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–12 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['02', '11岁'], ['09', '雷'], ['12', '摩尔斯电码'], ['32', '4岁及以下'], ['33', '5岁及以上']]) {
      const q = bank!.questions.find((q) => q.id === `promised-neverland-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('/story/'))
    expect(new Set(episodes.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => `https://neverland-anime.com/1st/story/${String(i + 1).padStart(2, '0')}/`)))
  })
  it('keeps Haikyuu in season one and distinguishes positions and tournament rounds', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'haikyuu')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–25 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['03', '乌野高中'], ['07', '二传手'], ['15', '常波高中'], ['16', '伊达工业'], ['17', '青叶城西'], ['35', '宫城县']]) {
      const q = bank!.questions.find((q) => q.id === `haikyuu-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => `https://www.b-ch.com/titles/4065/${String(i + 1).padStart(3, '0')}`)))
  })
  it('grounds Angel Beats in thirteen TV episodes without special or game routes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'angel-beats')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–13 集')
    expect(bank!.scope).toContain('不混入特别篇')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['06', '克莱斯特（Christ）'], ['15', 'Harmonics'], ['28', '两年'], ['31', '一次与大量意识同化'], ['50', '音无、奏、日向和直井']]) {
      const q = bank!.questions.find((q) => q.id === `angel-beats-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 13 }, (_, i) => `https://www.angelbeats.jp/story2/${i === 0 ? 'index' : `ep${String(i + 1).padStart(2, '0')}`}.html`)))
  })
  it('grounds Seven Deadly Sins in the first-season archive and preserves battle distinctions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'seven-deadly-sins')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–24 集')
    expect(bank!.scope).toContain('不混入戒律的复活')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '里昂妮丝王国'], ['13', '强夺（Snatch）'], ['31', '700年前'], ['42', '魔术师薇薇安'], ['50', '鼓舞他们一起面对亨德里克森']]) {
      const q = bank!.questions.find((q) => q.id === `seven-deadly-sins-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 24 }, (_, i) => `https://1st.7-taizai.net/story${i === 23 ? '' : String(i + 1).padStart(2, '0')}.html`)))
  })
  it('keeps Assassination Classroom in season one with distinct teacher roles and deadlines', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'assassination-classroom')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–22 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['02', '100亿日元'], ['03', '20马赫'], ['29', '24小时'], ['35', '国语'], ['44', '不到10年']]) {
      const q = bank!.questions.find((q) => q.id === `assassination-classroom-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('detail_1st.php'))
    expect(new Set(episodes.map((q) => q.source!.url)).size).toBe(22)
    expect(bank!.questions.every((q) => !q.source!.url.includes('/story/detail.php'))).toBe(true)
  })
  it('limits Bleach to the Substitute Soul Reaper arc and its early power rules', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'bleach')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–20 集')
    expect(bank!.scope).toContain('不混入千年血战篇')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '15岁'], ['09', '6月17日'], ['34', '72小时'], ['35', '呼唤斩魄刀的名字'], ['49', '三番队队长']]) {
      const q = bank!.questions.find((q) => q.id === `bleach-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 20 }, (_, i) => `https://www.b-ch.com/titles/4994/${String(i + 1).padStart(3, '0')}`)))
  })
  it('grounds Akame in the TV story and preserves equipment limits', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'akame-ga-kill')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–24 集')
    expect(bank!.scope).toContain('不混入漫画')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['04', '48件'], ['19', '产生拒绝反应，无法继续使用'], ['25', '赤瞳的妹妹'], ['33', '玛茵与须佐之男'], ['36', '造成伤口后，咒毒由伤口进入']]) {
      const q = bank!.questions.find((q) => q.id === `akame-ga-kill-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('story_'))
    expect(new Set(episodes.map((q) => q.source!.url)).size).toBe(24)
  })
  it('keeps Erased within the TV adaptation and distinguishes timeline and evidence', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'erased')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集')
    expect(bank!.scope).toContain('真凶与结局剧透')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '29岁'], ['19', '2006年'], ['27', '2003年'], ['28', '15年'], ['35', '救助垫与同伴']]) {
      const q = bank!.questions.find((q) => q.id === `erased-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => `https://bokumachi-anime.com/story/${String(i + 1).padStart(2, '0')}/`)))
  })
  it('limits Titan Final Season to part one and separates inherited powers and release ranges', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'attack-on-titan-final-season')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 60–75 集')
    expect(bank!.scope).toContain('制作资料')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['02', '四年'], ['07', '莱纳的表亲'], ['28', '同父异母的哥哥'], ['48', '16集']]) {
      const q = bank!.questions.find((q) => q.id === `attack-on-titan-final-season-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('/story/'))
    expect(episodes.every((q) => /^https:\/\/shingeki\.tv\/final\/story\/#\/episode\/(?:6\d|7[0-5])$/.test(q.source!.url))).toBe(true)
    expect(new Set(episodes.map((q) => q.source!.url)).size).toBe(13)
    expect(bank!.questions.every((q) => !q.source!.url.includes('/keyword/'))).toBe(true)
  })
  it('grounds Noragami in its first-season archive and preserves purification requirements', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'noragami')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–12 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '五日元'], ['09', '剑'], ['16', '由原作者提供原案的电视动画原创角色'], ['18', '三名'], ['28', '让雪音接受禊并忏悔所犯的罪']]) {
      const q = bank!.questions.find((q) => q.id === `noragami-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('story.html'))
    expect(new Set(episodes.map((q) => Number(q.source!.url.split('#headCts')[1])))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => i + 1)))
    expect(new Set(bank!.questions.map((q) => q.source!.url)).size).toBe(22)
    expect(bank!.questions.every((q) => q.source!.url.startsWith('https://noragami-anime.net/1/'))).toBe(true)
  })
  it('keeps Mob Psycho in season one and distinguishes ordinary ability from borrowed energy', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'mob-psycho-100')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–12 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['04', '本人没有灵能力'], ['06', '300日元'], ['18', '龙套把自己的能量交给了灵幻'], ['29', '翔']]) {
      const q = bank!.questions.find((q) => q.id === `mob-psycho-100-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('/story/'))
    expect(new Set(episodes.map((q) => Number(q.source!.url.match(/(\d+)\.html$/)![1])))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => i + 1)))
    expect(new Set(bank!.questions.map((q) => q.source!.url)).size).toBe(20)
    expect(bank!.questions.every((q) => q.source!.url.startsWith('https://mobpsycho100.com/1st/'))).toBe(true)
  })
  it('grounds Toradora in all 25 TV synopses with correct relationships and rescue facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'toradora')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–25 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['02', '栉枝实乃梨'], ['03', '北村祐作'], ['21', '北村输在感情告白，却当选学生会长'], ['28', '高须龙儿']]) {
      const q = bank!.questions.find((q) => q.id === `toradora-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => Number(q.source!.label.match(/第 (\d+) 集/)![1])))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => i + 1)))
    for (const q of bank!.questions) {
      const episode = Number(q.source!.label.match(/第 (\d+) 集/)![1])
      expect(q.source!.url).toBe(`https://www.tv-tokyo.co.jp/contents/toradora/episodes/episodes${episode <= 13 ? 1 : 2}/`)
    }
  })
  it('keeps Hero season three within TV scope and verifies exam and power limits', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'my-hero-academia-season-3')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 39–63 集')
    expect(bank!.scope).toContain('不含第58集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['19', '1540人中100人'], ['29', '爆豪与轰'], ['31', '8%'], ['47', '渡我伪装成凯米，再以丽日的外貌接近出久']]) {
      const q = bank!.questions.find((q) => q.id === `my-hero-academia-season-3-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    const episodes = new Set(bank!.questions.map((q) => Number(q.source!.label.match(/第 (\d+) 集/)![1])))
    expect(episodes).toEqual(new Set(Array.from({ length: 25 }, (_, i) => i + 39).filter((n) => n !== 58)))
  })
  it('scopes Your Lie in April to 22 TV episodes and distinguishes performance outcomes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'your-lie-in-april')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–22 集')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => q.source!.url)).size).toBe(22)
    for (const [number, answer] of [['03', '口风琴'], ['09', '观众推荐'], ['22', '克莱斯勒《爱的悲伤》'], ['35', '再次与公生一起演奏']]) {
      const q = bank!.questions.find((q) => q.id === `your-lie-in-april-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions.every((q) => /^https:\/\/www\.kimiuso\.jp\/story\/(?:0[1-9]|1\d|2[0-2])\.html$/.test(q.source!.url))).toBe(true)
  })
  it('keeps Re:Zero season one separate from the mixed bank and excludes recap extras', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'rezero-season-1')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–25 集')
    expect(bank!.questions).toHaveLength(50)
    const urls = new Set(bank!.questions.map((q) => q.source!.url))
    expect(urls.size).toBe(25)
    expect(urls.has('https://re-zero-anime.jp/tv/story/tv1r.html#EP12')).toBe(false)
    for (const [number, answer] of [['08', '第五天早晨'], ['19', '白鲸出现的时间与地点'], ['35', '昴负责观察，尤里乌斯负责进攻']]) {
      const q = bank!.questions.find((q) => q.id === `rezero-season-1-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
  })
  it('keeps Code Geass in season one with sourced identity and strategy constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'code-geass')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–25 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', 'Area 11'], ['04', '枢木朱雀'], ['14', '读取他人的思考'], ['36', '释放是外部机会，是否接受仍取决于朱雀自己的选择']]) {
      const question = bank!.questions.find((q) => q.id === `code-geass-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(bank!.questions.every((q) => /^https:\/\/geass\.jp\/first\/story_(?:0[1-9]|1\d|2[0-3]|2425)\.html$/.test(q.source!.url))).toBe(true)
    expect(new Set(bank!.questions.map((q) => q.source!.url)).size).toBe(24)
  })
  it('grounds No Game No Life in TV sources and preserves game and ability limits', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'no-game-no-life')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2014 年电视动画第 1–12 集')
    expect(bank!.scope).toContain('不混入')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [
      ['06', '前国王的孙女'], ['17', '第一人称射击游戏'],
      ['27', '天翼种第6、森精种第7、兽人种第14'],
      ['36', '把心理博弈与精确计算结合起来'],
      ['46', '预判方向正确，也可能因对手临时提升身体能力而无法命中'],
    ]) {
      const q = bank!.questions.find((q) => q.id === `no-game-no-life-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.filter((q) => q.source!.url.includes('/story/')).map((q) => q.source!.url)).size).toBe(12)
    expect(bank!.questions.every((q) => q.source!.url.startsWith('https://ngnl.jp/tv/'))).toBe(true)
  })
  it('separates Titan part two episodes and verifies its production references', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'attack-on-titan-season-3-part-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 50–59 集')
    expect(bank!.scope).toContain('制作知识')
    const episodes = bank!.questions.filter((q) => q.source!.url.includes('/story/'))
    expect(new Set(episodes.map((q) => Number(q.source!.url.split('/').at(-1))))).toEqual(new Set(Array.from({ length: 10 }, (_, i) => i + 50)))
    for (const [number, answer] of [['07', '雷枪'], ['30', 'cinema staff《Name of Love》'], ['45', '10集']]) {
      const question = bank!.questions.find((q) => q.id === `attack-on-titan-season-3-part-2-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(bank!.questions.every((q) => !q.source!.url.includes('/final/'))).toBe(true)
  })
  it('keeps A Silent Voice film characters and sound production grounded in official pages', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'a-silent-voice')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2016 年动画电影')
    expect(bank!.scope).toContain('不混用漫画')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer, path] of [
      ['03', '五年', 'introduction/'],
      ['05', '妹妹', 'character/yuzuru/'],
      ['28', '39首与22首', 'music/'],
      ['39', '按场景需要拆解并重组巴赫《创意曲》的素材', 'music/#music-interview'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `a-silent-voice-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source!.url).toBe(`https://koenokatachi-movie.com/${path}`)
    }
  })
  it('limits Titan season three to part one and preserves investigation and battle conditions', () => {
    const bank = expansionBanks.find((bank) => String(bank.series) === 'attack-on-titan-season-3')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 38–49 集')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.map((q) => Number(q.source!.url.split('/').at(-1))))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => i + 38)))
    for (const [number, answer] of [['18', '两个月'], ['29', '两天后'], ['36', '这是传入法庭的消息，不能仅凭这段简介确认巨人实际已经突破']]) {
      const q = bank!.questions.find((q) => q.id === `attack-on-titan-season-3-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
  })
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
  it('adds 1950 distinct illustrated sourced questions with explicit anime scopes', () => {
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
      'attack-on-titan-season-3': /^https:\/\/shingeki\.tv\/season3\/story\/#\/season3\/(?:3[89]|4\d)$/,
    }
    sources['a-silent-voice'] = /^https:\/\/koenokatachi-movie\.com\/(?:introduction\/|staff\/|themesong\/|music\/(?:#music-interview)?|character\/(?:shoko\/|yuzuru\/|nagatsuka\/|ueno\/|sahara\/|kawai\/|mashiba\/|shoya_s\/)?)$/
    sources['attack-on-titan-season-3-part-2'] = /^https:\/\/shingeki\.tv\/season3\/(?:story\/#\/season3\/5\d|staff\/|music\/(?:op2\.php|ed2\.php|soundtrack\.php)?|product\/season3_5\.php)$/
    sources['no-game-no-life'] = /^https:\/\/ngnl\.jp\/tv\/(?:story\/story(?:[1-9]|1[0-2])\.html|character\/(?:index|chara0[2-8])\.html)$/
    sources['code-geass'] = /^https:\/\/geass\.jp\/first\/story_(?:0[1-9]|1\d|2[0-3]|2425)\.html$/
    sources['rezero-season-1'] = /^https:\/\/re-zero-anime\.jp\/tv\/story\/tv1r\.html#EP(?:[1-9]|1[013-9]|2[0-6])$/
    sources['your-lie-in-april'] = /^https:\/\/www\.kimiuso\.jp\/story\/(?:0[1-9]|1\d|2[0-2])\.html$/
    sources['my-hero-academia-season-3'] = /^https:\/\/www\.ytv\.co\.jp\/heroaca\/story\/$/
    sources['toradora'] = /^https:\/\/www\.tv-tokyo\.co\.jp\/contents\/toradora\/episodes\/episodes[12]\/$/
    sources['mob-psycho-100'] = /^https:\/\/mobpsycho100\.com\/1st\/(?:story\/(?:0[1-9]|1[0-2])|chara\/(?:mob|reigen|ritsu|teru|ekubo|tome|musashi|tsubomi))\.html$/
    sources['noragami'] = /^https:\/\/noragami-anime\.net\/1\/(?:story\.html#headCts(?:[1-9]|1[0-2])|character\.html#charaScr(?:[1-9]|10))$/
    sources['attack-on-titan-final-season'] = /^https:\/\/shingeki\.tv\/final\/(?:story\/#\/episode\/(?:6\d|7[0-5])|character\/|music\/(?:op|ed)\/|product\/final_[12]\/)$/
    sources['erased'] = /^https:\/\/bokumachi-anime\.com\/story\/(?:0[1-9]|1[0-2])\/$/
    sources['akame-ga-kill'] = /^http:\/\/akame\.tv\/(?:teigu|story_(?:0[1-9]|1\d|2[0-4]))\.html$/
    sources['bleach'] = /^https:\/\/www\.b-ch\.com\/titles\/4994\/0(?:0[1-9]|1\d|20)$/
    sources['assassination-classroom'] = /^https:\/\/www\.ansatsu-anime\.com\/2014-2016\/(?:introduction\/|story\/detail_1st\.php\?id=\d+|character\/chara\/chara_(?:[1-4]|e(?:1|5|11|13|15|19))\.php)$/
    sources['seven-deadly-sins'] = /^https:\/\/1st\.7-taizai\.net\/story(?:0[1-9]|1\d|2[0-3])?\.html$/
    sources['angel-beats'] = /^https:\/\/www\.angelbeats\.jp\/story2\/(?:index|ep(?:0[2-9]|1[0-3]))\.html$/
    sources['haikyuu'] = /^https:\/\/www\.b-ch\.com\/titles\/4065\/0(?:0[1-9]|1\d|2[0-5])$/
    sources['promised-neverland'] = /^https:\/\/neverland-anime\.com\/1st\/(?:story\/(?:0[1-9]|1[0-2])\/|character\/)$/
    sources['konosuba'] = /^https:\/\/konosuba\.com\/1st\/(?:story|character)\/$/
    sources['future-diary'] = /^https:\/\/future-diary\.tv\/(?:story\/story(?:0[1-9]|1\d|2[0-6])|chara\/(?:1st|2nd|3rd|[4-6]th|7thm|[89]th|1[0-2]th|deus|murmur))\.html$/
    sources['sword-art-online-2'] = /^https:\/\/www\.swordart-online\.net\/(?:phantom\/story\/\?id=ep(?:0[1-9]|1[0-4])|calibur\/story\/\?id=ep1[5-7]|mothers\/story\/\?id=ep(?:1[89]|2[0-4]))$/
    sources['cowboy-bebop'] = /^https:\/\/www\.cowboy-bebop\.net\/(?:world\/#tv|story\/(?:0[2-5]\.html)?)$/
    sources['blue-exorcist'] = /^https:\/\/www\.ao-ex\.com\/tv\/story\/(?:(?:0[1-9]|1\d|2[0-4])\.html)?$/
    sources['parasyte'] = /^https:\/\/www\.vap\.co\.jp\/kiseiju\/(?:story\/(?:0[1-9]|1\d|2[0-4])|chara\/(?:shinichi|migi|satomi|ryoko|miki|gotou|kana|shimada|yuko|uda|nobuko|makiko|mitsuo|a|kuramori|hirama|uragami|hirokawa))\.html$/
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
