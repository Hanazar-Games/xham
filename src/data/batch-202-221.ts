import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'inuyasha':[['《inuyasha》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('inuyasha')],
 'sailor-moon':[['《sailor-moon》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('sailor-moon')],
 'yu-yu-hakusho':[['《yu-yu-hakusho》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('yu-yu-hakusho')],
 'katekyo-hitman-reborn':[['《katekyo-hitman-reborn》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('katekyo-hitman-reborn')],
 'gintama2':[['《gintama2》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('gintama2')],
 'drifters':[['《drifters》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('drifters')],
 'golden-kamuy':[['《golden-kamuy》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('golden-kamuy')],
 'land-of-the-lustrous':[['《land-of-the-lustrous》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('land-of-the-lustrous')],
 'princess-principal':[['《princess-principal》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('princess-principal')],
 'promare':[['《promare》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('promare')],
 'odd-taxi':[['《odd-taxi》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('odd-taxi')],
 'sonny-boy':[['《sonny-boy》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('sonny-boy')],
 'wonder-egg-priority':[['《wonder-egg-priority》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('wonder-egg-priority')],
 'sk8-infinity':[['《sk8-infinity》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('sk8-infinity')],
 'link-click':[['《link-click》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('link-click')],
 'ranking-of-kings':[['《ranking-of-kings》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('ranking-of-kings')],
 'vivy':[['《vivy》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('vivy')],
 'lycoris-recoil':[['《lycoris-recoil》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('lycoris-recoil')],
 'bocchi-the-rock':[['《bocchi-the-rock》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('bocchi-the-rock')],
 'heavenly-delusion':[['《heavenly-delusion》的主角或核心设定是？','核心角色','校园社团','料理冠军','宇宙旅行'],...base('heavenly-delusion')]
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
