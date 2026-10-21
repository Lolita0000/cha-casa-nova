import { describe, expect, it } from 'vitest'

import type { GiftRecord, Rsvp } from '@/features/registry/types'

import { collectLetters, countNewLetters } from './letters'

const records: GiftRecord[] = [
  {
    id: 'g1',
    createdAt: '2026-10-20T10:00:00Z',
    giverNames: ['Tia Rosa'],
    message: 'Que a casa seja cheia de amor',
    method: 'pix',
    totalInCents: 100,
    status: 'pending',
    receiptPath: null,
    receiptUrl: null,
    items: [
      { id: 1, giftId: 'a', giftName: 'Toalhas', amountInCents: 50 },
      { id: 2, giftId: 'b', giftName: 'Jarra', amountInCents: 50 },
    ],
  },
  {
    id: 'g2',
    createdAt: '2026-10-20T12:00:00Z',
    giverNames: ['João'],
    message: 'cancelado',
    method: 'pix',
    totalInCents: 100,
    status: 'cancelled',
    items: [],
    receiptPath: null,
    receiptUrl: null,
  },
  {
    id: 'g3',
    createdAt: '2026-10-20T13:00:00Z',
    giverNames: ['Sem recado'],
    message: null,
    method: 'pix',
    totalInCents: 100,
    status: 'pending',
    items: [],
    receiptPath: null,
    receiptUrl: null,
  },
]

const rsvps: Rsvp[] = [
  {
    id: 'r1',
    createdAt: '2026-10-20T11:00:00Z',
    guestNames: ['Carla'],
    attending: false,
    message: 'Vou sentir falta',
  },
]

describe('collectLetters', () => {
  it('joins gift letters and rsvp messages, newest first, skipping cancelled gifts', () => {
    const letters = collectLetters(records, rsvps)
    expect(letters.map((letter) => letter.id)).toEqual(['rsvp-r1', 'gift-g1'])
    expect(letters[1].context).toBe('Toalhas, Jarra')
    expect(letters[0].context).toBe('Avisou que não vai')
  })
})

describe('countNewLetters', () => {
  it('counts letters written after the last visit', () => {
    const letters = collectLetters(records, rsvps)
    expect(countNewLetters(letters, null)).toBe(2)
    expect(countNewLetters(letters, '2026-10-20T10:30:00Z')).toBe(1)
  })
})
