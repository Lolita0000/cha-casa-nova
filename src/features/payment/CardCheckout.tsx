import { useId, useState } from 'react'

import { Button } from '@/components/ui/Button'
import type { GiftRecordItemInput } from '@/features/registry/types'
import { formatCents, reaisToCents } from '@/lib/format/currency'

import { startCardCheckout } from './startCardCheckout'

type CardCheckoutProps =
  | { items: GiftRecordItemInput[]; fromCart: boolean; openAmountFor?: never }
  /** Free contributions: the guest types the amount first. */
  | { openAmountFor: { giftId: string; giftName: string }; items?: never; fromCart?: never }

export function CardCheckout(props: CardCheckoutProps) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const amountId = useId()

  const fixedTotal = props.items?.reduce((sum, item) => sum + item.amountInCents, 0)

  function resolveItems(): GiftRecordItemInput[] | null {
    if (props.items) return props.items
    const reais = Number(amount.replace(',', '.'))
    if (!amount || Number.isNaN(reais) || reais <= 0) {
      setError('Escreva quanto você quer mandar.')
      return null
    }
    return [{ ...props.openAmountFor, amountInCents: reaisToCents(reais) }]
  }

  async function pay() {
    const items = resolveItems()
    if (!items) return
    setIsStarting(true)
    setError(null)
    try {
      await startCardCheckout(items, { fromCart: props.fromCart ?? false })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não deu pra abrir o pagamento agora.')
      setIsStarting(false)
    }
  }

  return (
    <div>
      <p className="text-ash-600">
        Você vai pra página segura da InfinitePay, paga no cartão de crédito (dá pra parcelar) e
        volta pra cá pra deixar seu nome. O comprovante vem junto, sozinho.
      </p>

      {props.openAmountFor && (
        <div className="mt-5">
          <label htmlFor={amountId} className="font-bold text-ink-900">
            Quanto você quer mandar?
          </label>
          <div className="mt-2 flex h-12 items-center gap-2 rounded-2xl border-2 border-ash-200 bg-white px-4 focus-within:border-rose-400">
            <span className="text-ash-600">R$</span>
            <input
              id={amountId}
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
              className="min-w-0 flex-1 bg-transparent text-ink-900 tabular-nums outline-none"
            />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      <Button onClick={() => void pay()} disabled={isStarting} className="mt-5 w-full">
        {isStarting
          ? 'Abrindo o pagamento...'
          : fixedTotal
            ? `Pagar ${formatCents(fixedTotal)} no cartão`
            : 'Pagar no cartão'}
      </Button>
    </div>
  )
}
