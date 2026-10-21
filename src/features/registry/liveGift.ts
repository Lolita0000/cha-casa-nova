import type { Gift } from '@/types/gift'

import type { GiftPublicStatus } from './types'

export type LiveGift<T extends Gift = Gift> = T & {
  /** A guest already said they will buy this one. */
  purchasedByGuest: boolean
}

/** Adds what guests registered to the values written in the gift list. */
export function applyPublicStatus<T extends Gift>(gift: T, status: GiftPublicStatus): LiveGift<T> {
  const purchasedByGuest = status.purchaseCount > 0
  const raised =
    gift.kind === 'pooled' ? { raisedInCents: gift.raisedInCents + status.contributedInCents } : {}
  return { ...gift, ...raised, purchasedByGuest } as LiveGift<T>
}
