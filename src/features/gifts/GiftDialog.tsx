import { useState } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { siteConfig } from '@/config/site'
import { CardPayment } from '@/features/payment/CardPayment'
import { PixPayment } from '@/features/payment/PixPayment'
import { formatCentsShort } from '@/lib/format/currency'
import type { Gift, PooledGift } from '@/types/gift'

import { AmountPicker } from './AmountPicker'
import { BuyItemPanel } from './BuyItemPanel'
import type { GiftDialogTab } from './types'

interface GiftDialogProps {
  gift: Gift | null
  initialTab: GiftDialogTab
  onClose: () => void
}

export function GiftDialog({ gift, initialTab, onClose }: GiftDialogProps) {
  return (
    <Dialog open={gift !== null} onClose={onClose} title={gift?.name ?? ''}>
      {/* Keyed so tab and amount reset whenever a different gift is opened. */}
      {gift && <GiftDialogContent key={gift.id} gift={gift} initialTab={initialTab} />}
    </Dialog>
  )
}

interface GiftDialogContentProps {
  gift: Gift
  initialTab: GiftDialogTab
}

function GiftDialogContent({ gift, initialTab }: GiftDialogContentProps) {
  const [activeTab, setActiveTab] = useState<GiftDialogTab>(initialTab)
  const [pooledAmount, setPooledAmount] = useState<number | undefined>(() =>
    gift.kind === 'pooled' ? getShareOptions(gift)[0] : undefined,
  )

  const amount = gift.kind === 'simple' ? gift.priceInCents : pooledAmount
  const cardUrl =
    gift.kind === 'simple' ? gift.cardPaymentUrl : siteConfig.openAmountCardUrl || undefined

  const tabs: TabItem<GiftDialogTab>[] = [
    {
      id: 'pix',
      label: 'Pix',
      content: <PixPayment amountInCents={amount} description={gift.name} />,
    },
    ...(cardUrl
      ? [{ id: 'card' as const, label: 'Cartão', content: <CardPayment url={cardUrl} /> }]
      : []),
    { id: 'buy', label: 'Comprar o item', content: <BuyItemPanel gift={gift} /> },
  ]

  return (
    <>
      {gift.kind === 'simple' ? (
        <p className="-mt-2 mb-6 font-display text-2xl text-rose-700">
          {formatCentsShort(gift.priceInCents)}
        </p>
      ) : (
        <PooledAmount gift={gift} amount={pooledAmount} onAmountChange={setPooledAmount} />
      )}

      <Tabs
        label="Como você quer presentear"
        tabs={tabs}
        activeId={activeTab}
        onChange={setActiveTab}
      />
    </>
  )
}

function getShareOptions(gift: PooledGift): number[] {
  const remaining = Math.max(gift.goalInCents - gift.raisedInCents, 0)
  return gift.suggestedSharesInCents.filter((share) => share <= remaining)
}

interface PooledAmountProps {
  gift: PooledGift
  amount: number | undefined
  onAmountChange: (cents: number | undefined) => void
}

function PooledAmount({ gift, amount, onAmountChange }: PooledAmountProps) {
  const remaining = Math.max(gift.goalInCents - gift.raisedInCents, 0)

  return (
    <div className="mb-6">
      <p className="mb-4 text-ash-600">
        Estamos juntando aos pouquinhos. Faltam{' '}
        <strong className="text-ink-900">{formatCentsShort(remaining)}</strong> e qualquer parte
        ajuda.
      </p>
      <AmountPicker
        options={getShareOptions(gift)}
        valueInCents={amount}
        onChange={onAmountChange}
        maxInCents={remaining}
      />
    </div>
  )
}
