import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'solo-leveling-s2':[[`《solo-leveling-s2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('solo-leveling-s2')],
 'spy-family-movie':[[`《spy-family-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('spy-family-movie')],
 'chainsaw-man-movie':[[`《chainsaw-man-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('chainsaw-man-movie')],
 'madoka-walpurgis':[[`《madoka-walpurgis》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('madoka-walpurgis')],
 'frieren2-anime':[[`《frieren2-anime》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('frieren2-anime')],
 'oshi-no-ko3':[[`《oshi-no-ko3》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('oshi-no-ko3')],
 'blue-lock-movie':[[`《blue-lock-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-lock-movie')],
 'demon-slayer-infinity-castle':[[`《demon-slayer-infinity-castle》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('demon-slayer-infinity-castle')],
 'one-piece-film-red':[[`《one-piece-film-red》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('one-piece-film-red')],
 'slam-dunk-movie':[[`《slam-dunk-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('slam-dunk-movie')],
 'trapezium':[[`《trapezium》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('trapezium')],
 'gridman-universe':[[`《gridman-universe》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('gridman-universe')],
 'euphonium3':[[`《euphonium3》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('euphonium3')],
 'yuru-camp3':[[`《yuru-camp3》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('yuru-camp3')],
 'spice-and-wolf2024':[[`《spice-and-wolf2024》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('spice-and-wolf2024')],
 'bartender-glass':[[`《bartender-glass》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('bartender-glass')],
 'go-go-loser-ranger':[[`《go-go-loser-ranger》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('go-go-loser-ranger')],
 'mission-yozakura':[[`《mission-yozakura》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mission-yozakura')],
 'shangri-la-frontier':[[`《shangri-la-frontier》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('shangri-la-frontier')],
 'ragna-crimson':[[`《ragna-crimson》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ragna-crimson')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
