import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'promised-neverland2':[['艾玛想带伙伴前往哪里？','外面的世界','王都','太空站','远月学院'],...base('约定的梦幻岛 第二季')],
 'nozaki-kun':[['野崎梅太郎的职业是？','漫画家','医生','厨师','记者'],...base('月刊少女野崎君')],
 'to-your-eternity':[['不死的主角最初以什么形态出现？','白色球体','巨龙','人类婴儿','机器人'],...base('致不灭的你')],
 'tokyo-ghoul-re2':[['佐佐木琲世的真实身份与谁有关？','金木研','永近英良','月山习','有马贵将'],...base('东京喰种re 第二季')],
 'nichijou':[['东云名乃的身份是？','机器人','魔法师','教师','记者'],...base('日常')],
 'haruhi':[['凉宫春日希望寻找什么？','不可思议事件','料理冠军','宝藏','外星飞船'],...base('凉宫春日的忧郁')],
 'black-bullet':[['里见莲太郎所属的组织是？','民警','学生会','骑士团','远月学院'],...base('黑色子弹')],
 'masamune-kun':[['真壁政宗减重后的目标是？','向安达垣爱姬复仇','成为厨师','寻找父亲','参加选秀'],...base('政宗君的复仇')],
 'highschool-dxd-new':[['兵藤一诚的身份是？','恶魔','吸血鬼','精灵','魔法使'],...base('High School DxD New')],
 'kiznaiver':[['阿形胜平被连接到什么系统？','Kizna系统','圣杯系统','量子电脑','魔法阵'],...base('羁绊者')]
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
