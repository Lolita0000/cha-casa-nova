import { describe, expect, it } from 'vitest'

import type { GiftRecord } from '@/features/registry/types'

import { filterRecords, recordsToCsv, summarize, summarizeByGift } from './adminStats'

function record(overrides: Partial<GiftRecord>): GiftRecord {
  return {
    id: 'r',
    createdAt: '2026-10-20T19:00:00Z',
    giverNames: ['Ana'],
    message: null,
    method: 'pix',
    totalInCents: 0,
    status: 'pending',
    items: [],
    ...overrides,
  }
}

const records: GiftRecord[] = [
  record({
    id: '1',
    giverNames: ['Tia Rosa', 'Tio Beto'],
    totalInCents: 35670,
    status: 'confirmed',
    message: 'Felicidades!',
    items: [
      { id: 1, giftId: 'towels', giftName: 'Toalhas', amountInCents: 25670 },
      { id: 2, giftId: 'dishwasher', giftName: 'Lava-louças', amountInCents: 10000 },
    ],
  }),
  record({
    id: '2',
    giverNames: ['Família Souza'],
    method: 'purchase',
    totalInCents: 354900,
    items: [{ id: 3, giftId: 'dishwasher', giftName: 'Lava-louças', amountInCents: 354900 }],
  }),
  record({
    id: '3',
    giverNames: ['João'],
    totalInCents: 5000,
    status: 'cancelled',
    items: [{ id: 4, giftId: 'towels', giftName: 'Toalhas', amountInCents: 5000 }],
  }),
  record({
    id: '4',
    giverNames: ['Márcia'],
    totalInCents: 2000,
    items: [{ id: 5, giftId: 'pixzinho', giftName: 'Pixzinho pra casa', amountInCents: 2000 }],
  }),
]

describe('summarize', () => {
  it('totals pix, purchases and pending records, ignoring cancelled ones', () => {
    expect(summarize(records)).toEqual({
      pixDeclaredInCents: 37670,
      pixConfirmedInCents: 35670,
      purchaseCount: 1,
      recordCount: 3,
      pendingCount: 2,
    })
  })
})

describe('summarizeByGift', () => {
  it('groups givers by gift', () => {
    const dishwasher = summarizeByGift(records).find((gift) => gift.giftId === 'dishwasher')
    expect(dishwasher).toEqual({
      giftId: 'dishwasher',
      giftName: 'Lava-louças',
      pixInCents: 10000,
      pixGivers: ['Tia Rosa e Tio Beto'],
      purchasers: ['Família Souza'],
    })
  })

  it('leaves cancelled records out', () => {
    const towels = summarizeByGift(records).find((gift) => gift.giftId === 'towels')
    expect(towels?.pixInCents).toBe(25670)
  })
})

describe('filterRecords', () => {
  it('filters by status and method', () => {
    expect(filterRecords(records, { status: 'pending', method: 'pix', query: '' })).toHaveLength(1)
  })

  it('finds names and gifts ignoring accents and case', () => {
    expect(
      filterRecords(records, { status: 'all', method: 'all', query: 'marcia' }).map((r) => r.id),
    ).toEqual(['4'])
    expect(
      filterRecords(records, { status: 'all', method: 'all', query: 'LAVA' }).map((r) => r.id),
    ).toEqual(['1', '2'])
  })
})

describe('recordsToCsv', () => {
  it('writes one line per record with pt-BR values', () => {
    const lines = recordsToCsv(records.slice(0, 1)).split('\n')
    expect(lines[0]).toBe('Data;Quem deu;Forma;Situação;Presentes;Valor (R$);Recado')
    expect(lines[1]).toContain(
      ';Tia Rosa e Tio Beto;Pix;Confirmado;Toalhas + Lava-louças;356,70;Felicidades!',
    )
  })
})
