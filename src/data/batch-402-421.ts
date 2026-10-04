import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'silent-witch':[[`《silent-witch》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('silent-witch')],
 'kusuriya3':[[`《kusuriya3》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('kusuriya3')],
 'dress-up-darling2':[[`《dress-up-darling2》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('dress-up-darling2')],
 'takopi-original-sin':[[`《takopi-original-sin》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('takopi-original-sin')],
 'clevatess':[[`《clevatess》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('clevatess')],
 'new-panty-stocking':[[`《new-panty-stocking》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('new-panty-stocking')],
 'toujima-tanzaburo':[[`《toujima-tanzaburo》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('toujima-tanzaburo')],
 'bad-girl':[[`《bad-girl》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('bad-girl')],
 'see-you-tomorrow-food-court':[[`《see-you-tomorrow-food-court》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('see-you-tomorrow-food-court')],
 'watari-kun':[[`《watari-kun》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('watari-kun')],
 'private-tutor-duke':[[`《private-tutor-duke》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('private-tutor-duke')],
 'detectives-these-days':[[`《detectives-these-days》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('detectives-these-days')],
 'cultural-exchange-game-centre':[[`《cultural-exchange-game-centre》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('cultural-exchange-game-centre')],
 'mikadono-sisters':[[`《mikadono-sisters》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mikadono-sisters')],
 'busamen-gachi-fighter':[[`《busamen-gachi-fighter》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('busamen-gachi-fighter')],
 'solo-camping':[[`《solo-camping》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('solo-camping')],
 'betrothed-to-sister':[[`《betrothed-to-sister》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('betrothed-to-sister')],
 'city-hunter-angel-dust':[[`《city-hunter-angel-dust》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('city-hunter-angel-dust')],
 'maboroshi':[[`《maboroshi》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('maboroshi')],
 'lonely-castle':[[`《lonely-castle》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('lonely-castle')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
