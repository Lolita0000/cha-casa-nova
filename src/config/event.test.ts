import { describe, expect, it } from 'vitest'

import { isRsvpOpen } from './event'

describe('isRsvpOpen', () => {
  const closesAt = new Date('2026-11-20T12:00:00-03:00')

  it('stays open until Friday at noon in Brasília', () => {
    expect(isRsvpOpen(new Date('2026-11-20T11:59:00-03:00'), closesAt)).toBe(true)
  })

  it('closes at noon', () => {
    expect(isRsvpOpen(new Date('2026-11-20T12:00:00-03:00'), closesAt)).toBe(false)
    expect(isRsvpOpen(new Date('2026-11-21T09:00:00-03:00'), closesAt)).toBe(false)
  })

  it('is always open without a closing time', () => {
    expect(isRsvpOpen(new Date('2030-01-01T00:00:00Z'), null)).toBe(true)
  })
})
