import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'frieren2':[['《frieren2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('frieren2')],
 'blue-lock':[['《blue-lock》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-lock')],
 'kaiju-no-8':[['《kaiju-no-8》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('kaiju-no-8')],
 'wind-breaker':[['《wind-breaker》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('wind-breaker')],
 'solo-leveling2':[['《solo-leveling2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('solo-leveling2')],
 'delicious-in-dungeon':[['《delicious-in-dungeon》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('delicious-in-dungeon')],
 'apothecary-diaries':[['《apothecary-diaries》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('apothecary-diaries')],
 'metallic-rouge':[['《metallic-rouge》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('metallic-rouge')],
 'undead-unluck':[['《undead-unluck》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('undead-unluck')],
 'fire-force2':[['《fire-force2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('fire-force2')],
 'mashle':[['《mashle》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('mashle')],
 'eminence-shadow':[['《eminence-shadow》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('eminence-shadow')],
 'shadow-house':[['《shadow-house》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('shadow-house')],
 'call-of-night':[['《call-of-night》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('call-of-night')],
 'moriarty-patriot':[['《moriarty-patriot》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('moriarty-patriot')],
 'great-pretender':[['《great-pretender》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('great-pretender')],
 'beastars':[['《beastars》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('beastars')],
 'cyberpunk2':[['《cyberpunk2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('cyberpunk2')],
 'pluto':[['《pluto》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('pluto')],
 'summer-time-render':[['《summer-time-render》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('summer-time-render')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
