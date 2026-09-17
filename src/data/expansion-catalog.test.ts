import { describe, expect, it } from 'vitest'
import catalog from '../../docs/quiz-expansion/catalog.json'
import { questionBanks } from './question-banks'

describe('user supplied expansion catalog', () => {
  it('preserves 200 ordered titles in ten batches of twenty', () => {
    expect(catalog.entries).toHaveLength(200)
    expect(catalog.entries.map((entry) => entry.number)).toEqual(Array.from({ length: 200 }, (_, i) => i + 1))
    expect(new Set(catalog.entries.map((entry) => entry.id)).size).toBe(200)
    expect(new Set(catalog.entries.map((entry) => entry.title)).size).toBe(200)
    for (let batch = 1; batch <= 10; batch++) {
      const entries = catalog.entries.filter((entry) => entry.batch === batch)
      expect(entries).toHaveLength(20)
      expect(entries[0].number).toBe((batch - 1) * 20 + 1)
      expect(entries.at(-1)?.number).toBe(batch * 20)
    }
    expect(catalog.entries.length * catalog.questionsPerTitle).toBe(10_000)
    expect(Object.values(catalog.difficultyTargets).reduce((total, count) => total + count, 0)).toBe(50)
  })

  it('keeps sequels and alternate adaptations distinct', () => {
    for (const pair of [[1, 13], [9, 15], [3, 87], [23, 128], [45, 177]]) {
      const [first, second] = pair.map((number) => catalog.entries[number - 1])
      expect(first.id).not.toBe(second.id)
      expect(first.title).not.toBe(second.title)
    }
  })

  it('counts existing banks once and never labels empty planned titles as playable', () => {
    const mappings = Object.entries(catalog.existingBanks)
    expect(new Set(mappings.map(([, series]) => series)).size).toBe(mappings.length)
    for (const [entryId, series] of mappings) {
      expect(catalog.entries.some((entry) => entry.id === entryId)).toBe(true)
      const bank = questionBanks.find((item) => item.series === series)
      expect(bank).toBeDefined()
      expect(bank!.questions).toHaveLength(catalog.questionsPerTitle)
      for (const [level, count] of Object.entries(catalog.difficultyTargets)) {
        expect(bank!.questions.filter((q) => q.difficulty === level)).toHaveLength(count)
      }
    }
    const firstBatch = catalog.entries.filter((entry) => entry.batch === 1)
    expect(firstBatch.filter((entry) => entry.id in catalog.existingBanks)).toHaveLength(3)
  })
})
