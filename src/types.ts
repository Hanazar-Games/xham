export type AnimeSeriesId = 'chunibyo-season-1' | 'seraph-of-the-end' | 'classroom-of-the-elite' | 'madoka-magica' | 'tokyo-revengers' | 'princess-mononoke' | 'dororo' | 'jojo-stardust-crusaders' | 'samurai-champloo' | 'my-hero-academia-season-5' | 'durarara' | 'kaguya-sama-season-2' | 'bakemonogatari' | 'howls-moving-castle' | 'hyouka' | 'made-in-abyss' | 'attack-on-titan-final-season-part-2' | 'high-school-dxd' | 'fire-force' | 'clannad' | 'demon-slayer' | 'one-piece' | 'naruto' | 'ghibli' | 'rezero' | 'frieren' | 'crossover' | 'attack-on-titan' | 'death-note' | 'fullmetal-alchemist-brotherhood' | 'one-punch-man' | 'my-hero-academia' | 'sword-art-online' | 'hunter-x-hunter' | 'jujutsu-kaisen' | 'tokyo-ghoul' | 'your-name' | 'attack-on-titan-season-2' | 'steins-gate' | 'naruto-shippuden' | 'my-hero-academia-season-2' | 'attack-on-titan-season-3' | 'a-silent-voice' | 'attack-on-titan-season-3-part-2' | 'no-game-no-life' | 'code-geass' | 'rezero-season-1' | 'your-lie-in-april' | 'my-hero-academia-season-3' | 'toradora' | 'mob-psycho-100' | 'noragami' | 'attack-on-titan-final-season' | 'erased' | 'akame-ga-kill' | 'bleach' | 'assassination-classroom' | 'seven-deadly-sins' | 'angel-beats' | 'haikyuu' | 'promised-neverland' | 'konosuba' | 'future-diary' | 'sword-art-online-2' | 'cowboy-bebop' | 'blue-exorcist' | 'parasyte' | 'spirited-away' | 'evangelion' | 'violet-evergarden' | 'code-geass-r2' | 'bunny-girl-senpai' | 'dr-stone' | 'kaguya-sama' | 'chainsaw-man' | 'death-parade' | 'my-hero-academia-season-4' | 'tokyo-ghoul-root-a' | 'black-clover' | 'one-punch-man-season-2' | 'spy-family' | 'kill-la-kill' | 'fairy-tail' | 'jojo-2012' | 'darling-in-the-franxx' | 'vinland-saga' | 'another' | 'demon-slayer-mugen-train' | 'soul-eater' | 'gurren-lagann' | 'shield-hero' | 'charlotte' | 'overlord' | 'food-wars' | 'psycho-pass' | 'demon-slayer-entertainment-district' | 'mob-psycho-100-ii' | 'anohana' | 'devil-is-a-part-timer' | 'danmachi' | 'konosuba-season-2' | 'slime-season-1' | 'kakegurui' | 'elfen-lied' | 'horimiya' | 'highschool-of-the-dead' | 'fate-zero' | 'assassination-classroom-season-2' | 'haikyuu-season-2' | 'oregairu-season-1' | 'fullmetal-alchemist-2003' | 'noragami-aragoto' | 'mushoku-tensei' | 'bungo-stray-dogs' | 'inuyasha' | 'sailor-moon' | 'yu-yu-hakusho' | 'katekyo-hitman-reborn' | 'gintama2' | 'drifters' | 'golden-kamuy' | 'land-of-the-lustrous' | 'princess-principal' | 'promare' | 'odd-taxi' | 'sonny-boy' | 'wonder-egg-priority' | 'sk8-infinity' | 'link-click' | 'ranking-of-kings' | 'vivy' | 'lycoris-recoil' | 'bocchi-the-rock' | 'heavenly-delusion' | 'frieren2' | 'blue-lock' | 'kaiju-no-8' | 'wind-breaker' | 'solo-leveling2' | 'delicious-in-dungeon' | 'apothecary-diaries' | 'metallic-rouge' | 'undead-unluck' | 'fire-force2' | 'mashle' | 'eminence-shadow' | 'shadow-house' | 'call-of-night' | 'moriarty-patriot' | 'great-pretender' | 'beastars' | 'cyberpunk2' | 'pluto' | 'summer-time-render'
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
