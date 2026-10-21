import { useLiveGift } from '@/features/registry/useLiveGift'
import { formatCentsShort } from '@/lib/format/currency'
import type { SimpleGift } from '@/types/gift'

import { CartToggleButton } from './CartToggleButton'
import { GiftImage } from './GiftImage'
import type { OpenContribution } from './types'

interface SimpleGiftCardProps {
  gift: SimpleGift
  onContribute: OpenContribution
  className?: string
}

export function SimpleGiftCard({
  gift: listedGift,
  onContribute,
  className = '',
}: SimpleGiftCardProps) {
  const gift = useLiveGift(listedGift)
  return (
    <li
      className={`flex flex-col rounded-[1.25rem] bg-white p-1.5 sm:rounded-[1.75rem] sm:p-2.5 ${className}`}
    >
      <div className="relative">
        <GiftImage
          src={gift.imageUrl}
          className="aspect-square w-full rounded-[1rem] sm:rounded-[1.35rem]"
        />
        {gift.purchasedByGuest && (
          <p className="absolute inset-x-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-center text-[11px] leading-tight font-bold text-rose-700 shadow-sm sm:inset-x-auto sm:top-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-xs">
            Alguém já vai comprar esse
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5 sm:px-3 sm:pt-4 sm:pb-2">
        <h4 className="text-sm leading-snug font-bold text-ink-900 sm:text-lg">{gift.name}</h4>
        {gift.description && (
          <p className="mt-1 line-clamp-2 text-xs text-ash-600 sm:line-clamp-none sm:text-sm">
            {gift.description}
          </p>
        )}

        <div className="mt-auto flex flex-col items-stretch gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
          {gift.priceInCents ? (
            <p className="font-display text-xl text-ink-800 tabular-nums sm:text-2xl">
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
