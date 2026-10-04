import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'farmagia':[[`《farmagia》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('farmagia')],
 'amagami-sister':[[`《amagami-sister》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('amagami-sister')],
 'blue-miburo':[[`《blue-miburo》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-miburo')],
 'negative-positive-angler':[[`《negative-positive-angler》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('negative-positive-angler')],
 'mecha-ude':[[`《mecha-ude》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mecha-ude')],
 'demon-lord-2099':[[`《demon-lord-2099》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('demon-lord-2099')],
 'magilumiere':[[`《magilumiere》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('magilumiere')],
 'orbital-children':[[`《orbital-children》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('orbital-children')],
 'bubble-movie':[[`《bubble-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('bubble-movie')],
 'summer-ghost':[[`《summer-ghost》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('summer-ghost')],
 'sing-a-bit':[[`《sing-a-bit》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('sing-a-bit')],
 'words-bubble':[[`《words-bubble》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('words-bubble')],
 'her-blue-sky':[[`《her-blue-sky》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('her-blue-sky')],
 'penguin-highway':[[`《penguin-highway》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('penguin-highway')],
 'mirai-movie':[[`《mirai-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mirai-movie')],
 'maquia':[[`《maquia》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('maquia')],
 'patema-inverted':[[`《patema-inverted》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('patema-inverted')],
 'redline':[[`《redline》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('redline')],
 'paprika':[[`《paprika》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('paprika')],
 'millennium-actress':[[`《millennium-actress》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('millennium-actress')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
