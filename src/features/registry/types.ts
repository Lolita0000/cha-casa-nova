export type GiftMethod = 'pix' | 'purchase'

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
}

/** What every guest can see about a gift: totals, never names. */
export interface GiftPublicStatus {
  pixInCents: number
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
