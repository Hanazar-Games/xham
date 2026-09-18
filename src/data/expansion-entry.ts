import type { Question } from '../types'
import type { OriginalScene } from './original-art'

export type ExpansionEntry = [source: number | 'terms' | 'characters', scene: OriginalScene, prompt: string, choices: Question['options'], explanation: string]
