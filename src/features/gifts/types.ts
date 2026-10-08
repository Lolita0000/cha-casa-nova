import type { Gift } from '@/types/gift'

export type GiftDialogTab = 'pix' | 'card' | 'buy'

export type OpenGiftDialog = (gift: Gift, tab?: GiftDialogTab) => void
