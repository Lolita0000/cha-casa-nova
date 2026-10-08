import { useCallback, useState } from 'react'

import type { Gift } from '@/types/gift'

import type { GiftDialogTab } from './types'

interface DialogState {
  gift: Gift
  initialTab: GiftDialogTab
}

/** Only one gift dialog is open at a time. */
export function useGiftDialog() {
  const [state, setState] = useState<DialogState | null>(null)

  const open = useCallback(
    (gift: Gift, initialTab: GiftDialogTab = 'pix') => setState({ gift, initialTab }),
    [],
  )
  const close = useCallback(() => setState(null), [])

  return { state, open, close }
}
