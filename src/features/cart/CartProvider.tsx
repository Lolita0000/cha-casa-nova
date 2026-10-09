import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'

import type { Gift } from '@/types/gift'

import { cartReducer, cartTotal, resolveCartItems } from './cart'
import { CartContext, type CartContextValue } from './cartContext'
import { loadCart, saveCart } from './cartStorage'

interface CartProviderProps {
  gifts: Gift[]
  children: ReactNode
}

export function CartProvider({ gifts, children }: CartProviderProps) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => saveCart(lines), [lines])

  const items = useMemo(() => resolveCartItems(lines, gifts), [lines, gifts])

  const add = useCallback<CartContextValue['add']>((line) => dispatch({ type: 'add', line }), [])
  const remove = useCallback((giftId: string) => dispatch({ type: 'remove', giftId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalInCents: cartTotal(items),
      isOpen,
      add,
      remove,
      clear,
      amountFor: (giftId) => items.find((item) => item.gift.id === giftId)?.amountInCents,
      open,
      close,
    }),
    [items, isOpen, add, remove, clear, open, close],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
