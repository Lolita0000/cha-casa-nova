import type { Gift } from '@/types/gift'

/** One gift in the cart. A gift appears at most once. */
export interface CartLine {
  giftId: string
  amountInCents: number
}

export type CartAction =
  { type: 'add'; line: CartLine } | { type: 'remove'; giftId: string } | { type: 'clear' }

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      if (action.line.amountInCents <= 0) return lines
      const others = lines.filter((line) => line.giftId !== action.line.giftId)
      return [...others, action.line]
    }
    case 'remove':
      return lines.filter((line) => line.giftId !== action.giftId)
    case 'clear':
      return []
  }
}

export interface CartItem {
  gift: Gift
  amountInCents: number
}

/** Matches lines to gifts, dropping lines whose gift no longer exists. */
export function resolveCartItems(lines: CartLine[], gifts: Gift[]): CartItem[] {
  const giftsById = new Map(gifts.map((gift) => [gift.id, gift]))
  return lines.flatMap((line) => {
    const gift = giftsById.get(line.giftId)
    return gift ? [{ gift, amountInCents: line.amountInCents }] : []
  })
}

export function cartTotal(items: { amountInCents: number }[]): number {
  return items.reduce((sum, item) => sum + item.amountInCents, 0)
}

/** Default amount when a gift is added straight from its card. */
export function defaultAmountFor(gift: Gift): number {
  if (gift.kind === 'simple') return gift.priceInCents ?? 0
  return Math.max(gift.goalInCents - gift.raisedInCents, 0)
}
