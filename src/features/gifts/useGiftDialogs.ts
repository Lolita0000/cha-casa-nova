import { useCallback, useState } from 'react'

import type { Gift, PooledGift } from '@/types/gift'

type DialogState =
  { type: 'closed' } | { type: 'give'; gift: Gift } | { type: 'reserve'; gift: PooledGift }

/** Only one gift dialog can be open at a time. */
export function useGiftDialogs() {
  const [state, setState] = useState<DialogState>({ type: 'closed' })

  const openGive = useCallback((gift: Gift) => setState({ type: 'give', gift }), [])
  const openReserve = useCallback((gift: PooledGift) => setState({ type: 'reserve', gift }), [])
  const close = useCallback(() => setState({ type: 'closed' }), [])

  return {
    giftToGive: state.type === 'give' ? state.gift : null,
    giftToReserve: state.type === 'reserve' ? state.gift : null,
    openGive,
    openReserve,
    close,
  }
}
