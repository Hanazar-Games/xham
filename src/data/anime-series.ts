import type { AnimeSeriesId } from '../types'

export const animeSeries: { id: AnimeSeriesId; title: string; subtitle: string; aliases: string }[] = [
  { id: 'demon-slayer', title: '鬼灭之刃', subtitle: '鬼杀队 · 感知与协作', aliases: '鬼灭 kimetsu demon slayer' },
  { id: 'one-piece', title: '海贼王', subtitle: '草帽一伙 · 职责与航海', aliases: '航海王 one piece' },
  { id: 'naruto', title: '火影忍者', subtitle: '木叶 · 任务与成长', aliases: '火影 naruto' },
  { id: 'ghibli', title: '吉卜力电影', subtitle: '十二部电影 · 细节与联系', aliases: '吉卜力 宫崎骏 ghibli' },
  { id: 'rezero', title: 'Re:0', subtitle: '异世界 · 人物与机制', aliases: 're0 re:zero 从零开始的异世界生活' },
  { id: 'frieren', title: '葬送的芙莉莲', subtitle: '旅途 · 传承与人物关系', aliases: '芙莉莲 frieren' },
]
