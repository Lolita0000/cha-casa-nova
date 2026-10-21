import type { GiftRecordItemInput } from '@/features/registry/types'

/**
 * A card payment the guest started. The guest leaves the site to pay, so what
 * they were paying for is kept here until InfinitePay sends them back.
 */
export interface PendingCardPayment {
  orderNsu: string
  items: GiftRecordItemInput[]
  /** Paid from the cart, which is emptied once the gift is registered. */
  fromCart: boolean
  createdAt: string
}

const STORAGE_KEY = 'cha-casa-nova:pending-card:v1'

function isItem(value: unknown): value is GiftRecordItemInput {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.giftId === 'string' &&
    typeof item.giftName === 'string' &&
    typeof item.amountInCents === 'number'
  )
}

export function loadPendingCardPayment(): PendingCardPayment | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as unknown
    if (typeof parsed !== 'object' || parsed === null) return null
    const pending = parsed as Record<string, unknown>
    if (typeof pending.orderNsu !== 'string' || !Array.isArray(pending.items)) return null
    const items = pending.items.filter(isItem)
    if (items.length === 0) return null
    return {
      orderNsu: pending.orderNsu,
      items,
      fromCart: pending.fromCart === true,
      createdAt: typeof pending.createdAt === 'string' ? pending.createdAt : '',
    }
  } catch {
    return null
  }
}

export function savePendingCardPayment(pending: PendingCardPayment): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
  } catch {
    // Without storage the guest can still say they paid by card on the way back.
  }
}

export function clearPendingCardPayment(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear.
  }
}
