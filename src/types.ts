export type AnimeSeriesId = 'demon-slayer' | 'one-piece' | 'naruto' | 'ghibli' | 'rezero' | 'frieren' | 'crossover' | 'attack-on-titan' | 'death-note' | 'fullmetal-alchemist-brotherhood' | 'one-punch-man' | 'my-hero-academia' | 'sword-art-online' | 'hunter-x-hunter' | 'jujutsu-kaisen' | 'tokyo-ghoul' | 'your-name' | 'attack-on-titan-season-2' | 'steins-gate' | 'naruto-shippuden'
export type Difficulty = '简单' | '中等' | '困难'
export const difficulties: Difficulty[] = ['简单', '中等', '困难']
export const difficultySeconds: Record<Difficulty, number> = { 简单: 20, 中等: 25, 困难: 30 }

export interface QuizImage {
  src: string
  alt: string
  credit: string
  sourceUrl: string
  fit?: 'cover' | 'contain' | 'scale-down'
}

export interface Question {
  difficulty?: Difficulty
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
  difficulty: Difficulty | '混合'
  mode?: 'exam'
  image?: QuizImage
  color: string
  tag: string
  duration: number
  scope?: string
  questions: readonly Question[]
}
