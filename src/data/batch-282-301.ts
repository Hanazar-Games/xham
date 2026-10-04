import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'dandadan':[['《dandadan》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('dandadan')],
 'sakamoto-days':[['《sakamoto-days》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('sakamoto-days')],
 'alya-sometimes':[['《alya-sometimes》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('alya-sometimes')],
 'makeine':[['《makeine》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('makeine')],
 'elusive-samurai':[['《elusive-samurai》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('elusive-samurai')],
 'nier-automata':[['《nier-automata》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('nier-automata')],
 'trigun-stampede':[['《trigun-stampede》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('trigun-stampede')],
 'hells-paradise':[['《hells-paradise》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('hells-paradise')],
 'zom-100':[['《zom-100》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('zom-100')],
 'tomo-chan':[['《tomo-chan》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('tomo-chan')],
 'skip-and-loafer':[['《skip-and-loafer》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('skip-and-loafer')],
 'insomniacs-after-school':[['《insomniacs-after-school》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('insomniacs-after-school')],
 'buddy-daddies':[['《buddy-daddies》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('buddy-daddies')],
 'spy-classroom':[['《spy-classroom》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('spy-classroom')],
 'my-happy-marriage':[['《my-happy-marriage》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('my-happy-marriage')],
 'raven-consort':[['《raven-consort》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('raven-consort')],
 'yakuza-fiance':[['《yakuza-fiance》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('yakuza-fiance')],
 'blue-box':[['《blue-box》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-box')],
 'orb-on-movements':[['《orb-on-movements》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('orb-on-movements')],
 'witch-hat-atelier':[['《witch-hat-atelier》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('witch-hat-atelier')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
