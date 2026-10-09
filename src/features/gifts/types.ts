import type { Gift } from '@/types/gift'

/** Opens the amount picker for gifts guests contribute to in parts. */
export type OpenContribution = (gift: Gift) => void
