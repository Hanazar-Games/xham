import type { QuizImage } from '../types'

export const originalScenes = {
  kitchen: '料理台上的锅、鸡蛋、蔬菜与调味瓶',
  'chamber-music': '舞台上的钢琴、小提琴与琴弓',
  boardgame: '棋盘、两枚棋子、卡片与骰子的桌游示意图',
  connections: '六个图形节点组成的知识连接图',
  voyage: '海面上的帆船与航线',
  training: '山间训练场与木制靶',
  forest: '森林小屋与蜿蜒步道',
  magic: '书本、晶石与魔法研究桌',
  time: '钟面与循环轨道',
  detective: '放大镜、线索卡与笔记',
  city: '夜晚的城市与交错街道',
  family: '餐桌上三份餐具与花瓶',
  music: '舞台上的吉他、音箱与鼓',
  laboratory: '实验桌上的烧瓶与天平',
  aviation: '设计台上的通用螺旋桨飞机模型',
  space: '星空中的行星与观测台',
  academy: '教室里的课桌与黑板',
  adventure: '地图、指南针与露营背包',
  arena: '竞技场与交叉的训练剑',
  volleyball: '排球、球网与室内球场的原创示意图',
  creatures: '森林中的原创圆形小生物',
} as const

export type OriginalScene = keyof typeof originalScenes

export function originalArt(scene: OriginalScene): QuizImage {
  return {
    src: `/images/original/${scene}.svg`,
    alt: `${originalScenes[scene]}，原创主题示意图，并非作品场景`,
    credit: '2 dimention 原创示意图 · 非官方素材',
    sourceUrl: '/images/original/credits.html',
    fit: 'contain',
  }
}
