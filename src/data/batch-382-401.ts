import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'apocalypse-hotel':[[`《apocalypse-hotel》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('apocalypse-hotel')],
 'rock-is-lady':[[`《rock-is-lady》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('rock-is-lady')],
 'flower-and-asura':[[`《flower-and-asura》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('flower-and-asura')],
 'zenshu':[[`《zenshu》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('zenshu')],
 'okitsura':[[`《okitsura》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('okitsura')],
 'honey-lemon-soda':[[`《honey-lemon-soda》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('honey-lemon-soda')],
 'ameku-md':[[`《ameku-md》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ameku-md')],
 'ave-mujica':[[`《ave-mujica》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ave-mujica')],
 'medalist2':[[`《medalist2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('medalist2')],
 'old-country-bumpkin':[[`《old-country-bumpkin》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('old-country-bumpkin')],
 'witch-watch':[[`《witch-watch》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('witch-watch')],
 'can-boy-girl-friendship':[[`《can-boy-girl-friendship》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('can-boy-girl-friendship')],
 'food-for-the-soul':[[`《food-for-the-soul》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('food-for-the-soul')],
 'ninjas-and-assassins':[[`《ninjas-and-assassins》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ninjas-and-assassins')],
 'princess-session':[[`《princess-session》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('princess-session')],
 'shoshimin2':[[`《shoshimin2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('shoshimin2')],
 'ao-no-hako2':[[`《ao-no-hako2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('ao-no-hako2')],
 'to-be-hero-x':[[`《to-be-hero-x》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('to-be-hero-x')],
 'yaiba2025':[[`《yaiba2025》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('yaiba2025')],
 'cat-eye2025':[[`《cat-eye2025》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('cat-eye2025')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
