import { ExternalIcon } from '@/components/icons/icons'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { siteConfig } from '@/config/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

import type { CartItem } from './cart'
import { buildBuyingMessage } from './messages'

interface BuyItemsPanelProps {
  items: CartItem[]
}

export function BuyItemsPanel({ items }: BuyItemsPanelProps) {
  return (
    <div>
      <p className="rounded-2xl bg-rose-50 p-4 text-ink-800">
        Caso você queira comprar o item e não mandar o Pix, nos avise que deixaremos o item como
        reservado. Assim ninguém compra repetido.
      </p>

      <ul className="mt-4 divide-y divide-ash-100">
        {items.map(({ gift }) => (
          <li key={gift.id} className="flex items-center justify-between gap-3 py-3">
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
          </li>
        ))}
      </ul>

      <a
        href={buildWhatsAppUrl(siteConfig.whatsappNumber, buildBuyingMessage(items))}
        target="_blank"
        rel="noreferrer"
        className={buttonClassName({ className: 'mt-5 w-full' })}
      >
        Avisar que vou comprar
      </a>
    </div>
  )
}
