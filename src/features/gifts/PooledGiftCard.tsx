import { HeartIcon } from '@/components/icons/icons'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getProgress, isFunded } from '@/data/selectors'
import { defaultAmountFor } from '@/features/cart/cart'
import { useCart } from '@/features/cart/useCart'
import { formatCents, formatCentsShort } from '@/lib/format/currency'
import type { PooledGift } from '@/types/gift'

import { GiftImage } from './GiftImage'
import type { OpenContribution } from './types'

interface PooledGiftCardProps {
  gift: PooledGift
  onContribute: OpenContribution
}

export function PooledGiftCard({ gift, onContribute }: PooledGiftCardProps) {
  const { add, remove, open, amountFor } = useCart()
  const amountInCart = amountFor(gift.id)
  const progress = getProgress(gift)
  const funded = isFunded(gift)
  const isDone = Boolean(gift.reservedBy) || funded

  return (
    <li className="grid gap-2.5 rounded-[1.75rem] bg-ash-600 p-2.5 text-white sm:col-span-2 sm:grid-cols-[2fr_3fr]">
      <GiftImage
        src={gift.imageUrl}
        className="aspect-[4/3] w-full rounded-[1.35rem] sm:aspect-auto sm:h-full"
      />

      <div className="flex flex-col px-3 pt-3 pb-3 sm:px-4 sm:pt-4">
        <p className="text-sm font-bold text-rose-200">Item maior, juntando aos poucos</p>
        <h4 className="mt-1 font-display text-3xl">{gift.name}</h4>
        {gift.description && <p className="mt-2 text-sm text-ash-100">{gift.description}</p>}

        {isDone ? (
          <p className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 p-4 font-semibold">
            <HeartIcon className="size-5 shrink-0 text-rose-300" />
            {gift.reservedBy
              ? `Reservado! ${gift.reservedBy} vai dar esse pra gente.`
              : 'Conseguimos! Obrigado a todo mundo que ajudou.'}
          </p>
        ) : (
          <>
            <div className="mt-6 flex items-baseline justify-between text-sm">
              <span className="font-bold">{Math.round(progress * 100)}% juntado</span>
              <span className="text-ash-100 tabular-nums">
                {formatCentsShort(gift.raisedInCents)} de {formatCentsShort(gift.goalInCents)}
              </span>
            </div>
            <ProgressBar value={progress} label={`Arrecadado para ${gift.name}`} className="mt-2" />

            {amountInCart !== undefined ? (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  <HeartIcon className="size-4 text-rose-300" />
                  {formatCents(amountInCart)} no seu carrinho
                </p>
                <button
                  type="button"
                  onClick={() => remove(gift.id)}
                  className="text-sm font-bold underline decoration-rose-300 decoration-2 underline-offset-4 hover:text-rose-100"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={() => onContribute(gift)}
                  className={buttonClassName({ variant: 'soft', size: 'sm' })}
                >
                  Contribuir com uma parte
                </button>
                {gift.allowFullPurchase !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      add({ giftId: gift.id, amountInCents: defaultAmountFor(gift) })
                      open()
                    }}
                    className="text-sm font-bold underline decoration-rose-300 decoration-2 underline-offset-4 hover:text-rose-100"
                  >
                    Quero dar ele inteiro
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </li>
  )
}
