import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getProgress, isFunded } from '@/data/selectors'
import { formatCentsShort } from '@/lib/format/currency'
import type { PooledGift } from '@/types/gift'

interface PooledGiftCardProps {
  gift: PooledGift
  onContribute: (gift: PooledGift) => void
  onReserve: (gift: PooledGift) => void
}

export function PooledGiftCard({ gift, onContribute, onReserve }: PooledGiftCardProps) {
  const progress = getProgress(gift)
  const funded = isFunded(gift)

  return (
    <li className="my-4 rounded-lg bg-blush-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-display text-xl text-ink-900">{gift.name}</h4>
        {!gift.reservedBy && (
          <p className="text-sm text-concrete-600 tabular-nums">
            {formatCentsShort(gift.raisedInCents)} de {formatCentsShort(gift.goalInCents)}
          </p>
        )}
      </div>

      {gift.description && <p className="mt-1 text-sm text-concrete-600">{gift.description}</p>}

      {gift.reservedBy ? (
        <p className="mt-5 border-l-2 border-blush-400 pl-3 text-ink-800">
          {gift.reservedBy} vai dar esse pra gente.
        </p>
      ) : funded ? (
        <p className="mt-5 border-l-2 border-blush-400 pl-3 text-ink-800">
          Conseguimos! Obrigado a todo mundo que ajudou.
        </p>
      ) : (
        <>
          <ProgressBar value={progress} label={`Arrecadado para ${gift.name}`} className="mt-5" />
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button size="sm" onClick={() => onContribute(gift)}>
              Contribuir com uma parte
            </Button>
            <Button variant="ghost" onClick={() => onReserve(gift)}>
              Quero dar ele inteiro
            </Button>
          </div>
        </>
      )}
    </li>
  )
}
