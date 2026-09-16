export type AnimeSeriesId = 'demon-slayer' | 'one-piece' | 'naruto' | 'ghibli' | 'rezero' | 'frieren' | 'crossover'
export type Difficulty = '简单' | '困难'

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
  category: '二次元'
  series: AnimeSeriesId
  difficulty: Difficulty
  image?: QuizImage
  color: string
  tag: string
  duration: number
  scope?: string
  questions: readonly Question[]
}
