import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:any,fs:F[]):ExpansionEntry[]=>fs.slice(0,10).flatMap((f,i)=>Array.from({length:5},(_,n)=>[(i%10)+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
'quintessential':[['中野五姐妹的家庭教师是？','上杉风太郎','上杉らいは','武田','五月'],...base('五等分的新娘')],
'rezero2p2':[['菜月昴的能力是？','死亡回归','时间停止','读心','飞行'],...base('Re从零第二季后半')],
'haikyuu-top':[['日向翔阳的位置是？','副攻手','二传手','自由人','教练'],...base('排球少年TO THE TOP')],
'foodwars3':[['幸平创真的目标是？','成为优秀厨师','成为医生','成为记者','成为骑士'],...base('食戟之灵第三季')],
'tanya':[['谭雅·提古雷查夫的身份是？','帝国军人','学生会长','医生','记者'],...base('幼女战记')],
'end-evangelion':[['EVA初号机驾驶员是？','碇真嗣','明日香','绫波丽','葛城美里'],...base('新世纪福音战士剧场版')],
'chivalry':[['黑铁一辉的目标是？','成为魔导骑士','成为医生','成为教师','赢得料理赛'],...base('落第骑士英雄谭')],
'plastic-memories':[['艾拉的身份是？','Giftia机器人','魔法师','警察','医生'],...base('可塑性记忆')],
'oshi-no-ko':[['星野爱所属的职业是？','偶像','教师','记者','医生'],...base('我推的孩子')],
'cyberpunk':[['大卫·马丁内斯生活的城市是？','夜之城','东京','王都','冬木市'],...base('赛博朋克边缘行者')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
