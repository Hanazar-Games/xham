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
import { yourNameEntries } from './your-name'
import { titanSeasonTwoEntries } from './attack-on-titan-season-2'
import { steinsGateEntries } from './steins-gate'
import { shippudenEntries } from './naruto-shippuden'
import { cowboyBebopEntries } from './cowboy-bebop'
import { swordArtOnlineTwoEntries } from './sword-art-online-2'
import { futureDiaryEntries } from './future-diary'
import { konosubaEntries } from './konosuba'
import { promisedNeverlandEntries } from './promised-neverland'
import { haikyuuEntries } from './haikyuu'
import { angelBeatsEntries } from './angel-beats'
import { sevenDeadlySinsEntries } from './seven-deadly-sins'
import { assassinationEntries } from './assassination-classroom'
import { bleachEntries } from './bleach'
import { akameEntries } from './akame-ga-kill'
import { erasedEntries } from './erased'
import { titanFinalSeasonEntries } from './attack-on-titan-final-season'
import { noragamiEntries } from './noragami'
import { mobPsychoEntries } from './mob-psycho-100'
import { toradoraEntries } from './toradora'
import { heroSeasonThreeEntries } from './my-hero-academia-season-3'
import { heroSeasonTwoEntries } from './my-hero-academia-season-2'
import { titanSeasonThreeEntries } from './attack-on-titan-season-3'
import { silentVoiceEntries } from './a-silent-voice'
import { yourLieInAprilEntries } from './your-lie-in-april'
import { rezeroSeasonOneEntries } from './rezero-season-1'
import { codeGeassEntries } from './code-geass'
import { noGameNoLifeEntries } from './no-game-no-life'
import { titanSeasonThreePartTwoEntries } from './attack-on-titan-season-3-part-2'

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
  bank('your-name', '你的名字。', '限定 2016 年动画电影的官网人物、交换生活简介与制作知识，含人物关系和交换中断的剧情剧透；不考未核实的后半段精确时间线、救援细节或结局，不混用小说扩写、漫画版及其他电影。', yourNameEntries, (reference) => {
    if (reference === 'characters') return { label: '电影官网人物资料', url: 'https://www.kiminona.com/#chara' }
    const pages = [
      ['剧情简介', '#story'], ['工作人员与音乐', '#staff'], ['制作记录', 'production/'],
      ['新海诚访谈', 'interview/01shinkai.html'], ['田中将贺访谈', '#interview_tanaka'], ['安藤雅司访谈', '#interview_ando'],
    ]
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > pages.length) throw new Error('Your Name needs a valid official page reference')
    const [label, path] = pages[reference - 1]
    return { label: `电影官网${label}`, url: `https://www.kiminona.com/${path}` }
  }),
  bank('attack-on-titan-season-2', '进击的巨人 第二季', '仅含 2017 年电视动画第二季第 26–37 集官网公开剧情，含古城战、墙内调查与艾伦夺还行动剧透；不考第三季、最终季或漫画后续，困难题侧重公开线索与战术条件推理。', titanSeasonTwoEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 26 || reference > 37) throw new Error('Titan season two needs an episode reference from 26 to 37')
    return { label: `第二季官网第 ${reference} 集简介`, url: `https://shingeki.tv/season2/story/episode.php#${reference}` }
  }),
  bank('steins-gate', '命运石之门', '限定 2011 年电视动画第 1–24 集公开分集剧情，含 D-mail、记忆跳跃、真由理危机与世界线选择剧透；不混用命运石之门 0、23β、OVA、剧场版或游戏分支，困难题侧重机制区分、调查与因果推理。', steinsGateEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 24) throw new Error('Steins Gate needs a 2011 TV episode reference')
    return { label: `Bandai Channel 2011版第 ${reference} 集剧情简介`, url: `https://www.b-ch.com/titles/2985/${String(reference).padStart(3, '0')}` }
  }),
  bank('naruto-shippuden', '火影忍者 疾风传', '本题库限定疾风传第 1–32 集风影夺还篇，包含我爱罗危机、蝎的傀儡、解毒时限及救援结局剧透；不代表全部疾风传，不混用前作、后续篇章、剧场版或博人传。集数按疾风传单独计数。', shippudenEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 32) throw new Error('Shippuden needs a Kazekage rescue episode reference')
    return { label: `Bandai Channel 疾风传第 ${reference} 集剧情简介`, url: `https://www.b-ch.com/titles/3316/${String(reference).padStart(3, '0')}` }
  }),
  bank('my-hero-academia-season-2', '我的英雄学院 第二季', '限定 2017 年电视动画第二季累计第 14–38 集，含体育祭、职场体验、斯坦因事件及期末实技考试剧透；不混用第一季、后续季度、OVA或剧场版。资料入口含后续剧情，请按第二季及累计集数查阅。', heroSeasonTwoEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 14 || reference > 38) throw new Error('Hero Academia season two needs a cumulative episode reference from 14 to 38')
    return { label: `读卖电视台第二季累计第 ${reference} 集简介`, url: 'https://www.ytv.co.jp/heroaca/story/' }
  }),
  bank('attack-on-titan-season-3', '进击的巨人 第三季上半部', '限定 2018 年电视动画第三季上半部累计第 38–49 集官网公开剧情，含王政调查、雷斯家、罗德巨人与希斯特利亚身份剧透；不混用第50集起的第三季后半部、最终季、OVA或漫画后续。', titanSeasonThreeEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 38 || reference > 49) throw new Error('Titan season three part one needs an episode reference from 38 to 49')
    return { label: `第三季官网第 ${reference} 集简介`, url: `https://shingeki.tv/season3/story/#/season3/${reference}` }
  }),
  bank('a-silent-voice', '声之形', '限定 2016 年动画电影的官网人物、剧情简介与电影声音设计知识，含人物关系和文化祭段落剧透；不混用漫画独有情节，不考未核实的完整剧情细节。困难题重点考官方配乐访谈中的创作方法。', silentVoiceEntries, (reference) => {
    const pages = [
      ['剧情简介', 'introduction/'], ['工作人员', 'staff/'], ['主题歌', 'themesong/'],
      ['原声专辑', 'music/'], ['牛尾宪辅访谈', 'music/#music-interview'],
      ['石田将也', 'character/'], ['西宫硝子', 'character/shoko/'], ['西宫结弦', 'character/yuzuru/'],
      ['永束友宏', 'character/nagatsuka/'], ['植野直花', 'character/ueno/'], ['佐原美代子', 'character/sahara/'],
      ['川井美树', 'character/kawai/'], ['真柴智', 'character/mashiba/'], ['小学将也', 'character/shoya_s/'],
    ]
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > pages.length) throw new Error('A Silent Voice needs an official film page reference')
    const [label, path] = pages[reference - 1]
    return { label: `电影官网${label}`, url: `https://koenokatachi-movie.com/${path}` }
  }),
  bank('attack-on-titan-season-3-part-2', '进击的巨人 第三季后半部', '限定 2019 年电视动画第三季后半部累计第 50–59 集公开剧情与本季制作知识，含夺还作战、地下室及格里沙记忆剧透；不混入最终季、OVA或漫画独有设定。部分题目考主题歌、原声与制作署名，不代表完整剧情细节考核。', titanSeasonThreePartTwoEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference)) throw new Error('Titan part two needs a numeric official reference')
    if (reference >= 50 && reference <= 59) return { label: `第三季官网第 ${reference} 集资料`, url: `https://shingeki.tv/season3/story/#/season3/${reference}` }
    const pages = [
      ['后半部工作人员', 'staff/'], ['上下半部音乐目录', 'music/'], ['后半部OP单曲', 'music/op2.php'],
      ['后半部ED单曲', 'music/ed2.php'], ['第三季原声专辑', 'music/soundtrack.php'], ['第5至7卷收录信息', 'product/season3_5.php'],
    ]
    if (reference < 1 || reference > pages.length) throw new Error('Titan part two needs an episode from 50 to 59 or a production page')
    const [label, path] = pages[reference - 1]
    return { label: `第三季官网${label}`, url: `https://shingeki.tv/season3/${path}` }
  }),
  bank('no-game-no-life', '游戏人生', '限定 2014 年电视动画第 1–12 集公开剧情及官网人物设定，含王位争夺、图书馆挑战、记忆异常与东部联合战剧情剧透；不混入 Zero 剧场版、特典或原作后续。重点考人物能力与战术判断，不考官网未展开的完整盟约条文及结局细节。', noGameNoLifeEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 20) throw new Error('No Game No Life needs a TV episode or character reference')
    if (reference <= 12) return { label: `电视动画官网第 ${reference} 集简介`, url: `https://ngnl.jp/tv/story/story${reference}.html` }
    const names = ['空', '白', '史蒂芙', '吉普莉尔', '克拉米', '菲尔', '伊纲', '特图']
    return { label: `电视动画官网人物：${names[reference - 13]}`, url: `https://ngnl.jp/tv/character/${reference === 13 ? 'index' : `chara${String(reference - 12).padStart(2, '0')}`}.html` }
  }),
  bank('code-geass', 'Code Geass 反叛的鲁路修', '限定 2006–2007 年电视动画第一季第 1–25 集官网公开剧情，含Zero身份、毛的能力、行政特区与东京战役剧透；不混入R2、总集篇电影、复活的鲁路修或其他衍生作。不补写简介未展开的能力参数和结局细节。', codeGeassEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 25) throw new Error('Code Geass needs a first-season episode reference')
    return { label: `第一季官网第 ${reference} 集简介`, url: `https://geass.jp/first/story_${reference >= 24 ? '2425' : String(reference).padStart(2, '0')}.html` }
  }),
  bank('rezero-season-1', 'Re:0 第一季', '限定2016年电视动画第一季第 1–25 集公开剧情，依据官网新编集版资料页核验，含宅邸循环、王选、白鲸与魔女教战剧透；不混入第二季、Memory Snow特别篇或新编集追加结尾。与前两季综合题库分开，不补写简介未说明的能力参数。', rezeroSeasonOneEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 25) throw new Error('Re:Zero season one needs an episode from 1 to 25')
    return { label: `第一季官网第 ${reference} 集简介（新编集版资料页）`, url: `https://re-zero-anime.jp/tv/story/tv1r.html#EP${reference > 11 ? reference + 1 : reference}` }
  }),
  bank('your-lie-in-april', '四月是你的谎言', '限定2014–2015年电视动画第 1–22 集官网公开简介，含比赛、住院与人物成长剧透，侧重演奏诠释与人物关系；不混入第23话OAD、真人电影或漫画独有内容，不补写官网未展开的病名、信件和结局细节。', yourLieInAprilEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 22) throw new Error('Your Lie in April needs a TV episode from 1 to 22')
    return { label: `电视动画官网第 ${reference} 集简介`, url: `https://www.kimiuso.jp/story/${String(reference).padStart(2, '0')}.html` }
  }),
  bank('my-hero-academia-season-3', '我的英雄学院 第三季', '限定2018年电视动画第三季累计第 39–63 集公开剧情，不含第58集电影联动特别篇；含林间合宿、神野救援、临时执照考试与季末人物剧透，不混入其他季度、OVA或剧场版。官网入口含后续内容，请在BACK NUMBER选择第三季并按累计集数查阅。', heroSeasonThreeEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 39 || reference > 63 || reference === 58) throw new Error('Hero season three needs an episode from 39 to 63 excluding 58')
    return { label: `读卖电视台第三季第 ${reference} 集简介`, url: 'https://www.ytv.co.jp/heroaca/story/' }
  }),
  bank('toradora', '龙与虎', '限定2008–2009年电视动画第 1–25 集东京电视台公开简介，含文化祭、圣诞节、雪山救援与家庭关系剧透；不混入小说、游戏或OVA，不补写简介未展开的结局细节。困难题侧重人物动机、信息差与行动因果。', toradoraEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 25) throw new Error('Toradora needs a TV episode from 1 to 25')
    return { label: `东京电视台第 ${reference} 集简介`, url: `https://www.tv-tokyo.co.jp/contents/toradora/episodes/episodes${reference <= 13 ? 1 : 2}/` }
  }),
  bank('mob-psycho-100', '灵能百分百 第一季', '限定2016年电视动画第一季第 1–12 集及同期官网人物设定，含律觉醒、爪第七支部救援与最终话力量转交剧透；不混入第二季、第三季、OVA或漫画后续，不补写官网未说明的招式参数。', mobPsychoEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 20) throw new Error('Mob Psycho needs a first-season episode or character reference')
    if (reference <= 12) return { label: `第一季官网第 ${reference} 集简介（图片正文）`, url: `https://mobpsycho100.com/1st/story/${String(reference).padStart(2, '0')}.html` }
    const characters = ['mob', 'reigen', 'ritsu', 'teru', 'ekubo', 'tome', 'musashi', 'tsubomi']
    const names = ['影山茂夫', '灵幻新隆', '影山律', '花泽辉气', '小酒窝', '暗田留', '武藏', '小蕾']
    return { label: `第一季官网人物：${names[reference - 13]}`, url: `https://mobpsycho100.com/1st/chara/${characters[reference - 13]}.html` }
  }),
  bank('noragami', '野良神 第一季', '限定2014年电视动画第一季第 1–12 集及同期官网人物设定，含雪音的禊、日和异变与蠃蚌篇剧透；不混入Aragoto第二季、OAD或漫画后续。蠃蚌为原作者提供原案的动画原创角色，不推定与漫画剧情一致。', noragamiEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 22) throw new Error('Noragami needs a first-season episode or character reference')
    if (reference <= 12) return { label: `第一季官网第 ${reference} 集简介`, url: `https://noragami-anime.net/1/story.html#headCts${reference}` }
    const names = ['夜斗', '日和', '雪音', '小福', '大黑', '毘沙门', '兆麻', '天神', '野良', '蠃蚌']
    return { label: `第一季官网人物：${names[reference - 13]}`, url: `https://noragami-anime.net/1/character.html#charaScr${reference - 12}` }
  }),
  bank('attack-on-titan-final-season', '进击的巨人 最终季前半部', '限定2020–2021年最终季前半部第 60–75 集公开简介、该阶段人物信息及制作资料，含马莱身份、继承目标与宣战剧透；不混入Part 2第76集以后、完结篇或漫画后续。当前官网其他页面可能含后续剧透，本题不引用已更新的术语页。', titanFinalSeasonEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference)) throw new Error('Titan Final Season needs a numeric reference')
    if (reference >= 60 && reference <= 75) return { label: `最终季官网第 ${reference} 集简介`, url: `https://shingeki.tv/final/story/#/episode/${reference}` }
    const names = ['莱纳', '吉克', '法尔科', '贾碧', '皮克', '韩吉', '利威尔', '阿尔敏', '希斯特利亚', '让', '康尼', '三笠']
    if (reference >= 101 && reference <= 112) return { label: `最终季官网人物：${names[reference - 101]}（仅采用前半部信息）`, url: 'https://shingeki.tv/final/character/' }
    const paths = ['music/op/', 'music/ed/', 'product/final_1/', 'product/final_2/']
    const labels = ['前半部OP：僕の戦争', '前半部ED：衝撃', '前半部影碟第1卷：60–67集', '前半部影碟第2卷：68–75集']
    if (reference >= 113 && reference <= 116) return { label: `最终季官网${labels[reference - 113]}`, url: `https://shingeki.tv/final/${paths[reference - 113]}` }
    throw new Error('Titan Final Season reference outside part one sources')
  }),
  bank('erased', '只有我不在的街道', '限定2016年电视动画第 1–12 集官网简介及剧透续文，含真凶与结局剧透、儿童受虐和案件内容；不混入真人电影、真人剧或漫画独有结局。侧重时间变化、线索与人物行动，不把推测当作已证实事实。', erasedEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 12) throw new Error('Erased needs a TV episode from 1 to 12')
    return { label: `电视动画官网第 ${reference} 集简介及剧透续文`, url: `https://bokumachi-anime.com/story/${String(reference).padStart(2, '0')}/` }
  }),
  bank('akame-ga-kill', '斩！赤红之瞳', '限定2014年电视动画第 1–24 集官网简介与帝具说明，含后半段人物命运剧透；不混入漫画后续、零或其他衍生作品。重点考人物行动、帝具条件与战局判断。', akameEntries, (reference) => {
    if (reference === 'terms') return { label: '电视动画官网帝具说明（HTTP旧站，含图片正文）', url: 'http://akame.tv/teigu.html' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 24) throw new Error('Akame needs a TV episode from 1 to 24')
    return { label: `电视动画官网第 ${reference} 集简介（HTTP旧站）`, url: `http://akame.tv/story_${String(reference).padStart(2, '0')}.html` }
  }),
  bank('bleach', '死神 死神代行篇', '限定2004年电视动画死神代行篇第 1–20 集，含露琪亚被带走与救援训练剧透；不混入千年血战篇、尸魂界后续、剧场版或漫画后续身份。能力与人物判断以此阶段公开信息为准。', bleachEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 20) throw new Error('Bleach needs a Substitute Soul Reaper episode from 1 to 20')
    return { label: `万代频道正版发行第 ${reference} 集简介`, url: `https://www.b-ch.com/titles/4994/${String(reference).padStart(3, '0')}` }
  }),
  bank('assassination-classroom', '暗杀教室 第一季', '限定2015年电视动画第一季第 1–22 集及官网基础人物资料，含转学生、海岛救援与鹰冈相关剧透；不混入第二季、剧场版或漫画后续身份与结局。涉及战斗的题目只考剧情与能力判断，不提供现实操作步骤。', assassinationEntries, (reference) => {
    if (reference === 'terms') return { label: '动画官网故事介绍（仅引用开篇设定，页面含第二季信息）', url: 'https://www.ansatsu-anime.com/2014-2016/introduction/' }
    if (typeof reference !== 'number' || !Number.isInteger(reference)) throw new Error('Assassination Classroom needs a numbered reference')
    const episodes = ['1000302', '1000303', '1000316', '1000326', '1000345', '1000356', '1000361', '1000370', '1000372', '1000378', '1000394', '1000397', '1000407', '1000410', '1000415', '1000419', '1000422', '1000425', '1000514', '1000524', '1000528', '1000532']
    if (reference >= 1 && reference <= 22) return { label: `动画官网第一季第 ${reference} 集简介`, url: `https://www.ansatsu-anime.com/2014-2016/story/detail_1st.php?id=${episodes[reference - 1]}` }
    const characters = ['1', '2', '3', '4', 'e11', 'e1', 'e5', 'e13', 'e15', 'e19']
    if (reference >= 101 && reference <= 110) return { label: '动画官网人物资料（仅引用第一季基础信息）', url: `https://www.ansatsu-anime.com/2014-2016/character/chara/chara_${characters[reference - 101]}.php` }
    throw new Error('Assassination Classroom reference outside first-season sources')
  }),
  bank('seven-deadly-sins', '七大罪 第一季', '限定2014年版电视动画第一季第 1–24 集，含伊丽莎白能力、班的抉择与亨德里克森相关剧透；不混入戒律的复活、圣战的预兆、后续季度、剧场版或漫画后续设定。以第一季官网简介明确披露的信息为准。', sevenDeadlySinsEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 24) throw new Error('Seven Deadly Sins needs a first-season episode from 1 to 24')
    return { label: `第一季动画官网第 ${reference} 集简介`, url: `https://1st.7-taizai.net/story${reference === 24 ? '' : String(reference).padStart(2, '0')}.html` }
  }),
  bank('angel-beats', 'Angel Beats!', '限定2010年电视动画正篇第 1–13 集官网简介，含岩泽去向、音无记忆、分身、影子事件与毕业式剧透；不混入特别篇、游戏路线或漫画补充设定。角色当时的推测不等同于已证实的世界规则。', angelBeatsEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 13) throw new Error('Angel Beats needs a TV episode from 1 to 13')
    return { label: `动画官网正篇第 ${reference} 集简介`, url: `https://www.angelbeats.jp/story2/${reference === 1 ? 'index' : `ep${String(reference).padStart(2, '0')}`}.html` }
  }),
  bank('haikyuu', '排球少年 第一季', '限定2014年电视动画第一季第 1–25 集，含归队、预选赛对阵与战术调整剧透；不混入第二季、后续季度、OAD或剧场版。只考本季简介明确披露的位置、配合与比赛进程，不补写简介未披露的比分细节。', haikyuuEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 25) throw new Error('Haikyuu needs a first-season episode from 1 to 25')
    return { label: `万代频道正版发行第一季第 ${reference} 集简介`, url: `https://www.b-ch.com/titles/4065/${String(reference).padStart(3, '0')}` }
  }),
  bank('promised-neverland', '约定的梦幻岛 第一季', '限定2019年电视动画第一季第 1–12 集及官网人物资料，含农园真相、内通者与逃脱结局剧透；不混入第二季、漫画后续或真人电影。', promisedNeverlandEntries, (reference) => {
    if (reference === 'characters') return { label: '第一季动画官网人物资料', url: 'https://neverland-anime.com/1st/character/' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 12) throw new Error('Promised Neverland needs a first-season episode from 1 to 12')
    return { label: `第一季动画官网第 ${reference} 集简介`, url: `https://neverland-anime.com/1st/story/${String(reference).padStart(2, '0')}/` }
  }),
  bank('konosuba', '为美好的世界献上祝福！ 第一季', '限定2016年电视动画第一季第 1–10 集及第一季官网人物资料，含维兹身份、冬将军与机动要塞战剧透；不混入第二季、OVA、剧场版、外传或小说后续。', konosubaEntries, (reference) => {
    if (reference === 'characters') return { label: '第一季动画官网人物资料', url: 'https://konosuba.com/1st/character/' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 10) throw new Error('KonoSuba needs a first-season episode from 1 to 10')
    return { label: `第一季动画官网第 ${reference} 集简介（同页倒序排列）`, url: 'https://konosuba.com/1st/story/' }
  }),
  bank('future-diary', '未来日记', '限定2011–2012年电视动画正篇第 1–26 集及官网人物与日记资料，含持有者身份、日记弱点与世界重启剧透；不混入Redial、真人版或漫画版结局。', futureDiaryEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference)) throw new Error('Future Diary needs a numbered source')
    if (reference >= 1 && reference <= 26) return { label: `动画官网正篇第 ${reference} 集简介`, url: `https://future-diary.tv/story/story${String(reference).padStart(2, '0')}.html` }
    const characters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7thm', '8th', '9th', '10th', '11th', '12th', 'deus', 'murmur']
    if (reference >= 101 && reference <= 114) return { label: '动画官网人物与未来日记资料', url: `https://future-diary.tv/chara/${characters[reference - 101]}.html` }
    throw new Error('Future Diary reference outside TV sources')
  }),
  bank('sword-art-online-2', '刀剑神域Ⅱ', '限定2014年电视动画第二季第 1–24 集，覆盖幽灵子弹、圣剑与圣母圣咏三篇，含死枪调查、优纪病情与攻略进程剧透；不含14.5集总集篇、序列之争、Alicization或外传GGO。', swordArtOnlineTwoEntries, (reference) => {
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 24) throw new Error('SAO II needs a second-season episode from 1 to 24')
    const arc = reference <= 14 ? 'phantom' : reference <= 17 ? 'calibur' : 'mothers'
    return { label: `第二季动画官网第 ${reference} 集简介`, url: `https://www.swordart-online.net/${arc}/story/?id=ep${String(reference).padStart(2, '0')}` }
  }),
  bank('cowboy-bebop', '星际牛仔', '限定1998年电视动画第 1–26 集及官网电视版世界观，含船员过去、案件线索与红龙终局冲突剧透；不混入剧场版、真人版或漫画改编，不对未明确说明的终局状态下结论。', cowboyBebopEntries, (reference) => {
    if (reference === 'terms') return { label: '动画官网电视版世界观', url: 'https://www.cowboy-bebop.net/world/#tv' }
    if (typeof reference !== 'number' || !Number.isInteger(reference) || reference < 1 || reference > 26) throw new Error('Cowboy Bebop needs a TV episode from 1 to 26')
    const page = Math.min(5, Math.ceil(reference / 5))
    return { label: `动画官网第 ${reference} 集简介（分组同页）`, url: `https://www.cowboy-bebop.net/story/${page === 1 ? '' : `${String(page).padStart(2, '0')}.html`}` }
  }),
]

const titles = ['人物与世界入门', '行动与规则应用', '证据与战术推演']
export const expansionQuizzes: Quiz[] = expansionBanks.flatMap((bank) => difficulties.map((difficulty, index) => ({
  id: index === 0 ? bank.series : `${bank.series}-${index === 1 ? 'intermediate' : 'advanced'}`,
  series: bank.series, title: `${bank.title}，${bank.series === 'cowboy-bebop' ? ['船员与世界入门', '赏金与旅途线索', '案件判断与人物往事'][index] : bank.series === 'sword-art-online-2' ? ['人物与篇章入门', '赛事与任务规则', '条件判断与团队协作'][index] : bank.series === 'future-diary' ? ['人物与日记入门', '预知规则与事件线索', '信息盲点与条件判断'][index] : bank.series === 'konosuba' ? ['人物与职业入门', '任务与技能线索', '能力限制与队伍配合'][index] : bank.series === 'promised-neverland' ? ['人物与农园入门', '情报与合作线索', '信任判断与计划变化'][index] : bank.series === 'haikyuu' ? ['人物与位置入门', '配合与赛程线索', '战术判断与团队调整'][index] : bank.series === 'angel-beats' ? ['战线与校园入门', '记忆与能力线索', '行动判断与毕业准备'][index] : bank.series === 'seven-deadly-sins' ? ['人物与神器入门', '能力与旅途线索', '身份判断与王都战局'][index] : bank.series === 'assassination-classroom' ? ['人物与课堂入门', '特长与事件线索', '教学判断与团队救援'][index] : bank.series === 'bleach' ? ['人物与代行入门', '灵魂机制与事件线索', '能力限制与救援准备'][index] : bank.series === 'akame-ga-kill' ? ['人物与帝具入门', '组织行动与能力机制', '帝具限制与战局判断'][index] : bank.series === 'erased' ? ['人物与再上映入门', '时间线与案件线索', '证据判断与救援决策'][index] : bank.series === 'attack-on-titan-final-season' ? ['马莱人物与音乐入门', '剧情与制作资料', '战争形势与版本辨析'][index] : bank.series === 'toradora' ? ['人物与校园入门', '事件与关系脉络', '心意与行动辨析'][index] : bank.series === 'your-lie-in-april' ? ['人物与音乐入门', '比赛与成长轨迹', '演奏诠释与人物动机'][index] : bank.series === 'a-silent-voice' ? ['人物与电影入门', '关系与制作知识', '声音设计与创作原理'][index] : bank.series === 'attack-on-titan-season-3-part-2' ? ['夺还作战入门', '剧情与制作知识', '战局判断与版本辨析'][index] : titles[index]}`,
  description: `${bank.title}专题，12 道${difficulty}题。结合剧情与设定判断，每题附原创配图、解析和官方资料链接。`,
  category: '二次元', difficulty, duration: difficultySeconds[difficulty],
  image: originalArt(bank.series === 'cowboy-bebop' ? 'space' : bank.series === 'sword-art-online-2' ? 'arena' : bank.series === 'future-diary' ? 'time' : bank.series === 'konosuba' ? 'magic' : bank.series === 'haikyuu' ? 'training' : bank.series === 'angel-beats' ? 'music' : bank.series === 'seven-deadly-sins' ? 'adventure' : bank.series === 'assassination-classroom' ? 'academy' : bank.series === 'bleach' ? 'magic' : bank.series === 'akame-ga-kill' ? 'arena' : bank.series === 'erased' ? 'detective' : bank.series === 'attack-on-titan-final-season' ? 'arena' : bank.series === 'noragami' ? 'magic' : bank.series === 'mob-psycho-100' ? 'magic' : bank.series === 'toradora' ? 'connections' : bank.series === 'your-lie-in-april' ? 'chamber-music' : bank.series === 'rezero-season-1' ? 'time' : bank.series === 'no-game-no-life' ? 'boardgame' : bank.series === 'attack-on-titan-season-3-part-2' ? 'arena' : bank.series === 'a-silent-voice' ? 'music' : bank.series === 'attack-on-titan-season-3' ? 'detective' : bank.series === 'naruto-shippuden' ? 'training' : bank.series === 'steins-gate' ? 'time' : bank.series === 'your-name' ? 'connections' : bank.series === 'tokyo-ghoul' ? 'city' : bank.series === 'jujutsu-kaisen' ? 'magic' : bank.series === 'hunter-x-hunter' ? 'adventure' : bank.series === 'my-hero-academia' || bank.series === 'my-hero-academia-season-2' || bank.series === 'my-hero-academia-season-3' ? 'academy' : bank.series === 'attack-on-titan-season-2' || bank.series === 'attack-on-titan' || bank.series === 'one-punch-man' || bank.series === 'sword-art-online' ? 'arena' : bank.series === 'fullmetal-alchemist-brotherhood' ? 'laboratory' : 'detective'),
  color: index === 0 ? 'mint' : 'lavender', tag: '新 IP · 原创配图',
  scope: `${bank.scope} 配图为原创主题示意图，并非作品场景。`,
  questions: bank.questions.filter((question) => question.difficulty === difficulty).slice(0, 12),
})))

export const expansionAdditions: Partial<Record<AnimeSeriesId, BankQuestion[]>> = Object.fromEntries(expansionBanks.map((bank) => [
  bank.series, difficulties.flatMap((level) => bank.questions.filter((question) => question.difficulty === level).slice(12)),
]))
