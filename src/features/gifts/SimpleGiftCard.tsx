import { formatCentsShort } from '@/lib/format/currency'
import type { SimpleGift } from '@/types/gift'

import { CartToggleButton } from './CartToggleButton'
import { GiftImage } from './GiftImage'
import type { OpenContribution } from './types'

interface SimpleGiftCardProps {
  gift: SimpleGift
  onContribute: OpenContribution
}

export function SimpleGiftCard({ gift, onContribute }: SimpleGiftCardProps) {
  return (
    <li className="flex flex-col rounded-[1.75rem] bg-white p-2.5">
      <GiftImage src={gift.imageUrl} className="aspect-square w-full rounded-[1.35rem]" />

      <div className="flex flex-1 flex-col px-3 pt-4 pb-2">
        <h4 className="text-lg font-bold text-ink-900">{gift.name}</h4>
        {gift.description && <p className="mt-1 text-sm text-ash-600">{gift.description}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {gift.priceInCents ? (
            <p className="font-display text-2xl text-ink-800 tabular-nums">
              {formatCentsShort(gift.priceInCents)}
            </p>
          ) : (
            <p className="text-sm font-semibold text-ash-500">Valor a definir</p>
          )}
          <CartToggleButton gift={gift} onContribute={onContribute} />
        </div>
      </div>
    </li>
  )
}
