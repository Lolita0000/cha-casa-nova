import { Button } from '@/components/ui/Button'
import { formatCentsShort } from '@/lib/format/currency'
import type { SimpleGift } from '@/types/gift'

interface SimpleGiftRowProps {
  gift: SimpleGift
  onGive: (gift: SimpleGift) => void
}

export function SimpleGiftRow({ gift, onGive }: SimpleGiftRowProps) {
  return (
    <li className="flex items-center gap-4 border-b border-ash-200 py-5 last:border-b-0">
      {gift.imageUrl && (
        <img
          src={gift.imageUrl}
          alt=""
          loading="lazy"
          className="size-16 shrink-0 rounded-md bg-ash-100 object-cover"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 sm:flex-1">
          <h4 className="font-medium text-ink-900">{gift.name}</h4>
          {gift.description && (
            <p className="mt-0.5 text-sm text-ash-600">{gift.description}</p>
          )}
        </div>
        <p className="font-display text-lg text-ink-800 tabular-nums sm:shrink-0">
          {formatCentsShort(gift.priceInCents)}
        </p>
      </div>

      <Button size="sm" onClick={() => onGive(gift)} aria-label={`Presentear: ${gift.name}`}>
        Presentear
      </Button>
    </li>
  )
}
