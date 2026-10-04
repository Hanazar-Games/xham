import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'chainsaw-man2':[['《chainsaw-man2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('chainsaw-man2')],
 'spy-family3':[['《spy-family3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('spy-family3')],
 'oshi-no-ko2':[['《oshi-no-ko2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('oshi-no-ko2')],
 'blue-lock2':[['《blue-lock2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-lock2')],
 'jjk-shibuya':[['《jjk-shibuya》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('jjk-shibuya')],
 'demon-slayer-hashira':[['《demon-slayer-hashira》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('demon-slayer-hashira')],
 'my-hero-academia7':[['《my-hero-academia7》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('my-hero-academia7')],
 'one-piece-egghead':[['《one-piece-egghead》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('one-piece-egghead')],
 'frieren-exam':[['《frieren-exam》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('frieren-exam')],
 'apothecary-diaries2':[['《apothecary-diaries2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('apothecary-diaries2')],
 'delicious-in-dungeon2':[['《delicious-in-dungeon2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('delicious-in-dungeon2')],
 'kaiju-no-8-season-2':[['《kaiju-no-8-season-2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('kaiju-no-8-season-2')],
 'wind-breaker2':[['《wind-breaker2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('wind-breaker2')],
 'mashle2':[['《mashle2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('mashle2')],
 'classroom-of-the-elite2':[['《classroom-of-the-elite2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('classroom-of-the-elite2')],
 'tokyo-revengers2':[['《tokyo-revengers2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('tokyo-revengers2')],
 'solo-leveling-arise':[['《solo-leveling-arise》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('solo-leveling-arise')],
 'black-butler-public-school':[['《black-butler-public-school》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('black-butler-public-school')],
 'konosuba-movie':[['《konosuba-movie》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('konosuba-movie')],
 'slime-movie':[['《slime-movie》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('slime-movie')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
