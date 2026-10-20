import { useContext } from 'react'

import { GiftStatusContext } from './giftStatusContext'

export function useGiftStatus() {
  return useContext(GiftStatusContext)
}
