import { CheckIcon } from '@/components/icons/icons'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { defaultAmountFor } from '@/features/cart/cart'
import { useCart } from '@/features/cart/useCart'
import type { SimpleGift } from '@/types/gift'

import type { OpenContribution } from './types'

interface CartToggleButtonProps {
  gift: SimpleGift
  onContribute: OpenContribution
}

/** Adds a gift to the cart, or removes it when it is already there. */
export function CartToggleButton({ gift, onContribute }: CartToggleButtonProps) {
  const { add, remove, amountFor } = useCart()
  const isInCart = amountFor(gift.id) !== undefined

  function handleClick() {
    if (isInCart) return remove(gift.id)
    // Without a price the guest chooses how much to give.
    if (!gift.priceInCents) return onContribute(gift)
    add({ giftId: gift.id, amountInCents: defaultAmountFor(gift) })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isInCart}
      aria-label={`${isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}: ${gift.name}`}
      className={buttonClassName({ variant: isInCart ? 'primary' : 'soft', size: 'sm' })}
    >
      {isInCart ? (
        <>
          <CheckIcon className="size-4" />
          No carrinho
        </>
      ) : (
        'Adicionar'
      )}
    </button>
  )
}
