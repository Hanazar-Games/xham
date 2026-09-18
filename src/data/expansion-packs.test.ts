import { describe, expect, it } from 'vitest'
import { expansionBanks, expansionQuizzes, expansionAdditions } from './expansion-packs'
import { questionIssues } from './content-validation'

describe('catalog additions', () => {
  it('adds 200 distinct illustrated sourced questions with explicit anime scopes', () => {
    const sources: Record<string, RegExp> = {
      'attack-on-titan': /^https:\/\/shingeki.tv\/season1\//,
      'death-note': /^https:\/\/www.ntv.co.jp\/deathnote\/static\/story2?\.html$/,
      'fullmetal-alchemist-brotherhood': /^https:\/\/www.hagaren.jp\/fa\/(about\/story(?:0[1-6])?\.html|characters\/index01\.html)$/,
      'one-punch-man': /^https:\/\/onepunchman-anime.net\/(story\/#\/season1\/(?:[1-9]|1[0-2])|character\/)$/,
    }
    expect(expansionBanks.map((bank) => bank.series)).toEqual(Object.keys(sources))
    for (const bank of expansionBanks) {
      expect(bank.questions).toHaveLength(50)
      expect(new Set(bank.questions.map((q) => q.prompt)).size).toBe(50)
      expect(['简单', '中等', '困难'].map((level) => bank.questions.filter((q) => q.difficulty === level).length)).toEqual([18, 17, 15])
      for (const question of bank.questions) {
        expect(questionIssues(question), question.id).toEqual([])
        expect(question.image!.src).toMatch(/^\/images\/original\//)
        expect(question.source!.url).toMatch(sources[bank.series])
      }
      const practice = expansionQuizzes.filter((quiz) => quiz.series === bank.series)
      expect(practice).toHaveLength(3)
      expect(practice.every((quiz) => quiz.questions.length === 12 && quiz.scope?.includes('剧透'))).toBe(true)
      const published = [...practice.flatMap((quiz) => quiz.questions), ...expansionAdditions[bank.series]!]
      expect(published).toHaveLength(50)
      expect(new Set(published.map((q) => q.id))).toEqual(new Set(bank.questions.map((q) => q.id)))
    }
  })

  it('uses first-season exam results and keeps later One Punch Man seasons out of scope', () => {
    const bank = expansionBanks.find((bank) => bank.series === 'one-punch-man')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('第 1–12 集')
    expect(bank!.scope).toContain('不考第二季')
    for (const [number, answer] of [
      ['10', 'C 级'], ['11', 'S 级'],
      ['21', '每周至少提交一次英雄活动报告'],
      ['31', '为保护孩子，挡下深海王的溶解液'],
      ['32', '未来半年以内'],
    ]) {
      const question = bank!.questions.find((q) => q.id === `one-punch-man-${number}`)!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source?.url).toContain('/story/#/season1/')
    }
    expect(new Set(bank!.questions.filter((q) => q.source?.url.includes('/story/')).map((q) => q.source!.url.split('/').at(-1)))).toEqual(new Set(Array.from({ length: 12 }, (_, i) => String(i + 1))))
  })

  it('keeps Brotherhood mechanics and version boundaries explicit', () => {
    const bank = expansionBanks.find((bank) => bank.series === 'fullmetal-alchemist-brotherhood')
    expect(bank).toBeDefined()
    expect(bank!.scope).toContain('2009–2010')
    expect(bank!.scope).toContain('不混用 2003 年动画')
    for (const [number, answer] of [
      [19, '人体炼成失去左腿，固定弟弟灵魂又失去右臂'],
      [20, '手套起火花，配合对目标周围氧气的控制'],
      [21, '改变身体中碳的结构，使表层达到极高硬度'],
      [28, '两人的意识共存，通常由格利德主导身体'],
    ] as const) {
      const question = bank!.questions.find((q) => q.id.endsWith(`-${number}`))!
      expect(question.options[question.answer]).toBe(answer)
      expect(question.source?.url).toBe('https://www.hagaren.jp/fa/characters/index01.html')
    }
    for (const [episode, page] of [[8, 'story.html'], [20, 'story01.html'], [31, 'story03.html'], [59, 'story05.html'], [62, 'story06.html']] as const) {
      expect(bank!.questions.some((q) => q.source?.label === `FA 官网第 ${episode} 集剧情简介` && q.source.url.endsWith(`/${page}`))).toBe(true)
    }
  })
})
