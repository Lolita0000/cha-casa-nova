import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useCart } from '@/features/cart/useCart'
import { formatCents, formatCentsShort } from '@/lib/format/currency'
import type { Gift } from '@/types/gift'

import { AmountPicker } from './AmountPicker'

interface ContributionDialogProps {
  gift: Gift | null
  onClose: () => void
}

/** Lets the guest choose how much to give before adding the gift to the cart. */
export function ContributionDialog({ gift, onClose }: ContributionDialogProps) {
  return (
    <Dialog open={gift !== null} onClose={onClose} title={gift?.name ?? ''}>
      {/* Keyed so the chosen amount resets whenever another gift is opened. */}
      {gift && <ContributionForm key={gift.id} gift={gift} onDone={onClose} />}
    </Dialog>
  )
}

interface ContributionFormProps {
  gift: Gift
  onDone: () => void
}

function ContributionForm({ gift, onDone }: ContributionFormProps) {
  const { add } = useCart()
  const remaining =
    gift.kind === 'pooled' ? Math.max(gift.goalInCents - gift.raisedInCents, 0) : undefined
  const options =
    gift.kind === 'pooled'
      ? gift.suggestedSharesInCents.filter((share) => remaining === undefined || share <= remaining)
      : []
  const [amount, setAmount] = useState<number | undefined>(options[0])

  function handleAdd() {
    if (!amount) return
    add({ giftId: gift.id, amountInCents: amount })
    onDone()
  }

  return (
    <>
      <p className="mb-5 text-ash-600">
        {remaining !== undefined ? (
          <>
            Estamos juntando aos pouquinhos. Faltam{' '}
            <strong className="text-ink-900">{formatCentsShort(remaining)}</strong> e qualquer parte
            ajuda.
          </>
        ) : (
          'Ainda não definimos o valor desse presente. Escolha quanto quer dar.'
        )}
      </p>
      <AmountPicker
        options={options}
        valueInCents={amount}
        onChange={setAmount}
        maxInCents={remaining}
      />
      <Button onClick={handleAdd} disabled={!amount} className="mt-6 w-full">
        {amount ? `Adicionar ${formatCents(amount)} ao carrinho` : 'Escolha um valor'}
      </Button>
    </>
  )
}
