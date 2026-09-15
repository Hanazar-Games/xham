export type Category = '全部' | '综合知识' | '科学自然' | '世界探索' | '文化艺术' | '二次元'
export type ArtworkKind = 'brain' | 'space' | 'world' | 'science' | 'art' | 'history'

export interface QuizImage {
  src: string
  alt: string
  credit: string
  sourceUrl: string
  fit?: 'cover' | 'contain' | 'scale-down'
}

export interface Question {
  id: string
  prompt: string
  options: readonly [string, string, string, string]
  answer: number
  explanation: string
  image?: QuizImage
  source?: { label: string; url: string }
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: Exclude<Category, '全部'>
  difficulty: '轻松入门' | '小有挑战'
  artwork: ArtworkKind
  image?: QuizImage
  color: string
  tag: string
  duration: number
  scope?: string
  questions: readonly Question[]
}
