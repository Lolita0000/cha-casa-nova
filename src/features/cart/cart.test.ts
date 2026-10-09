import { describe, expect, it } from 'vitest'

import type { Gift } from '@/types/gift'

import { cartReducer, cartTotal, defaultAmountFor, resolveCartItems, type CartLine } from './cart'

const towels: Gift = {
  id: 'towels',
  kind: 'simple',
  roomId: 'bathroom',
  name: 'Toalhas',
  priceInCents: 25670,
}

const fridge: Gift = {
  id: 'fridge',
  kind: 'pooled',
  roomId: 'kitchen',
  name: 'Geladeira',
  goalInCents: 300000,
  raisedInCents: 100000,
  suggestedSharesInCents: [5000],
}

describe('cartReducer', () => {
  it('adds a line', () => {
    expect(
      cartReducer([], { type: 'add', line: { giftId: 'towels', amountInCents: 100 } }),
    ).toEqual([{ giftId: 'towels', amountInCents: 100 }])
  })

  it('replaces the amount when the same gift is added again', () => {
    const lines: CartLine[] = [{ giftId: 'fridge', amountInCents: 5000 }]
    expect(
      cartReducer(lines, { type: 'add', line: { giftId: 'fridge', amountInCents: 10000 } }),
    ).toEqual([{ giftId: 'fridge', amountInCents: 10000 }])
  })

  it('ignores lines without an amount', () => {
    expect(cartReducer([], { type: 'add', line: { giftId: 'x', amountInCents: 0 } })).toEqual([])
  })

  it('removes a line and clears the cart', () => {
    const lines: CartLine[] = [
      { giftId: 'a', amountInCents: 1 },
      { giftId: 'b', amountInCents: 2 },
    ]
    expect(cartReducer(lines, { type: 'remove', giftId: 'a' })).toEqual([
      { giftId: 'b', amountInCents: 2 },
    ])
    expect(cartReducer(lines, { type: 'clear' })).toEqual([])
  })
})

describe('resolveCartItems', () => {
  it('drops lines for gifts that no longer exist', () => {
    const items = resolveCartItems(
      [
        { giftId: 'towels', amountInCents: 25670 },
        { giftId: 'gone', amountInCents: 100 },
      ],
      [towels],
    )
    expect(items).toEqual([{ gift: towels, amountInCents: 25670 }])
  })
})

describe('cartTotal', () => {
  it('sums every amount', () => {
    expect(cartTotal([{ amountInCents: 100 }, { amountInCents: 250 }])).toBe(350)
  })
})

describe('defaultAmountFor', () => {
  it('uses the price for simple gifts and what is missing for pooled ones', () => {
    expect(defaultAmountFor(towels)).toBe(25670)
    expect(defaultAmountFor(fridge)).toBe(200000)
  })
})
