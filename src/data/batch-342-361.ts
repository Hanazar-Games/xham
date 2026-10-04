import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'danmachi5':[[`《danmachi5》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('danmachi5')],
 'rezero4':[[`《rezero4》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('rezero4')],
 'bleach-tybw2':[[`《bleach-tybw2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('bleach-tybw2')],
 'dragon-ball-daima':[[`《dragon-ball-daima》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('dragon-ball-daima')],
 'ranma2024':[[`《ranma2024》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ranma2024')],
 'kenshin2023':[[`《kenshin2023》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('kenshin2023')],
 'urusei-yatsura2022':[[`《urusei-yatsura2022》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('urusei-yatsura2022')],
 'pokemon-horizons':[[`《pokemon-horizons》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('pokemon-horizons')],
 'precure-wonderful':[[`《precure-wonderful》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('precure-wonderful')],
 'dungeon-people':[[`《dungeon-people》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('dungeon-people')],
 'mayonaka-punch':[[`《mayonaka-punch》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mayonaka-punch')],
 'vtuber-legend':[[`《vtuber-legend》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('vtuber-legend')],
 'pseudo-harem':[[`《pseudo-harem》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('pseudo-harem')],
 'days-with-stepsister':[[`《days-with-stepsister》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('days-with-stepsister')],
 'deer-friend-nokotan':[[`《deer-friend-nokotan》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('deer-friend-nokotan')],
 'twilight-out-of-focus':[[`《twilight-out-of-focus》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('twilight-out-of-focus')],
 'senpai-is-otokonoko':[[`《senpai-is-otokonoko》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('senpai-is-otokonoko')],
 'failure-frame':[[`《failure-frame》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('failure-frame')],
 'quality-assurance-another-world':[[`《quality-assurance-another-world》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('quality-assurance-another-world')],
 'suicide-squad-isekai':[[`《suicide-squad-isekai》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('suicide-squad-isekai')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
