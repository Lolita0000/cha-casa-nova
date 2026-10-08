import { buttonClassName } from '@/components/ui/buttonStyles'
import { formatCentsShort } from '@/lib/format/currency'
import type { SimpleGift } from '@/types/gift'

import { GiftImage } from './GiftImage'
import type { OpenGiftDialog } from './types'

interface SimpleGiftCardProps {
  gift: SimpleGift
  onOpen: OpenGiftDialog
}

export function SimpleGiftCard({ gift, onOpen }: SimpleGiftCardProps) {
  return (
    <li className="flex flex-col rounded-[1.75rem] bg-white p-2.5">
      <GiftImage src={gift.imageUrl} className="aspect-[4/3] w-full rounded-[1.35rem]" />

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
          <button
            type="button"
            onClick={() => onOpen(gift)}
            aria-label={`Presentear: ${gift.name}`}
            className={buttonClassName({ variant: 'soft', size: 'sm' })}
          >
            Presentear
          </button>
        </div>
      </div>
    </li>
  )
}
