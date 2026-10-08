export type RoomId = 'kitchen' | 'living-room' | 'bedroom' | 'bathroom' | 'laundry'

export interface Room {
  id: RoomId
  /** Label shown to guests (pt-BR). */
  name: string
}

interface BaseGift {
  id: string
  roomId: RoomId
  name: string
  description?: string
  imageUrl?: string
  /** Store page for guests who prefer to buy the item themselves. */
  productUrl?: string
}

/**
 * A gift guests pay for in full, via Pix or card. Since the money goes to
 * the couple, the same gift can be given more than once without duplicates.
 */
export interface SimpleGift extends BaseGift {
  kind: 'simple'
  /** Leave undefined while the price isn't known: guests then choose the amount. */
  priceInCents?: number
  /** Optional card payment link (Mercado Pago, InfinitePay, etc.) for this exact amount. */
  cardPaymentUrl?: string
}

/**
 * An expensive gift funded by several contributions, or bought outright by
 * a single guest who reserves it first.
 */
export interface PooledGift extends BaseGift {
  kind: 'pooled'
  goalInCents: number
  raisedInCents: number
  /** Contribution shortcuts shown to guests. */
  suggestedSharesInCents: number[]
  /** Name of the guest who chose to buy it outright, if any. */
  reservedBy?: string
}

export type Gift = SimpleGift | PooledGift
