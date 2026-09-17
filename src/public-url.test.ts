import { expect, it } from 'vitest'
import { publicUrl } from './public-url'

it('resolves local assets and attribution links beneath the deployment base', () => {
  expect(publicUrl('/favicon.svg', '/xham/')).toBe('/xham/favicon.svg')
  expect(publicUrl('/images/original/credits.html', '/xham/')).toBe('/xham/images/original/credits.html')
  expect(publicUrl('/images/a.webp', '/')).toBe('/images/a.webp')
  expect(publicUrl('https://example.com/source', '/xham/')).toBe('https://example.com/source')
})
