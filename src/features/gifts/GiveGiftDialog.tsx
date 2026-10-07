import { useState } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { siteConfig } from '@/config/site'
import { formatCentsShort } from '@/lib/format/currency'
import { PaymentOptions } from '@/features/payment/PaymentOptions'
import type { Gift, PooledGift } from '@/types/gift'

import { AmountPicker } from './AmountPicker'

interface GiveGiftDialogProps {
  gift: Gift | null
  onClose: () => void
}

export function GiveGiftDialog({ gift, onClose }: GiveGiftDialogProps) {
  return (
    <Dialog open={gift !== null} onClose={onClose} title={gift?.name ?? ''}>
      {gift &&
        (gift.kind === 'simple' ? (
          <>
            <p className="mb-6 text-concrete-600">
              Valor do presente:{' '}
              <span className="font-display text-xl text-ink-900">
                {formatCentsShort(gift.priceInCents)}
              </span>
            </p>
            <PaymentOptions
              amountInCents={gift.priceInCents}
              description={gift.name}
              cardPaymentUrl={gift.cardPaymentUrl}
            />
          </>
        ) : (
          // Keyed so the chosen amount resets when another gift is opened.
          <PooledContribution key={gift.id} gift={gift} />
        ))}
    </Dialog>
  )
}

function PooledContribution({ gift }: { gift: PooledGift }) {
  const remaining = Math.max(gift.goalInCents - gift.raisedInCents, 0)
  const options = gift.suggestedSharesInCents.filter((share) => share <= remaining)
  const [amount, setAmount] = useState<number | undefined>(options[0])

  return (
    <>
      <p className="mb-5 text-concrete-600">
        Estamos juntando aos poucos. Faltam{' '}
        <span className="text-ink-900">{formatCentsShort(remaining)}</span> e qualquer parte ajuda.
      </p>
      <AmountPicker
        options={options}
        valueInCents={amount}
        onChange={setAmount}
        maxInCents={remaining}
      />
      <div className="mt-6 border-t border-concrete-200 pt-6">
        <PaymentOptions
          amountInCents={amount}
          description={gift.name}
          cardPaymentUrl={siteConfig.openAmountCardUrl || undefined}
        />
      </div>
    </>
  )
}
