import { ExternalIcon } from '@/components/icons/icons'
import { Button } from '@/components/ui/Button'
import { useGiftStatus } from '@/features/registry/useGiftStatus'

import type { CartItem } from './cart'

interface BuyItemsPanelProps {
  items: CartItem[]
  onConfirm: () => void
}

export function BuyItemsPanel({ items, onConfirm }: BuyItemsPanelProps) {
  const { statusOf } = useGiftStatus()

  return (
    <div>
      <p className="rounded-2xl bg-rose-50 p-4 text-ink-800">
        Caso você queira comprar o item e não mandar o Pix, nos avise que deixaremos o item como
        reservado. Assim ninguém compra repetido.
      </p>

      <ul className="mt-4 divide-y divide-ash-100">
        {items.map(({ gift }) => {
          const alreadyBought = statusOf(gift.id).purchaseCount > 0
          return (
            <li key={gift.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="line-clamp-2 min-w-0 font-semibold text-ink-900">{gift.name}</span>
                {gift.productUrl ? (
                  <a
                    href={gift.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4"
                  >
                    Ver na loja
                    <ExternalIcon className="size-3.5" />
                  </a>
                ) : (
                  <span className="shrink-0 text-sm text-ash-500">Sem link ainda</span>
                )}
              </div>
              {alreadyBought && (
                <p className="mt-1 text-sm font-semibold text-rose-700">
                  Alguém já disse que vai comprar esse. Que tal mandar Pix?
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <Button onClick={onConfirm} className="mt-5 w-full">
        Vou comprar esses itens
      </Button>
    </div>
  )
}
