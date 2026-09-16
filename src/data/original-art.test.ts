import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { originalArt, originalScenes } from './original-art'

describe('original illustrations', () => {
  it.each(Object.keys(originalScenes) as (keyof typeof originalScenes)[])(
    '%s is a local, self-contained SVG with honest attribution', (scene) => {
      const image = originalArt(scene)
      const svg = readFileSync(new URL(`../../public${image.src}`, import.meta.url), 'utf8')
      expect(svg).toContain('viewBox="0 0 800 450"')
      expect(svg).not.toMatch(/<script|<image|<foreignObject|href=|onload=|https?:\/\/(?!www\.w3\.org)/i)
      expect(image.credit).toContain('非官方素材')
      expect(image.alt).toContain('并非作品场景')
      expect(readFileSync(new URL(`../../public${image.sourceUrl}`, import.meta.url), 'utf8')).toContain('原创')
    },
  )
})
