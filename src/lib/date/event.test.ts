import { describe, expect, it } from 'vitest'

import {
  addDays,
  daysUntil,
  describeDaysLeft,
  formatEventDate,
  formatEventTime,
  formatShortDate,
  describeEventTime,
  isOnOrBefore,
  todayInSaoPaulo,
} from './event'

describe('event dates', () => {
  it('formats the party day in Portuguese', () => {
    expect(formatEventDate('2026-11-21')).toBe('Sábado, 21 de novembro')
    expect(formatShortDate('2026-11-14')).toBe('14 de novembro')
  })

  it('formats times the Brazilian way', () => {
    expect(formatEventTime('15:00')).toBe('15h')
    expect(formatEventTime('19:30')).toBe('19h30')
    expect(describeEventTime('12:00')).toBe('Ao meio-dia (12h)')
    expect(describeEventTime('15:00')).toBe('Às 15h')
  })

  it('uses Brasília to decide what day it is', () => {
    // 01:00 UTC on the 21st is still the 20th in Brasília.
    expect(todayInSaoPaulo(new Date('2026-10-21T01:00:00Z'))).toBe('2026-10-20')
  })

  it('counts calendar days until the party', () => {
    expect(daysUntil('2026-11-21', new Date('2026-10-20T20:00:00Z'))).toBe(32)
    expect(daysUntil('2026-11-21', new Date('2026-11-21T02:00:00Z'))).toBe(1)
    expect(daysUntil('2026-11-21', new Date('2026-11-22T15:00:00Z'))).toBe(0)
    expect(describeDaysLeft(32)).toBe('Faltam 32 dias')
    expect(describeDaysLeft(1)).toBe('É amanhã!')
  })

  it('subtracts days across months', () => {
    expect(addDays('2026-11-21', -7)).toBe('2026-11-14')
    expect(addDays('2026-11-03', -7)).toBe('2026-10-27')
  })

  it('keeps the deadline open until the end of that day in Brasília', () => {
    expect(isOnOrBefore('2026-11-14', new Date('2026-11-15T02:30:00Z'))).toBe(true)
    expect(isOnOrBefore('2026-11-14', new Date('2026-11-15T03:30:00Z'))).toBe(false)
  })
})
