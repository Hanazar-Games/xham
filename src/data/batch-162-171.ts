import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:any,fs:F[]):ExpansionEntry[]=>fs.slice(0,10).flatMap((f,i)=>Array.from({length:5},(_,n)=>[(i%10)+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:10},(_,i)=>[`《${name}》的核心设定考点${i+1}是？`,`《${name}》设定${i+1}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
'slime2':[['利姆鲁的身份是？','史莱姆魔王','人类国王','龙族','骑士'],...base('关于转生史莱姆')],
'solo-leveling':[['成振宇获得的力量是？','系统能力','替身','咒术','魔法杖'],...base('Solo Leveling')],
'prison-school':[['藤野清志被关押的地方是？','监狱学园','医院','王都','体育馆'],...base('监狱学园')],
'kaguya-ultra':[['四宫辉夜所在组织是？','学生会','骑士团','侦探社','篮球部'],...base('辉夜大小姐第三季')],
'wotakoi':[['桃濑成海的爱好是？','宅文化与同人','料理','剑术','摄影'],...base('宅男腐女恋爱真难')],
'demon-swordsmith':[['灶门炭治郎前往的村子是？','刀匠村','花街','蝶屋','雪山'],...base('鬼灭之刃刀匠村篇')],
'rent-girlfriend':[['木之下和也是？','大学生','医生','教师','警察'],...base('出租女友')],
'fairy-tail-2014':[['纳兹所属的公会是？','妖精尾巴','蛇姬之鳞','剑咬之虎','幽鬼支配者'],...base('妖精的尾巴2014')],
'kimi-ni-todoke':[['黑沼爽子的昵称是？','贞子','小雪','女王','天使'],...base('好想告诉你')],
'tower-god':[['夜在塔中寻找？','真相与朋友','龙珠','圣杯','工作'],...base('神之塔')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
