import { describe, expect, it } from 'vitest'

import type { Rsvp } from '@/features/registry/types'

import { doormanList, doormanText, rsvpsToCsv, summarizeGuests } from './guestList'

function rsvp(
  id: string,
  guestNames: string[],
  attending = true,
  message: string | null = null,
): Rsvp {
  return { id, createdAt: '2026-10-20T20:00:00Z', guestNames, attending, message }
}

const rsvps = [
  rsvp('1', ['Rosa Lima', 'Beto Lima']),
  rsvp('2', ['rosa lima', 'Ângela Souza']),
  rsvp('3', ['Carla Dias'], false, 'Vou estar viajando'),
]

describe('doormanList', () => {
  it('lists people coming once each, sorted, ignoring case and accents', () => {
    expect(doormanList(rsvps)).toEqual(['Ângela Souza', 'Beto Lima', 'Rosa Lima'])
  })
})

describe('summarizeGuests', () => {
  it('counts people, not forms', () => {
    expect(summarizeGuests(rsvps)).toEqual({
      attendingCount: 3,
      notAttendingCount: 1,
      responseCount: 3,
    })
  })
})

describe('doormanText', () => {
  it('numbers the names, one per line', () => {
    expect(doormanText(rsvps)).toBe('1. Ângela Souza\n2. Beto Lima\n3. Rosa Lima')
  })
})

describe('rsvpsToCsv', () => {
  it('writes one line per answer', () => {
    const lines = rsvpsToCsv(rsvps).split('\n')
    expect(lines[0]).toBe('Data;Nomes;Vai?;Recado')
    expect(lines[3]).toContain(';Carla Dias;Não;Vou estar viajando')
  })
})
