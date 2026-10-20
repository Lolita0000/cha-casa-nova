import { describe, expect, it } from 'vitest'

import type { PooledGift, SimpleGift } from '@/types/gift'

import { applyPublicStatus } from './liveGift'

const fridge: PooledGift = {
  id: 'fridge',
  kind: 'pooled',
  roomId: 'kitchen',
  name: 'Geladeira',
  goalInCents: 300000,
  raisedInCents: 20000,
  suggestedSharesInCents: [5000],
}

const towels: SimpleGift = {
  id: 'towels',
  kind: 'simple',
  roomId: 'bathroom',
  name: 'Toalhas',
  priceInCents: 25670,
}

describe('applyPublicStatus', () => {
  it('adds registered pix to what was already raised', () => {
    const live = applyPublicStatus(fridge, { pixInCents: 15000, purchaseCount: 0 })
    expect(live.raisedInCents).toBe(35000)
    expect(live.purchasedByGuest).toBe(false)
  })

  it('marks gifts a guest will buy', () => {
    expect(applyPublicStatus(towels, { pixInCents: 0, purchaseCount: 1 }).purchasedByGuest).toBe(
      true,
    )
  })
})
