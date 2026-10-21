import { createContext } from 'react'

import type { GiftPublicStatus } from './types'

export interface GiftStatusContextValue {
  statusOf: (giftId: string) => GiftPublicStatus
  refresh: () => void
}

export const EMPTY_STATUS: GiftPublicStatus = { contributedInCents: 0, purchaseCount: 0 }

export const GiftStatusContext = createContext<GiftStatusContextValue>({
  statusOf: () => EMPTY_STATUS,
  refresh: () => {},
})
