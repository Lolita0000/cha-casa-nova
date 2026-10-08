import type { Gift, PooledGift } from '@/types/gift'

export interface GiftActions {
  onGive: (gift: Gift) => void
  onReserve: (gift: PooledGift) => void
}
