import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'attack-on-titan-final':[['《attack-on-titan-final》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('attack-on-titan-final')],
 'demon-slayer-swordsmith':[['《demon-slayer-swordsmith》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('demon-slayer-swordsmith')],
 'jujutsu-kaisen3':[['《jujutsu-kaisen3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('jujutsu-kaisen3')],
 'my-hero-academia6':[['《my-hero-academia6》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('my-hero-academia6')],
 'one-piece-wano':[['《one-piece-wano》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('one-piece-wano')],
 'naruto-boruto':[['《naruto-boruto》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('naruto-boruto')],
 'bleach-tybw':[['《bleach-tybw》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('bleach-tybw')],
 'dragon-ball-super':[['《dragon-ball-super》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('dragon-ball-super')],
 'fairy-tail-final':[['《fairy-tail-final》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('fairy-tail-final')],
 'black-clover2':[['《black-clover2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('black-clover2')],
 're-zero3':[['《re-zero3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('re-zero3')],
 'konosuba3':[['《konosuba3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('konosuba3')],
 'overlord4':[['《overlord4》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('overlord4')],
 'that-time-slime3':[['《that-time-slime3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('that-time-slime3')],
 'haikyuu4':[['《haikyuu4》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('haikyuu4')],
 'food-wars4':[['《food-wars4》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('food-wars4')],
 'kaguya-sama3':[['《kaguya-sama3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('kaguya-sama3')],
 'dr-stone3':[['《dr-stone3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('dr-stone3')],
 'maid-sama2':[['《maid-sama2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('maid-sama2')],
 'noragami3':[['《noragami3》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('noragami3')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
