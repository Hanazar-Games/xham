import type { Quiz } from '../types'
import { animeQuizzes } from './anime'
import { animePacks } from './anime-packs'
import { animeCasebooks } from './anime-casebooks'
import { animeCrossover } from './anime-crossover'
import { expansionQuizzes } from './expansion-packs'

export const quizzes: Quiz[] = [...animeQuizzes, ...animePacks, ...animeCasebooks, ...animeCrossover, ...expansionQuizzes]
