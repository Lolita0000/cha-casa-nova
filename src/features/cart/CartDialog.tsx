import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { CardCheckout } from '@/features/payment/CardCheckout'
import { PixPayment } from '@/features/payment/PixPayment'
import { isCardPaymentEnabled } from '@/features/payment/startCardCheckout'
import { GiftConfirmation } from '@/features/registry/GiftConfirmation'
import { buildPixDescription } from '@/features/registry/messages'
import type { GiftMethod, GiftRecordItemInput } from '@/features/registry/types'
import { useConfirmationLock } from '@/features/registry/useConfirmationLock'
import { useGiftStatus } from '@/features/registry/useGiftStatus'
import { formatCents } from '@/lib/format/currency'

import type { CartItem } from './cart'
import { BuyItemsPanel } from './BuyItemsPanel'
import { CartItemRow } from './CartItemRow'
import { useCart } from './useCart'

type CheckoutTab = 'pix' | 'card' | 'buy'

type Step =
  { name: 'checkout' } | { name: 'confirm'; method: GiftMethod; items: GiftRecordItemInput[] }

function toRecordItems(items: CartItem[]): GiftRecordItemInput[] {
  return items.map(({ gift, amountInCents }) => ({
    giftId: gift.id,
    giftName: gift.name,
    amountInCents,
  }))
}

export function CartDialog() {
  const { items, totalInCents, isOpen, close, remove, clear } = useCart()
  const { refresh } = useGiftStatus()
  const [step, setStep] = useState<Step>({ name: 'checkout' })
  const confirmation = useConfirmationLock()

  function handleClose() {
    close()
    setStep({ name: 'checkout' })
  }

  function startConfirmation(method: GiftMethod) {
    // Snapshot the cart: it is cleared once the gift is registered.
    setStep({ name: 'confirm', method, items: toRecordItems(items) })
    confirmation.lock()
  }

  const title = step.name === 'confirm' ? 'Confirmar presente' : 'Seu carrinho'

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={title}
      locked={confirmation.isLocked}
      onCloseBlocked={confirmation.registerCloseAttempt}
    >
      {step.name === 'confirm' ? (
        <GiftConfirmation
          items={step.items}
          defaultMethod={step.method}
          closeAttempts={confirmation.closeAttempts}
          onConfirmed={() => {
            confirmation.unlock()
            clear()
            refresh()
          }}
        />
      ) : items.length === 0 ? (
        <p className="text-ash-600">
          Seu carrinho está vazio. Escolha os presentes na lista e eles aparecem aqui.
        </p>
      ) : (
        <>
          <ul className="-mt-2 divide-y divide-ash-100">
            {items.map((item) => (
              <CartItemRow key={item.gift.id} item={item} onRemove={remove} />
            ))}
          </ul>

          <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink-800 pt-4">
            <span className="font-bold text-ink-900">Total</span>
            <span className="font-display text-3xl text-rose-700 tabular-nums">
              {formatCents(totalInCents)}
            </span>
          </div>

          <div className="mt-6">
            <Checkout items={items} totalInCents={totalInCents} onConfirm={startConfirmation} />
          </div>

          <button
            type="button"
            onClick={clear}
            className="mt-6 text-sm font-semibold text-ash-500 underline underline-offset-4 hover:text-ink-800"
          >
            Esvaziar carrinho
          </button>
        </>
      )}
    </Dialog>
  )
}

interface CheckoutProps {
  items: CartItem[]
  totalInCents: number
  onConfirm: (method: GiftMethod) => void
}

function Checkout({ items, totalInCents, onConfirm }: CheckoutProps) {
  const [activeTab, setActiveTab] = useState<CheckoutTab>('pix')

  const tabs: TabItem<CheckoutTab>[] = [
    {
      id: 'pix',
      label: 'Pix',
      content: (
        <>
          <PixPayment
            amountInCents={totalInCents}
            description={buildPixDescription(items.map(({ gift }) => ({ giftName: gift.name })))}
          />
          <Button variant="soft" onClick={() => onConfirm('pix')} className="mt-5 w-full">
            Já fiz o Pix
          </Button>
        </>
      ),
    },
    ...(isCardPaymentEnabled
      ? [
          {
            id: 'card' as const,
            label: 'Cartão',
            content: <CardCheckout items={toRecordItems(items)} fromCart />,
          },
        ]
      : []),
    {
      id: 'buy',
      label: 'Comprar os itens',
      content: <BuyItemsPanel items={items} onConfirm={() => onConfirm('purchase')} />,
    },
  ]

  return (
    <Tabs
      label="Como você quer presentear"
      tabs={tabs}
      activeId={activeTab}
      onChange={setActiveTab}
    />
  )
}
