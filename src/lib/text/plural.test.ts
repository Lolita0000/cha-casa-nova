import { describe, expect, it } from 'vitest'

import { byCount } from './plural'

describe('byCount', () => {
  it('uses the singular for zero or one person', () => {
    expect(byCount(0, 'vou', 'vamos')).toBe('vou')
    expect(byCount(1, 'vou', 'vamos')).toBe('vou')
  })

  it('uses the plural for two or more', () => {
    expect(byCount(2, 'vou', 'vamos')).toBe('vamos')
    expect(byCount(7, 'vou', 'vamos')).toBe('vamos')
  })
})
