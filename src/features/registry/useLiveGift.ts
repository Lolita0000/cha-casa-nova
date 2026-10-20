import type { Gift } from '@/types/gift'

import { applyPublicStatus, type LiveGift } from './liveGift'
import { useGiftStatus } from './useGiftStatus'

export function useLiveGift<T extends Gift>(gift: T): LiveGift<T> {
  const { statusOf } = useGiftStatus()
  return applyPublicStatus(gift, statusOf(gift.id))
}
