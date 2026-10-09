import { createContext } from 'react'

import type { CartItem, CartLine } from './cart'

export interface CartContextValue {
  items: CartItem[]
  totalInCents: number
  isOpen: boolean
  add: (line: CartLine) => void
  remove: (giftId: string) => void
  clear: () => void
  amountFor: (giftId: string) => number | undefined
  open: () => void
  close: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
