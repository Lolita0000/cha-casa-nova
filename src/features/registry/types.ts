export type GiftMethod = 'pix' | 'card' | 'purchase'

export type GiftRecordStatus = 'pending' | 'confirmed' | 'cancelled'

export interface GiftRecordItemInput {
  giftId: string
  giftName: string
  amountInCents: number
}

export interface GiftRegistration {
  giverNames: string[]
  method: GiftMethod
  items: GiftRecordItemInput[]
  message?: string
  /** Pix receipt uploaded to storage, see `uploadReceipt`. */
  receiptPath?: string
  /** Receipt page from the card checkout. */
  receiptUrl?: string
}

export interface GiftRecordItem extends GiftRecordItemInput {
  id: number
}

export interface GiftRecord {
  id: string
  createdAt: string
  giverNames: string[]
  message: string | null
  method: GiftMethod
  totalInCents: number
  status: GiftRecordStatus
  items: GiftRecordItem[]
  receiptPath: string | null
  receiptUrl: string | null
}

/** What every guest can see about a gift: totals, never names. */
export interface GiftPublicStatus {
  /** Pix and card together. */
  contributedInCents: number
  purchaseCount: number
}

export interface RsvpRegistration {
  guestNames: string[]
  attending: boolean
  message?: string
}

export interface Rsvp {
  id: string
  createdAt: string
  guestNames: string[]
  attending: boolean
  message: string | null
}
