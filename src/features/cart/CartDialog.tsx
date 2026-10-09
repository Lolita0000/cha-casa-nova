import { useState } from 'react'

import { buttonClassName } from '@/components/ui/buttonStyles'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { siteConfig } from '@/config/site'
import { CardPayment } from '@/features/payment/CardPayment'
import { PixPayment } from '@/features/payment/PixPayment'
import { formatCents } from '@/lib/format/currency'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

import type { CartItem } from './cart'
import { BuyItemsPanel } from './BuyItemsPanel'
import { CartItemRow } from './CartItemRow'
import { buildPixDescription, buildPixSentMessage } from './messages'
import { useCart } from './useCart'

type CheckoutTab = 'pix' | 'card' | 'buy'

export function CartDialog() {
  const { items, totalInCents, isOpen, close, remove, clear } = useCart()

  return (
    <Dialog open={isOpen} onClose={close} title="Seu carrinho">
      {items.length === 0 ? (
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
            <Checkout items={items} totalInCents={totalInCents} />
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
}

function Checkout({ items, totalInCents }: CheckoutProps) {
  const [activeTab, setActiveTab] = useState<CheckoutTab>('pix')
  const cardUrl = siteConfig.openAmountCardUrl || undefined

  const tabs: TabItem<CheckoutTab>[] = [
    {
      id: 'pix',
      label: 'Pix',
      content: (
        <>
          <PixPayment amountInCents={totalInCents} description={buildPixDescription(items)} />
          <a
            href={buildWhatsAppUrl(
              siteConfig.whatsappNumber,
              buildPixSentMessage(items, totalInCents),
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ variant: 'soft', className: 'mt-5 w-full' })}
          >
            Já mandei, avisar vocês
          </a>
        </>
      ),
    },
    ...(cardUrl
      ? [{ id: 'card' as const, label: 'Cartão', content: <CardPayment url={cardUrl} /> }]
      : []),
    { id: 'buy', label: 'Comprar os itens', content: <BuyItemsPanel items={items} /> },
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
