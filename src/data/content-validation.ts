import { difficulties, type Question } from '../types'

function httpsUrl(value: string | undefined): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && Boolean(url.hostname)
  } catch { return false }
}

export function questionIssues(question: Question): string[] {
  const issues: string[] = []
  for (const key of ['id', 'prompt', 'explanation'] as const) {
    if (!question[key].trim()) issues.push(key)
  }
  if (!question.difficulty || !difficulties.includes(question.difficulty)) issues.push('difficulty')
  const options = question.options.map((option) => option.trim())
  if (options.length !== 4 || options.some((option) => !option) || new Set(options).size !== 4) issues.push('options')
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= 4) issues.push('answer')
  const image = question.image
  if (!image || !/^\/images\/(anime|original)\/[\w-]+\.(webp|svg)$/.test(image.src) ||
      !image.alt?.trim() || !image.credit?.trim() ||
      !(image.sourceUrl === '/images/original/credits.html' || httpsUrl(image.sourceUrl))) issues.push('image')
  if (!question.source?.label?.trim() || !httpsUrl(question.source?.url)) issues.push('source')
  return issues
}
