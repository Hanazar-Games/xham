export type AnimeSeriesId = 'demon-slayer' | 'one-piece' | 'naruto' | 'ghibli' | 'rezero' | 'frieren' | 'crossover' | 'attack-on-titan' | 'death-note' | 'fullmetal-alchemist-brotherhood' | 'one-punch-man' | 'my-hero-academia' | 'sword-art-online' | 'hunter-x-hunter' | 'jujutsu-kaisen' | 'tokyo-ghoul' | 'your-name' | 'attack-on-titan-season-2' | 'steins-gate' | 'naruto-shippuden' | 'my-hero-academia-season-2' | 'attack-on-titan-season-3' | 'a-silent-voice' | 'attack-on-titan-season-3-part-2' | 'no-game-no-life' | 'code-geass' | 'rezero-season-1' | 'your-lie-in-april' | 'my-hero-academia-season-3' | 'toradora' | 'mob-psycho-100' | 'noragami' | 'attack-on-titan-final-season' | 'erased' | 'akame-ga-kill' | 'bleach' | 'assassination-classroom' | 'seven-deadly-sins' | 'angel-beats' | 'haikyuu' | 'promised-neverland' | 'konosuba' | 'future-diary' | 'sword-art-online-2' | 'cowboy-bebop' | 'blue-exorcist' | 'parasyte' | 'spirited-away' | 'evangelion'
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
