import { describe, expect, it } from 'vitest'
import { quizzes } from './quizzes'
import { createGame, gameReducer, summarize } from '../game/engine'
import { images as imageSources } from '../../public/images/anime/sources.json'
import { readFileSync, readdirSync } from 'node:fs'
import { animeSeries } from './anime-series'
import { animeCasebooks } from './anime-casebooks'
import { originalScenes } from './original-art'

describe('built-in question bank', () => {
  it('contains only illustrated anime packs', () => {
    expect(quizzes).toHaveLength(57)
    for (const quiz of quizzes) {
      expect(quiz.category).toBe('二次元')
      expect(quiz.series).toBeTruthy()
      expect(quiz.image).toBeTruthy()
      expect(quiz.questions.every((question) => question.image && question.source)).toBe(true)
    }
  })
  it('offers six distinct crossover exams with 72 original illustrated questions', () => {
    const exams = quizzes.filter((quiz) => quiz.series === 'crossover')
    expect(exams).toHaveLength(6)
    expect(exams.map((quiz) => quiz.difficulty).sort()).toEqual(['中等', '困难', '简单', '简单', '简单', '简单'])
    for (const exam of exams) {
      const works = exam.questions.map((question) => question.prompt.match(/^【(.+)】/)?.[1])
      expect(new Set(works).size).toBe(6)
      for (const work of new Set(works)) expect(works.filter((item) => item === work)).toHaveLength(2)
      expect([0, 1, 2, 3].map((answer) => exam.questions.filter((question) => question.answer === answer).length)).toEqual([3, 3, 3, 3])
    }
    const questions = exams.flatMap((quiz) => quiz.questions)
    expect(questions).toHaveLength(72)
    expect(new Set(questions.map((question) => question.prompt)).size).toBe(72)
    for (const question of questions) {
      expect(question.image?.src).toMatch(/^\/images\/original\//)
      expect(question.prompt).toMatch(/^【.+】/)
      expect(question.source?.url).toMatch(/^https:\/\//)
    }
  })
  it.each(animeSeries.map((series) => series.id))(
    '%s has three difficulty illustrated packs', (series) => {
      const packs = quizzes.filter((quiz) => 'series' in quiz && quiz.series === series)
      expect(packs.length).toBeGreaterThanOrEqual(2)
      expect(new Set(packs.map((quiz) => quiz.difficulty))).toEqual(new Set(['简单', '中等', '困难']))
      const prompts = packs.flatMap((quiz) => quiz.questions.map((question) => question.prompt))
      expect(new Set(prompts).size).toBe(prompts.length)
      for (const pack of packs) {
        expect(pack.questions).toHaveLength(12)
        expect(pack.duration).toBe(pack.difficulty === '简单' ? 20 : pack.difficulty === '中等' ? 25 : 30)
        expect(pack.scope).toBeTruthy()
        for (const question of pack.questions) {
          expect(question.image?.src).toMatch(/^\/images\/(anime|original)\//)
          expect(question.source?.url).toMatch(/^https:\/\//)
        }
      }
    },
  )

  it('has a registered series for every anime quiz and balanced answer positions in new packs', () => {
    const series = new Set(animeSeries.map((series) => series.id))
    for (const quiz of quizzes.filter((quiz) => quiz.category === '二次元')) {
      expect(series.has(quiz.series!)).toBe(true)
      if (quiz.id === quiz.series) continue
      expect([0, 1, 2, 3].map((answer) => quiz.questions.filter((question) => question.answer === answer).length)).toEqual([3, 3, 3, 3])
    }
  })

  it('ships every referenced image as a WebP with matching manifest size and no unused files', () => {
    const directory = new URL('../../public/images/anime/', import.meta.url)
    const referenced = new Set(quizzes.flatMap((quiz) =>
      [quiz.image, ...quiz.questions.map((question) => question.image)]
        .flatMap((image) => image?.src.startsWith('/images/anime/') ? [image.src.split('/').at(-1)!] : []),
    ))
    expect(new Set(imageSources.map((image) => image.file))).toEqual(referenced)
    expect(new Set(readdirSync(directory).filter((file) => file !== 'sources.json'))).toEqual(referenced)
    for (const image of imageSources) {
      const bytes = readFileSync(new URL(image.file, directory))
      expect(bytes.subarray(0, 4).toString()).toBe('RIFF')
      expect(bytes.subarray(8, 12).toString()).toBe('WEBP')
      expect(bytes.length).toBe(image.bytes)
    }
  })

  it.each(['ghibli', 'rezero', 'frieren', 'demon-slayer', 'one-piece', 'naruto'])(
    '%s has 12 sourced, illustrated questions and a local cover',
    (id) => {
      const quiz = quizzes.find((item) => item.id === id)
      expect(quiz).toBeDefined()
      expect(quiz!.questions).toHaveLength(12)
      expect(quiz!.image?.src).toMatch(/^\/images\/anime\//)
      for (const question of quiz!.questions) {
        expect(question.image?.src).toMatch(/^\/images\/anime\//)
        expect(question.source?.url).toMatch(/^https:\/\//)
        expect(question.source?.label.trim()).toBeTruthy()
      }
    },
  )

  it('records source attribution for every referenced image', () => {
    const images = quizzes.flatMap((quiz) => [quiz.image, ...quiz.questions.map((q) => q.image)])
    for (const image of images.filter((image) => image !== undefined)) {
      const original = image.src.startsWith('/images/original/')
      expect(original
        ? Object.keys(originalScenes).some((scene) => image.src === `/images/original/${scene}.svg`)
        : imageSources.some((source) => `/images/anime/${source.file}` === image.src)).toBe(true)
      expect(image.credit.trim()).toBeTruthy()
      expect(image.alt.trim()).toBeTruthy()
      if (original) expect(image.sourceUrl).toBe('/images/original/credits.html')
      else expect(image.sourceUrl).toMatch(/^https:\/\//)
    }
  })
  it('adds 72 sourced casebook questions with original illustrations only', () => {
    expect(animeCasebooks).toHaveLength(6)
    expect(animeCasebooks.flatMap((quiz) => quiz.questions)).toHaveLength(72)
    for (const quiz of animeCasebooks) {
      expect(quiz.image?.src).toMatch(/^\/images\/original\//)
      for (const question of quiz.questions) {
        expect(question.image?.src).toMatch(/^\/images\/original\//)
        expect(question.source?.url).toMatch(/^https:\/\//)
      }
    }
  })
  it.each(quizzes)('$title completes with correct scoring and clean replay', (quiz) => {
    let now = 0
    let game = createGame({ quiz, now })
    for (const question of quiz.questions) {
      now += quiz.duration * 500
      game = gameReducer(game, {
        type: 'answer',
        questionId: question.id,
        option: question.answer,
        now,
      })
      expect(game.phase).toBe('reveal')
      game = gameReducer(game, { type: 'next', questionId: question.id, now })
    }
    expect(game.phase).toBe('finished')
    expect(summarize(game)).toEqual({
      score: quiz.questions.length * 750,
      correct: quiz.questions.length,
      accuracy: 100,
      bestStreak: quiz.questions.length,
    })
    expect(summarize(createGame({ quiz, now })).score).toBe(0)
  })

  it('has unique quiz and question identifiers', () => {
    expect(new Set(quizzes.map((quiz) => quiz.id)).size).toBe(quizzes.length)
    const ids = quizzes.flatMap((quiz) => quiz.questions.map((question) => question.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(quizzes)('$title has playable questions and explanations', (quiz) => {
    expect(quiz.questions.length).toBeGreaterThan(0)
    expect(quiz.duration).toBeGreaterThan(0)
    for (const question of quiz.questions) {
      expect(question.options).toHaveLength(4)
      expect(new Set(question.options).size).toBe(4)
      expect(Number.isInteger(question.answer)).toBe(true)
      expect(question.options[question.answer]).toBeTruthy()
      expect(question.prompt.trim()).not.toBe('')
      expect(question.explanation.trim()).not.toBe('')
    }
  })
})
