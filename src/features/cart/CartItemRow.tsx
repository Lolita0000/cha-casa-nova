import { CloseIcon } from '@/components/icons/icons'
import { GiftImage } from '@/features/gifts/GiftImage'
import { formatCents } from '@/lib/format/currency'

import type { CartItem } from './cart'

interface CartItemRowProps {
  item: CartItem
  onRemove: (giftId: string) => void
}

export function CartItemRow({ item: { gift, amountInCents }, onRemove }: CartItemRowProps) {
  const isShare = gift.kind === 'pooled' && amountInCents < gift.goalInCents - gift.raisedInCents

  return (
    <li className="flex items-center gap-3 py-3">
      <GiftImage src={gift.imageUrl} className="size-14 shrink-0 rounded-2xl" compact />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 leading-snug font-bold text-ink-900">{gift.name}</p>
        {isShare && <p className="text-xs text-ash-600">Uma parte do presente</p>}
      </div>
      <p className="shrink-0 font-semibold text-ink-800 tabular-nums">
        {formatCents(amountInCents)}
      </p>
      <button
        type="button"
        onClick={() => onRemove(gift.id)}
        aria-label={`Remover ${gift.name} do carrinho`}
        className="grid size-9 shrink-0 place-items-center rounded-full text-ash-500 hover:bg-rose-50 hover:text-rose-700"
      >
        <CloseIcon className="size-4" />
      </button>
    </li>
  )
}
