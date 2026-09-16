import { describe, expect, it } from 'vitest'
import { quizzes } from './quizzes'
import { createGame, gameReducer, summarize } from '../game/engine'
import { images as imageSources } from '../../public/images/anime/sources.json'
import { readFileSync, readdirSync } from 'node:fs'

describe('built-in question bank', () => {
  it.each(['ghibli', 'rezero', 'frieren', 'demon-slayer', 'one-piece', 'naruto'])(
    '%s has separate easy and hard illustrated packs', (series) => {
      const packs = quizzes.filter((quiz) => 'series' in quiz && quiz.series === series)
      expect(packs.length).toBeGreaterThanOrEqual(2)
      expect(new Set(packs.map((quiz) => quiz.difficulty))).toEqual(new Set(['简单', '困难']))
      const prompts = packs.flatMap((quiz) => quiz.questions.map((question) => question.prompt))
      expect(new Set(prompts).size).toBe(prompts.length)
      for (const pack of packs) {
        expect(pack.questions).toHaveLength(12)
        expect(pack.duration).toBe(pack.difficulty === '简单' ? 20 : 30)
        expect(pack.scope).toBeTruthy()
        for (const question of pack.questions) {
          expect(question.image?.src).toMatch(/^\/images\/anime\//)
          expect(question.source?.url).toMatch(/^https:\/\//)
        }
      }
    },
  )

  it('has a registered series for every anime quiz and balanced answer positions in new packs', () => {
    const series = new Set(['ghibli', 'rezero', 'frieren', 'demon-slayer', 'one-piece', 'naruto'])
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
        .flatMap((image) => image ? [image.src.split('/').at(-1)!] : []),
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
      expect(imageSources.some((source) => `/images/anime/${source.file}` === image.src)).toBe(true)
      expect(image.credit.trim()).toBeTruthy()
      expect(image.alt.trim()).toBeTruthy()
      expect(image.sourceUrl).toMatch(/^https:\/\//)
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
