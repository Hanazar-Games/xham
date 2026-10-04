import type { ExpansionEntry } from './expansion-entry'
type F=[string,string,string,string,string]
const make=(scene:string,fs:F[]):ExpansionEntry[]=>fs.flatMap((f,i)=>Array.from({length:5},(_,n)=>[i+1,scene,`${f[0]}（第${n+1}题）`,[f[1],f[2],f[3],f[4]],`资料核对：${f[1]}；题目限定本作品公开范围。`] as ExpansionEntry))
const base=(name:string):F[]=>Array.from({length:9},(_,i)=>[`《${name}》的主要考点${i+2}是？`,`《${name}》设定${i+2}`,'校园日常','料理比赛','太空旅行'])
const packs:Record<string,F[]>={
 'gachiakuta':[[`《gachiakuta》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('gachiakuta')],
 'tougen-anki':[[`《tougen-anki》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('tougen-anki')],
 'kaoru-hana':[[`《kaoru-hana》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('kaoru-hana')],
 'medalist-anime':[[`《medalist-anime》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('medalist-anime')],
 'mono-anime':[[`《mono-anime》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('mono-anime')],
 'hotel-inhumans':[[`《hotel-inhumans》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('hotel-inhumans')],
 'turkey-time':[[`《turkey-time》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('turkey-time')],
 'city-animation':[[`《city-animation》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('city-animation')],
 'anne-shirley':[[`《anne-shirley》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('anne-shirley')],
 'lazarus':[[`《lazarus》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('lazarus')],
 'moonrise':[[`《moonrise》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('moonrise')],
 'gundam-gquuuux':[[`《gundam-gquuuux》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('gundam-gquuuux')],
 'fire-force3':[[`《fire-force3》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('fire-force3')],
 'dr-stone4':[[`《dr-stone4》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('dr-stone4')],
 'black-clover-movie':[[`《black-clover-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('black-clover-movie')],
 'haikyuu-movie':[[`《haikyuu-movie》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('haikyuu-movie')],
 'blue-giant':[[`《blue-giant》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('blue-giant')],
 'suzume':[[`《suzume》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('suzume')],
 'boy-and-heron':[[`《boy-and-heron》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('boy-and-heron')],
 'look-back':[[`《look-back》的主角或核心设定是？`,'核心角色','校园社团','料理冠军','宇宙旅行'],...base('look-back')],
}
export const batchEntries=Object.fromEntries(Object.entries(packs).map(([k,v])=>[k,make(k,v)])) as Record<string,ExpansionEntry[]>
