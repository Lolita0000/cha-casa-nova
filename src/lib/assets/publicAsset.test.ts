import { describe, expect, it } from 'vitest'

import { publicAsset } from './publicAsset'

describe('publicAsset', () => {
  it('prefixes the base url and drops the leading slash', () => {
    expect(publicAsset('/gifts/towels.webp')).toBe(`${import.meta.env.BASE_URL}gifts/towels.webp`)
  })

  it('accepts paths without a leading slash', () => {
    expect(publicAsset('gifts/towels.webp')).toBe(`${import.meta.env.BASE_URL}gifts/towels.webp`)
  })
})
