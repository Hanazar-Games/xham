import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes, expansionAdditions } from './expansion-packs'
import { questionIssues } from './content-validation'

describe('catalog additions', () => {
  it('keeps the 2003 Fullmetal Alchemist continuity separate from Brotherhood', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'fullmetal-alchemist-2003')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2003年电视版第 1–51 集')
    expect(bank!.scope).toContain('不混用FA版')
    expect(bank!.questions).toHaveLength(50)
    const answer = (id: string) => {
      const q = bank!.questions.find((item) => item.id === `fullmetal-alchemist-2003-${id}`)!
      return q.options[q.answer]
    }
    expect(answer('03')).toBe('12岁')
    expect(answer('35')).toBe('20世纪初的伦敦')
    expect(answer('45')).toBe('拉斯的右臂和左腿原属爱德，诞生于伊兹米失败的人体炼成')
    expect(bank!.questions[34].source!.url).toBe('https://www.b-ch.com/titles/215/050')
  })

  it('keeps Oregairu season one and its TV extra distinct from sequels and OVA', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'oregairu-season-1')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集及电视番外篇第 13 集')
    expect(bank!.scope).toContain('不混入OVA、第二季')
    expect(bank!.questions).toHaveLength(50)
    const answer = (id: string) => {
      const q = bank!.questions.find((item) => item.id === `oregairu-season-1-${id}`)!
      return q.options[q.answer]
    }
    expect(answer('01')).toBe('奉仕部')
    expect(answer('16')).toBe('副委员长')
    expect(answer('18')).toBe('城廻巡')
    expect(bank!.questions[17].source!.url).toBe('https://www.tbs.co.jp/anime/oregairu/1st/story/#story13')
  })

  it('keeps Haikyuu season two within the road to the final and distinguishes tactical roles', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'haikyuu-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–25 集')
    expect(bank!.scope).toContain('不混入白鸟泽决赛过程')
    expect(bank!.questions).toHaveLength(50)
    const answer = (id: string) => {
      const q = bank!.questions.find((item) => item.id === `haikyuu-season-2-${id}`)!
      return q.options[q.answer]
    }
    expect(answer('01')).toBe('春季高中排球赛预选赛')
    expect(answer('16')).toBe('替补发球员')
    expect(answer('18')).toBe('白鸟泽学园高校')
    expect(bank!.questions[17].source!.url).toBe('https://www.b-ch.com/titles/4898/025')
    expect(bank!.questions.some((q) => q.image!.src === '/images/original/volleyball.svg')).toBe(true)
  })

  it('keeps Assassination Classroom season two separate and verifies its changing objectives', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'assassination-classroom-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–25 集')
    expect(bank!.scope).toContain('不混入第一季')
    expect(bank!.questions).toHaveLength(50)
    expect(bank!.questions[0].options[bank!.questions[0].answer]).toBe('茅野枫')
    expect(bank!.questions[16].options[bank!.questions[16].answer]).toBe('三小时')
    expect(bank!.questions[34].source!.url).toBe('https://www.ansatsu-anime.com/2014-2016/story/detail.php?id=1000876')
    expect(bank!.questions[44].explanation).toContain('没有给出')
  })

  it('keeps Fate Zero in season one and distinguishes orders, observations and outcomes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'fate-zero')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–13 集')
    expect(bank!.scope).toContain('不混入第14–25集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '七名魔术师召唤七名英灵'], ['19', '过去圣杯战争中未用完的令咒'], ['25', '魔力注入的水银'], ['35', '从书中了解Rider追求东方尽头的理由'], ['50', 'Caster从与龙之介的对话中获得新启示，准备施展某种魔术']]) {
      const q = bank!.questions.find((item) => item.id === `fate-zero-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[48].explanation).toContain('未说明')
    expect(bank!.questions.find((q) => q.id === 'fate-zero-50')!.source!.url).toBe('https://www.fate-zero.jp/story/#STORY13')
  })
  it('keeps Highschool of the Dead in the TV series and checks resource and character boundaries', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'highschool-of-the-dead')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2010年电视版第 1–12 集')
    expect(bank!.scope).toContain('不混入OVA或漫画后续')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '私立藤美学园'], ['19', '年长一岁，但因留级成为同年级'], ['25', '海外短期留学期间'], ['33', '持续消耗后弹药用尽'], ['35', '电磁脉冲使集成电路失效'], ['50', '电子设备因电磁脉冲失效，敌群涌入，众人判断消耗战不利并决定乘车撤离']]) {
      const q = bank!.questions.find((item) => item.id === `highschool-of-the-dead-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[46].explanation).toContain('不等于')
    expect(bank!.questions[49].explanation).toContain('未说明')
  })
  it('keeps Horimiya in the 2021 series and separates established and pretend relationships', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'horimiya')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2021年电视版第 1–13 集')
    expect(bank!.scope).toContain('不混入《piece》、OVA或真人版')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '堀京子'], ['13', '视力不好，容易认错人'], ['18', '3月'], ['30', '一星期'], ['33', '为了让由纪有借口拒绝柳的告白'], ['45', '仙石与礼美正式交往，石川与由纪当时是假扮恋人'], ['50', '众人从片桐高中毕业，带着相遇和回忆走向未来']]) {
      const q = bank!.questions.find((item) => item.id === `horimiya-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions.find((q) => q.id === 'horimiya-19')!.source!.url).toBe('https://horimiya-anime.com/1st/story/?id=01')
    expect(bank!.questions.find((q) => q.id === 'horimiya-50')!.source!.url).toBe('https://horimiya-anime.com/1st/story/?id=13')
    expect(bank!.questions[48].explanation).toContain('不能')
  })
  it('keeps Elfen Lied in thirteen TV episodes and separates abilities from outcomes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'elfen-lied')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2004年电视版第 1–13 集')
    expect(bank!.scope).toContain('不混入EXTRA特别篇或漫画后续')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '露西'], ['03', '向量（Vector）'], ['16', '13集'], ['23', '娜娜的向量更长'], ['35', '留下耕太，独自跳入海中'], ['45', '真由的哭脸让她想起幼年的耕太，于是变回妮悠'], ['50', '露西独自入海，抵达研究设施，迎战真理子']]) {
      const q = bank!.questions.find((item) => item.id === `elfen-lied-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[38].explanation).toContain('不能')
    expect(bank!.questions[49].explanation).toContain('未说明')
  })
  it('keeps Kakegurui in season one and distinguishes game-specific rules', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'kakegurui')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2017年第一季第 1–12 集')
    expect(bank!.scope).toContain('不混入《××》《双》或真人版')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '私立百花王学园'], ['19', '数字与花色都相同'], ['25', '牌的数字相同'], ['35', '梦子、绮罗莉、铃井凉太'], ['37', '103张，其中只有1张'], ['43', '甲排在乙之前'], ['50', '把决定强牌还是弱牌获胜的选择权握在手中']]) {
      const q = bank!.questions.find((item) => item.id === `kakegurui-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[36].explanation).toContain('公平随机')
    expect(bank!.questions[42].explanation).toContain('合计金额')
  })
  it('keeps Slime season one including its prequel and verifies naming and skill boundaries', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'slime-season-1')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–24 集')
    expect(bank!.scope).toContain('含第24集静的前日谭')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '三上悟'], ['19', '解析并解除维鲁德拉的封印'], ['25', '20万'], ['35', '拉米莉丝'], ['50', '发生在利姆鲁转生之前，围绕静接受讨伐恶魔的委托展开']]) {
      const q = bank!.questions.find((item) => item.id === `slime-season-1-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[48].explanation).toContain('不是普通精灵')
  })
  it('keeps KonoSuba II in ten TV episodes and checks legal and journey states', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'konosuba-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–10 集')
    expect(bank!.scope).toContain('不混入OVA、剧场版或外传')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '国家颠覆罪'], ['19', '暂缓执行死刑，但家中物品仍因赔偿被查封'], ['25', '达克妮丝'], ['35', '维兹'], ['50', '阿库娅想清除污染，一行前往源泉，维兹认出汉斯']]) {
      const q = bank!.questions.find((item) => item.id === `konosuba-season-2-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[43].explanation).toContain('商谈')
  })
  it('keeps DanMachi in season one and verifies growth conditions and dungeon floors', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'danmachi')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–13 集')
    expect(bank!.scope).toContain('不混入OVA、外传或后续季度')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '欧拉丽'], ['19', '思慕持续存在，并随思慕的强烈程度带来显著成长'], ['25', '莉莉露卡'], ['35', '此前彼此不和的冒险者也跟随贝尔迎战'], ['50', '常规状态不产怪的第18层，后来发生歌利亚现身的异常']]) {
      const q = bank!.questions.find((item) => item.id === `danmachi-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[47].explanation).toContain('人际风险')
  })
  it('keeps Devil Is a Part-Timer in season one and separates dreams from actual events', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'devil-is-a-part-timer')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2013年第一季第 1–13 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '安特·伊苏拉'], ['19', '六叠一间的公寓'], ['25', '人类的绝望与恐惧'], ['35', '一星期'], ['50', '千穗梦见真奥要回异世界，真奥现实中请假但否认就此不归']]) {
      const q = bank!.questions.find((item) => item.id === `devil-is-a-part-timer-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[47].explanation).toContain('今の真奥')
  })
  it('keeps Anohana in the TV series and distinguishes wishes from observed outcomes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'anohana')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('电视动画第 1–11 集')
    expect(bank!.scope).toContain('不混入剧场版')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '宿海仁太'], ['19', '原先是六人的中心人物，高中后变得有些闭居'], ['25', '雪集自己穿女装扮成面码的样子'], ['31', '蒸面包'], ['35', '面码没有消失'], ['50', '第10集手开始透明，第11集烟花升空后仍未消失']]) {
      const q = bank!.questions.find((item) => item.id === `anohana-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[42].explanation).toContain('不能把猜测当成')
  })
  it('keeps Mob Psycho II separate and verifies psychic mechanics and episode states', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'mob-psycho-100-ii')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–13 集')
    expect(bank!.scope).toContain('不混入OVA或第三季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '田地里出现的不明黑影'], ['19', '前10名以内'], ['25', '岛崎'], ['32', '把先前分给成员的能量收回自身'], ['35', '超能力者的能量流动'], ['50', '劝说未能奏效，转而尝试倾尽力量迎战']]) {
      const q = bank!.questions.find((item) => item.id === `mob-psycho-100-ii-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[42].explanation).toContain('本人的自信')
  })
  it('keeps Entertainment District within eleven episodes and verifies battle conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'demon-slayer-entertainment-district')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('游郭篇第 1–11 集')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '蝶屋敷'], ['19', '堕姬也识破了善逸的鬼杀队身份'], ['25', '藤花之毒'], ['35', '伊之助与宇髄'], ['50', '先同时斩首，再遭遇血鬼术破坏，随后仍须面对中毒危机']]) {
      const question = bank!.questions.find((item) => item.id === `demon-slayer-entertainment-district-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
  })
  it('keeps Psycho-Pass in the original first season and distinguishes readings from evidence', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'psycho-pass')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('原版第一季第 1–22 集')
    expect(bank!.scope).toContain('不混入新编集版')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '常守朱'], ['19', '执行官负责实地行动，监视官负责监督和指挥'], ['24', '常守朱的朋友小雪'], ['29', '犯案时仍被测出清澈色相'], ['35', '为了阻止狡啮对槙岛实施私刑']]) {
      const q = bank!.questions.find((item) => item.id === `psycho-pass-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[45].explanation).toContain('组织定性')
    expect(bank!.questions[49].explanation).toContain('未展开')
  })
  it('keeps Food Wars in season one and checks cooking tasks and qualifier boundaries', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'food-wars')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–24 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', '幸平创真'], ['19', '做出让宿管认可味道的料理'], ['29', '两小时内让客人吃下至少200份'], ['34', '每组4人'], ['35', '鱼头咖喱']]) {
      const q = bank!.questions.find((item) => item.id === `food-wars-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[42].explanation).toContain('塌陷')
    expect(bank!.questions[49].explanation).toContain('没有公布')
    expect(bank!.questions.some((q) => q.image?.src === '/images/original/kitchen.svg')).toBe(true)
  })
  it('keeps Overlord in season one and checks rank, combat skills and resurrection uncertainty', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'overlord')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–13 集')
    expect(bank!.scope).toContain('不混入第二季')
    expect(bank!.questions).toHaveLength(50)
    for (const [number, answer] of [['01', 'YGGDRASIL（世界树）'], ['19', '铜级'], ['29', '身体能力很高，但没有剑士职业技能'], ['34', '尚未确认复活魔法在这个世界能否使用'], ['35', '使用所持的复活道具']]) {
      const q = bank!.questions.find((item) => item.id === `overlord-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[48].explanation).toContain('完全耐性')
    expect(bank!.questions[49].explanation).toContain('MP和技能')
  })
  it('keeps Charlotte in the TV series and verifies target, duration and cost constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'charlotte')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–13 集')
    expect(bank!.scope).toContain('不混入未放送特别篇')
    for (const [number, answer] of [['01', '乙坂有宇'], ['19', '5秒'], ['20', '指定的一人'], ['22', '已故姐姐美砂'], ['34', '只穿过一堵墙也会非常疲惫']]) {
      const q = bank!.questions.find((item) => item.id === `charlotte-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[42].explanation).toContain('自己也会睡着')
    expect(bank!.questions[43].explanation).toContain('长时间接触')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.filter((q) => q.source!.url.includes('/character/')).map((q) => q.source!.url)).size).toBe(12)
  })
  it('keeps Shield Hero in season one and verifies party roles and curse restrictions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'shield-hero')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–25 集')
    expect(bank!.scope).toContain('不混入第二季')
    for (const [number, answer] of [['01', '岩谷尚文'], ['07', '龙刻沙漏'], ['10', '风'], ['19', '防御力很高，攻击力却几乎没有'], ['24', '1个月']]) {
      const q = bank!.questions.find((item) => item.id === `shield-hero-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[37].explanation).toContain('尸体')
    expect(bank!.questions[47].explanation).toContain('无效化')
    expect(bank!.questions).toHaveLength(50)
    expect(bank!.questions.map((q) => q.source!.url)).toContain('https://shieldhero-anime.jp/1st/')
  })
  it('keeps Gurren Lagann in the TV version and verifies transformation and combat constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'gurren-lagann')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–27 集')
    expect(bank!.scope).toContain('不混入《红莲篇》《螺岩篇》')
    for (const [number, answer] of [['01', '西蒙'], ['17', '7年'], ['18', '100万人'], ['31', '30万名城市及附近居民'], ['33', '罗杰诺姆的旗舰卡特德拉尔·泰拉']]) {
      const q = bank!.questions.find((item) => item.id === `gurren-lagann-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[42].explanation).toContain('分裂爆散')
    expect(bank!.questions[43].explanation).toContain('情绪')
    expect(bank!.questions).toHaveLength(50)
    expect(new Set(bank!.questions.filter((q) => q.source!.url.includes('/mecha/')).map((q) => q.source!.url)).size).toBe(8)
  })
  it('keeps Soul Eater in the TV continuity and distinguishes resonance limits from exam folklore', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'soul-eater')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–51 集')
    expect(bank!.scope).toContain('不混入漫画差异或《噬魂师NOT!》')
    for (const [number, answer] of [['03', '魔镰'], ['11', '拉格纳洛克'], ['19', '99个鬼神之卵化的灵魂，加1个魔女灵魂'], ['31', '20分钟'], ['33', '索尔的钢琴演奏']]) {
      const q = bank!.questions.find((item) => item.id === `soul-eater-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[38].explanation).toContain('传闻')
    expect(bank!.questions[45].explanation).toContain('人类无法进入')
    expect(bank!.questions[49].explanation).toContain('真正的索尔的心')
    expect(bank!.questions).toHaveLength(50)
    expect(bank!.questions.map((q) => q.source!.url)).toContain('https://www.bones.co.jp/work/soul-eater/')
  })
  it('keeps Mugen Train separate from the general bank and checks dream and battle constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'demon-slayer-mugen-train')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2020年剧场版')
    expect(bank!.scope).toContain('不含电视版第一集原创故事')
    for (const [number, answer] of [['02', '炎柱'], ['08', '下弦之壹'], ['09', '上弦之叁'], ['19', '全集中·常中'], ['29', '精神之核']]) {
      const q = bank!.questions.find((item) => item.id === `demon-slayer-mugen-train-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[39].explanation).toContain('梦境内')
    expect(bank!.questions[46].explanation).toContain('恢复能力')
    expect(bank!.questions).toHaveLength(50)
    expect(bank!.questions.every((q) => q.source!.url.startsWith('https://kimetsu.com/anime/mugenresshahen_'))).toBe(true)
  })
  it('keeps Another in the TV series and separates suspicion from verified identity', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'another')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集')
    expect(bank!.scope).toContain('不混入OVA')
    for (const [number, answer] of [['01', '1998年'], ['04', '三年三班'], ['22', '26年前'], ['27', '15年前']]) {
      const q = bank!.questions.find((item) => item.id === `another-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[47].explanation).toContain('没有在简介中确认她的判断正确')
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      'https://www.pa-works.jp/works/another/',
      ...Array.from({ length: 12 }, (_, i) => `https://www.b-ch.com/titles/4255/${String(i + 1).padStart(3, '0')}`),
    ]))
  })
  it('keeps Vinland Saga in season one and checks motives and temporary alliances', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'vinland-saga')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–24 集')
    expect(bank!.scope).toContain('不混入第二季')
    for (const [number, answer] of [['01', '冰岛'], ['06', '弗洛基'], ['26', '英格兰一方'], ['34', '阿谢拉特与托尔克尔']]) {
      const q = bank!.questions.find((item) => item.id === `vinland-saga-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[46].explanation).toContain('不能将临时共斗解释成关系已经和解')
    expect(bank!.questions.map((q) => q.source!.url)).toContain('https://vinlandsaga.jp/character/')
  })
  it('keeps Darling in the FranXX in the TV continuity and checks pilot and combat conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'darling-in-the-franxx')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–24 集')
    expect(bank!.scope).toContain('不混入漫画改编')
    for (const [number, answer] of [['01', '016'], ['18', '满与心'], ['20', '搭乘中的驾驶员与机体之间的同步程度'], ['27', '在第13部队内部更换搭档']]) {
      const q = bank!.questions.find((item) => item.id === `darling-in-the-franxx-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions[40].explanation).toContain('传闻不应改写为绝无例外')
    const urls = bank!.questions.map((q) => q.source!.url)
    expect(urls).toContain('https://darli-fra.jp/keyword/')
    expect(urls).toContain('https://darli-fra.jp/character/')
    expect(urls).toContain('https://darli-fra.jp/story/?no=24')
  })
  it('keeps JoJo in the 2012 series and checks inheritance and power constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'jojo-2012')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–26 集')
    expect(bank!.scope).toContain('不混入星尘斗士')
    expect(bank!.questions[0].prompt).toContain('亲生儿子')
    for (const [number, answer] of [['01', '乔纳森·乔斯达'], ['29', '33天'], ['35', '服下毒之戒指的解药'], ['49', '太阳光对他的威胁']]) {
      const q = bank!.questions.find((item) => item.id === `jojo-2012-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 26 }, (_, i) => `https://www.b-ch.com/titles/3446/${String(i + 1).padStart(3, '0')}`)))
  })
  it('keeps Fairy Tail in the first 48 episodes and checks spell conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'fairy-tail')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–48 集')
    expect(bank!.scope).toContain('不混入2014版')
    for (const [number, answer] of [['01', '妖精的尾巴'], ['26', '牺牲自己的生命'], ['35', '蕾比'], ['50', '施术者将对方认定为敌人']]) {
      const q = bank!.questions.find((item) => item.id === `fairy-tail-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(bank!.questions).toHaveLength(50)
  })
  it('keeps Kill la Kill in the TV story and checks clothing and tactical constraints', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'kill-la-kill')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('电视动画第 1–24 集')
    expect(bank!.scope).toContain('不混入第25集番外或漫画改编')
    for (const [number, answer] of [['01', '本能字学园'], ['05', '鲜血'], ['19', '吸收穿着者的血液'], ['35', '四天王'], ['50', '流子是人类与生命战维的融合体，未受绝对服从控制']]) {
      const q = bank!.questions.find((item) => item.id === `kill-la-kill-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 24 }, (_, i) => `https://www.b-ch.com/titles/3867/${String(i + 1).padStart(3, '0')}`)))
  })
  it('keeps Spy x Family Part 1 separate and checks school and identity conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'spy-family')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('前半部第 1–12 集')
    expect(bank!.scope).toContain('不混入Part 2、后续季度、电影或漫画后续')
    for (const [number, answer] of [['01', '黄昏'], ['05', '读取他人的心声'], ['19', '德斯蒙德'], ['35', '医院'], ['50', '先安排水族馆出游展示家庭和睦，现场又出现WISE新任务']]) {
      const q = bank!.questions.find((item) => item.id === `spy-family-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => `https://www.b-ch.com/titles/7713/${String(i + 1).padStart(3, '0')}`)))
  })
  it('keeps One Punch Man season two separate and checks tournament and rescue conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'one-punch-man-season-2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季第 1–12 集')
    expect(bank!.scope).toContain('不混入第三季、OVA或漫画后续')
    for (const [number, answer] of [['01', 'King'], ['05', '吹雪'], ['19', '三名A级英雄及聚集的悬赏犯'], ['35', '三天'], ['50', '邦古与邦普先和杰诺斯会合，蜈蚣长老随后来袭，King与埼玉也参战']]) {
      const q = bank!.questions.find((item) => item.id === `one-punch-man-season-2-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => `https://www.b-ch.com/titles/6518/${String(i + 1).padStart(3, '0')}`)))
  })
  it('bounds Black Clover to its first 51 episodes and checks magic and teamwork facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'black-clover')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–51 集')
    expect(bank!.scope).toContain('不代表全篇覆盖')
    for (const [number, answer] of [['01', '风魔法'], ['03', '九个'], ['19', '团长是否愿意招收该考生'], ['35', '钻石王国'], ['50', '取得魔石完成任务，但多数团员需要休养']]) {
      const q = bank!.questions.find((item) => item.id === `black-clover-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 51 }, (_, i) => i + 1).filter((n) => n !== 29).map((n) => `https://www.b-ch.com/titles/5757/${String(n).padStart(3, '0')}`)))
  })
  it('keeps Tokyo Ghoul Root A in its own anime continuity with sourced tactical facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'tokyo-ghoul-root-a')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第二季√A第 1–12 集')
    expect(bank!.scope).toContain('不混入漫画独有剧情、:re、OVA或真人版')
    for (const [number, answer] of [['01', '雾岛绚都'], ['05', '高槻泉'], ['19', '23区'], ['35', '亚门钢太朗'], ['50', '担心金木等人的安危']]) {
      const q = bank!.questions.find((item) => item.id === `tokyo-ghoul-root-a-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.label))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => `第二季动画官网第 ${i + 1} 集简介`)))
  })
  it('keeps My Hero Academia season four separate with sourced rescue and festival facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'my-hero-academia-season-4')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第四季第 1–25 集')
    expect(bank!.scope).toContain('不混入其他季度、电影或OVA')
    for (const [number, answer] of [['01', '特田种男'], ['03', '通形百万'], ['19', '三分钟'], ['35', '霍克斯'], ['50', '霍克斯兼顾人命救助和支援安德瓦']]) {
      const q = bank!.questions.find((item) => item.id === `my-hero-academia-season-4-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => `https://www.b-ch.com/titles/6728/${String(i + 1).padStart(3, '0')}`)))
  })
  it('keeps Death Parade in the TV series and distinguishes adjudication roles', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'death-parade')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2015年电视动画第 1–12 集')
    expect(bank!.scope).toContain('不混入前作短片《死亡台球》')
    for (const [number, answer] of [['01', '德基姆'], ['03', '15层'], ['19', '飞镖'], ['27', '带血的菜刀'], ['35', '奥克鲁斯']]) {
      const q = bank!.questions.find((item) => item.id === `death-parade-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      ...Array.from({ length: 12 }, (_, i) => `https://www.vap.co.jp/deathparade/story/${String(i + 1).padStart(2, '0')}.html`),
      ...Array.from({ length: 9 }, (_, i) => `https://www.vap.co.jp/deathparade/character/${i === 0 ? 'index' : String(i).padStart(2, '0')}.html`),
    ]))
  })
  it('keeps Chainsaw Man in the 2022 TV series with distinct contracts and mission conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'chainsaw-man')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2022年电视动画第 1–12 集')
    expect(bank!.scope).toContain('不混入总集篇、蕾塞篇及后续剧情')
    for (const [number, answer] of [['01', '波奇塔'], ['06', '血之魔人'], ['19', '八楼'], ['27', '未来恶魔'], ['35', '拉动胸前的启动拉绳']]) {
      const q = bank!.questions.find((item) => item.id === `chainsaw-man-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      'https://chainsawman.dog/tvseries/character/',
      ...Array.from({ length: 12 }, (_, i) => `https://www.b-ch.com/titles/7889/${String(i + 1).padStart(3, '0')}`),
    ]))
  })
  it('keeps Kaguya-sama in season one with sourced council roles and event conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'kaguya-sama')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2019年电视动画第一季第 1–12 集')
    expect(bank!.scope).toContain('不混入后续季度、电影或漫画后续')
    for (const [number, answer] of [['01', '秀知院学园'], ['05', '会计'], ['19', '半年'], ['27', '记忆翻牌游戏'], ['35', '早坂爱']]) {
      const q = bank!.questions.find((item) => item.id === `kaguya-sama-${number}`)!
      expect(q.options[q.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      'https://kaguya.love/1st/character/',
      ...Array.from({ length: 12 }, (_, i) => `https://kaguya.love/1st/story/${String(i + 1).padStart(2, '0')}.html`),
    ]))
  })
  it('keeps Dr. Stone in season one and checks its science roadmap facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'dr-stone')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第一季第 1–24 集')
    expect(bank!.scope).toContain('不混入STONE WARS、龙水及后续季度')
    for (const [number, answer] of [['01', '约3700年'], ['07', '琉璃'], ['18', '钨'], ['28', '六人'], ['35', '扬声器']]) {
      const question = bank!.questions.find((q) => q.id === `dr-stone-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 24 }, (_, i) => `https://www.b-ch.com/titles/6616/${String(i + 1).padStart(3, '0')}`)))
  })
  it('keeps Bunny Girl Senpai within the 2018 TV story and distinguishes its phenomena', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'bunny-girl-senpai')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2018年电视动画第 1–13 集')
    expect(bank!.scope).toContain('不混入后续电影及大学篇')
    for (const [number, answer] of [['01', '图书馆'], ['19', '试图帮助迷路女孩，却被误认成可疑人物'], ['27', '两年'], ['34', '曾发生暴力事件的传闻'], ['50', '花枫过去的记忆恢复，但近两年“かえで”的记忆消失']]) {
      const question = bank!.questions.find((q) => q.id === `bunny-girl-senpai-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set([
      'https://ao-buta.com/tv/character/',
      ...Array.from({ length: 13 }, (_, i) => `https://ao-buta.com/tv/story/${String(i + 1).padStart(2, '0')}.html`),
    ]))
  })
  it('keeps Code Geass R2 separate and checks its political and battle conditions', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'code-geass-r2')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('R2第 1–25 集')
    expect(bank!.scope).toContain('不混入总集篇电影及《复活的鲁路修》')
    for (const [number, answer] of [['01', '一年'], ['05', '第七骑士（Knight of Seven）'], ['12', '47国'], ['28', '娜娜莉'], ['35', '鲁路修与朱雀']]) {
      const question = bank!.questions.find((q) => q.id === `code-geass-r2-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 25 }, (_, i) => `https://geass.jp/r2/story_${String(i + 1).padStart(2, '0')}.html`)))
  })
  it('keeps Violet Evergarden in the TV series with sourced correspondence and character facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'violet-evergarden')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('电视动画第 1–13 集')
    expect(bank!.scope).toContain('不混入番外篇、外传电影和剧场版')
    for (const [number, answer] of [['01', '自动手记人偶'], ['19', '打字快速准确，学科成绩优秀'], ['27', '50年'], ['33', '嘉德丽雅'], ['50', '基尔伯特少佐']]) {
      const question = bank!.questions.find((q) => q.id === `violet-evergarden-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(bank!.questions.every((q) => q.source!.url === 'https://tv.violet-evergarden.jp/story/')).toBe(true)
    expect(new Set(bank!.questions.map((q) => q.source!.label)).size).toBe(13)
  })
  it('keeps Evangelion in the TV continuity and validates battle conditions across all episodes', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'evangelion')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('电视系列第 1–26 集')
    expect(bank!.scope).toContain('不混入旧剧场版、新剧场版')
    for (const [number, answer] of [['01', '第三新东京市'], ['08', '惣流·明日香·兰格雷'], ['19', '日本全国的电力'], ['22', '同时对两个核心发动攻击'], ['33', '400%']]) {
      const question = bank!.questions.find((q) => q.id === `evangelion-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    expect(new Set(bank!.questions.map((q) => q.source!.url))).toEqual(new Set(Array.from({ length: 26 }, (_, i) =>
      `https://www.b-ch.com/titles/466/${String(i + 1).padStart(3, '0')}`)))
  })
  it('provides an independent Spirited Away film bank with sourced plot and design facts', () => {
    const bank = expansionBanks.find((item) => String(item.series) === 'spirited-away')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2001年动画电影')
    expect(bank!.scope).toContain('不混入舞台版')
    for (const [number, answer] of [['01', '10岁'], ['06', '千'], ['08', '猪'], ['20', '人类丢弃的垃圾'], ['29', '双胞胎姐妹'], ['33', '江户东京建筑园']]) {
      const question = bank!.questions.find((q) => q.id === `spirited-away-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
    }
    for (let volume = 1; volume <= 5; volume++) {
      expect(bank!.questions.some((q) => q.source!.url.endsWith(`/product/${4730 + volume}`))).toBe(true)
    }
    expect(bank!.questions.every((q) => q.image && q.explanation && q.source)).toBe(true)
  })
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
    sources['spirited-away'] = /^https:\/\/(?:www\.viz\.com\/manga-books\/film-comic\/spirited-away-film-comics-volume-[1-5]-0\/product\/473[1-5]|www\.ghibli\.jp\/works\/chihiro\/|kinro\.ntv\.co\.jp\/article\/detail\/(?:20220106|20231208))$/
    sources['evangelion'] = /^https:\/\/www\.b-ch\.com\/titles\/466\/0(?:0[1-9]|1\d|2[0-6])$/
    sources['violet-evergarden'] = /^https:\/\/tv\.violet-evergarden\.jp\/story\/$/
    sources['code-geass-r2'] = /^https:\/\/geass\.jp\/r2\/story_(?:0[1-9]|1\d|2[0-5])\.html$/
    sources['bunny-girl-senpai'] = /^https:\/\/ao-buta\.com\/tv\/(?:character\/|story\/(?:0[1-9]|1[0-3])\.html)$/
    sources['dr-stone'] = /^https:\/\/www\.b-ch\.com\/titles\/6616\/0(?:0[1-9]|1\d|2[0-4])$/
    sources['kaguya-sama'] = /^https:\/\/kaguya\.love\/1st\/(?:character\/|story\/(?:0[1-9]|1[0-2])\.html)$/
    sources['chainsaw-man'] = /^https:\/\/(?:chainsawman\.dog\/tvseries\/character\/|www\.b-ch\.com\/titles\/7889\/0(?:0[1-9]|1[0-2]))$/
    sources['death-parade'] = /^https:\/\/www\.vap\.co\.jp\/deathparade\/(?:story\/(?:0[1-9]|1[0-2])|character\/(?:index|0[1-8]))\.html$/
    sources['my-hero-academia-season-4'] = /^https:\/\/www\.b-ch\.com\/titles\/6728\/0(?:0[1-9]|1\d|2[0-5])$/
    sources['tokyo-ghoul-root-a'] = /^https:\/\/www\.marv\.jp\/special\/tokyoghoul\/first\/story\.html$/
    sources['black-clover'] = /^https:\/\/www\.b-ch\.com\/titles\/5757\/0(?:0[1-9]|[1-4]\d|5[01])$/
    sources['one-punch-man-season-2'] = /^https:\/\/www\.b-ch\.com\/titles\/6518\/0(?:0[1-9]|1[0-2])$/
    sources['spy-family'] = /^https:\/\/www\.b-ch\.com\/titles\/7713\/0(?:0[1-9]|1[0-2])$/
    sources['kill-la-kill'] = /^https:\/\/www\.b-ch\.com\/titles\/3867\/0(?:0[1-9]|1\d|2[0-4])$/
    sources['fairy-tail'] = /^https:\/\/www\.b-ch\.com\/titles\/4189\/0(?:0[1-9]|[1-3]\d|4[0-8])$/
    sources['jojo-2012'] = /^https:\/\/www\.b-ch\.com\/titles\/3446\/0(?:0[1-9]|1\d|2[0-6])$/
    sources['darling-in-the-franxx'] = /^https:\/\/darli-fra\.jp\/(?:keyword\/|character\/|story\/\?no=(?:[1-9]|1\d|2[0-4]))$/
    sources['vinland-saga'] = /^https:\/\/(?:www\.b-ch\.com\/titles\/7349\/0(?:0[1-9]|1\d|2[0-4])|vinlandsaga\.jp\/character\/)$/
    sources['another'] = /^https:\/\/www\.(?:b-ch\.com\/titles\/4255\/0(?:0[1-9]|1[0-2])|pa-works\.jp\/works\/another\/)$/
    sources['demon-slayer-mugen-train'] = /^https:\/\/kimetsu\.com\/anime\/mugenresshahen_(?:movie\/(?:music\/|story\/|character\/\?chara=c(?:0[1-9]|10))|tv\/story\/\?id=ep[3-7])$/
    sources['soul-eater'] = /^https:\/\/www\.(?:b-ch\.com\/titles\/1972\/0(?:0[1-9]|[1-4]\d|5[01])|bones\.co\.jp\/work\/soul-eater\/)$/
    sources['gurren-lagann'] = /^https:\/\/www\.(?:b-ch\.com\/titles\/4447\/0(?:0[1-9]|1\d|2[0-7])|gurren-lagann\.net\/tv\/mecha\/(?:lagann|gulaparl|arcgurren|archgurrenlagann|chogingadaigurren|chogingaglagann|mugann|spacegunmen)\.html)$/
    sources['shield-hero'] = /^https:\/\/(?:www\.b-ch\.com\/titles\/6384\/0(?:0[1-9]|1\d|2[0-5])|shieldhero-anime\.jp\/1st\/)$/
    sources['charlotte'] = /^https:\/\/(?:www\.b-ch\.com\/titles\/4602\/0(?:0[1-9]|1[0-3])|www\.pa-works\.jp\/works\/charlotte\/|charlotte-anime\.jp\/character\/#\/(?:yuu|nao|jojiro|yusa|misa|ayumi|kumagami|sala|shunsuke|shichino|medoki|maedomari))$/
    sources['overlord'] = /^https:\/\/overlord-anime\.com\/_season1\/(?:story\.html\?st=(?:[1-9]|1[0-3])|character\.html\?c=[3-7])$/
    sources['food-wars'] = /^https:\/\/www\.b-ch\.com\/titles\/4532\/0(?:0[1-9]|1\d|2[0-4])$/
    sources['psycho-pass'] = /^https:\/\/www\.(?:b-ch\.com\/titles\/4106\/0(?:0[1-9]|1\d|2[0-2])|fujitv\.co\.jp\/b_hp\/psycho-pass\/)$/
    sources['demon-slayer-entertainment-district'] = /^https:\/\/kimetsu\.com\/anime\/yukakuhen\/story\/\?id=ep(?:[1-9]|1[01])$/
    sources['mob-psycho-100-ii'] = /^https:\/\/mobpsycho100\.com\/2nd\/(?:story\/(?:0[1-9]|1[0-3])|chara\/(?:serizawa|shimazaki|suzuki))\.html$/
    sources['anohana'] = /^https:\/\/www\.anohana\.jp\/tv\/(?:story\/(?:index|0[2-9]|1[01])|chara\/chara0[1-6]|intro\/index)\.html$/
    sources['devil-is-a-part-timer'] = /^https:\/\/maousama\.jp\/1st\/story\.html$/
    sources['danmachi'] = /^https:\/\/danmachi\.com\/danmachi\/story\/(?:introduction|episode(?:[1-9]|1[0-3]))\.html$/
    sources['konosuba-season-2'] = /^https:\/\/konosuba\.com\/2nd\/story\/\?mode=detail&id=(?:0[1-9]|10)$/
    sources['slime-season-1'] = /^https:\/\/www\.ten-sura\.com\/anime\/tensura\/story\/no(?:[1-9]|1[0-9]|2[0-4])$/
    sources['kakegurui'] = /^https:\/\/kakegurui-anime\.com\/1st\/(?:game_rules\/|story\/detail\.php\?id=(?:1000217|1000221|1000223|100022[6-8]|100025[3-8]))$/
    sources['elfen-lied'] = /^https:\/\/(?:www\.vap\.co\.jp\/elfenlied\/bd\/|animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=21868(?:&partId=218680(?:0[1-9]|1[0-3]))?)$/
    sources['horimiya'] = /^https:\/\/horimiya-anime\.com\/1st\/(?:character\/|story\/\?id=(?:01|ep0[2-9]|ep1[0-2]|13))$/
    sources['highschool-of-the-dead'] = /^https:\/\/www\.nbcuni\.co\.jp\/rondorobe\/anime\/hotd\/contents\/(?:hp0003\/index00010000|hp0006\/index000[2-7]0000|hp0005\/index00(?:16|18|19|20|25|27|28|29|30|31|32|33)0000)\.html$/
    sources['fate-zero'] = /^https:\/\/www\.fate-zero\.jp\/(?:characters\/index\.html|story\/#STORY(?:0[1-9]|1[0-3]))$/
    sources['assassination-classroom-season-2'] = /^https:\/\/www\.ansatsu-anime\.com\/2014-2016\/story\/detail\.php\?id=(?:1000726|1000731|1000733|1000754|1000759|1000764|1000770|1000775|1000779|1000784|1000795|1000800|1000803|1000814|1000816|1000828|1000834|1000836|1000838|1000839|1000851|1000854|1000860|1000865|1000876)$/
    sources['haikyuu-season-2'] = /^https:\/\/www\.b-ch\.com\/titles\/4898\/0(?:0[1-9]|1\d|2[0-5])$/
    sources['oregairu-season-1'] = /^https:\/\/www\.tbs\.co\.jp\/anime\/oregairu\/1st\/(?:chara\/|story\/#story(?:0[1-9]|1[0-3]))$/
    sources['fullmetal-alchemist-2003'] = /^https:\/\/www\.b-ch\.com\/titles\/215\/0(?:0[1-9]|[1-4]\d|5[01])$/
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
