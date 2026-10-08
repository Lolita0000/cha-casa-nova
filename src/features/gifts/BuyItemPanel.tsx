import { ExternalIcon } from '@/components/icons/icons'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { siteConfig } from '@/config/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { Gift } from '@/types/gift'

interface BuyItemPanelProps {
  gift: Gift
}

export function BuyItemPanel({ gift }: BuyItemPanelProps) {
  const message = `Oi! Vou comprar ${gift.name.toLowerCase()} pra vocês, pode deixar como reservado?`

  return (
    <div>
      <p className="rounded-2xl bg-rose-50 p-4 text-ink-800">
        Caso você queira comprar o item e não mandar o Pix, nos avise que deixaremos o item como
        reservado. Assim ninguém compra repetido.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {gift.productUrl && (
          <a
            href={gift.productUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ variant: 'outline' })}
          >
            Ver o produto na loja
            <ExternalIcon className="size-4" />
          </a>
        )}
        <a
          href={buildWhatsAppUrl(siteConfig.whatsappNumber, message)}
          target="_blank"
          rel="noreferrer"
          className={buttonClassName()}
        >
          Avisar que vou comprar
        </a>
      </div>

      {!gift.productUrl && (
        <p className="mt-4 text-sm text-ash-600">
          Ainda não escolhemos um modelo específico. Se quiser, pergunta pra gente qual seria.
        </p>
      )}
    </div>
  )
}
