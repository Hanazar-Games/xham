import type { Quiz } from '../types'
import { animeQuizzes } from './anime'
import { animePacks } from './anime-packs'

export const quizzes: Quiz[] = [...animeQuizzes, ...animePacks]
