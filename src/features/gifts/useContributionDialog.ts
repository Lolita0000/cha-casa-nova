import { useCallback, useState } from 'react'

import type { Gift } from '@/types/gift'

export function useContributionDialog() {
  const [gift, setGift] = useState<Gift | null>(null)

  const open = useCallback((next: Gift) => setGift(next), [])
  const close = useCallback(() => setGift(null), [])

  return { gift, open, close }
}
