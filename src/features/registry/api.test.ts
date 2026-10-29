import { describe, expect, it } from 'vitest'

import { toFriendlyError } from './api'

describe('toFriendlyError', () => {
  it('explains network failures in plain words', () => {
    expect(toFriendlyError('TypeError: Failed to fetch').message).toMatch(/tenta de novo/)
    expect(toFriendlyError('Load failed').message).toMatch(/tenta de novo/)
  })

  it('keeps messages that already make sense', () => {
    expect(toFriendlyError('Informe se vai ou não.').message).toBe('Informe se vai ou não.')
  })
})
