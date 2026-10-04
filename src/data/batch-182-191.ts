import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>= {
 'ancient-magus':[['羽鸟智世的身份是？','魔法使学徒','骑士','记者','厨师'],...base('魔法使的新娘')],
 'hellsing-ultimate':[['阿卡多效忠的组织是？','皇家国教骑士团','学生会','远月学院','调查兵团'],...base('Hellsing Ultimate')],
 'five-centimeters':[['远野贵树与篠原明里通过什么保持联系？','书信','魔法','无线电','报纸'],...base('秒速五厘米')],
 'blue-spring-ride':[['马渕洸与吉冈双叶的关系是？','同学','兄妹','师生','邻居'],...base('青春之旅')],
 'darker-than-black':[['黑的代号是什么？','BK-201','X-001','零号','月影'],...base('黑之契约者')],
 'overlord3':[['安兹·乌尔·恭的种族是？','不死者','人类','精灵','龙族'],...base('Overlord 第三季')],
 'danganronpa':[['希望峰学园的学生被谁困住？','黑白熊','校长','机器人','记者'],...base('弹丸论破')],
 'komi-cant-communicate':[['古见硝子的主要困难是？','沟通障碍','失忆','不会读书','害怕运动'],...base('古见同学')],
 'fate-stay-night':[['卫宫士郎的职业目标是？','正义的伙伴','医生','记者','国王'],...base('Fate stay night')],
 'god-of-high-school':[['陈毛利参加的赛事是？','全国高中格斗大会','剑道联赛','料理大赛','魔法考试'],...base('高校之神')]
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
