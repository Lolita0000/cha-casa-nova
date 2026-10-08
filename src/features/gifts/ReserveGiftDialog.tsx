import { buttonClassName } from '@/components/ui/buttonStyles'
import { Dialog } from '@/components/ui/Dialog'
import { siteConfig } from '@/config/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { PooledGift } from '@/types/gift'

interface ReserveGiftDialogProps {
  gift: PooledGift | null
  onClose: () => void
}

export function ReserveGiftDialog({ gift, onClose }: ReserveGiftDialogProps) {
  const message = gift
    ? `Oi! Quero dar ${gift.name.toLowerCase()} de presente pra vocês. Pode marcar como reservado?`
    : ''

  return (
    <Dialog open={gift !== null} onClose={onClose} title={gift?.name ?? ''}>
      <div className="space-y-4 text-ash-600">
        <p>Que presentão! Se você quer dar esse item inteiro, avisa a gente antes de comprar.</p>
        <p>
          Assim marcamos o item como reservado aqui no site e ninguém compra um repetido. Se alguém
          perguntar, a gente já sabe dizer que você vai dar.
        </p>
      </div>

      <a
        href={buildWhatsAppUrl(siteConfig.whatsappNumber, message)}
        target="_blank"
        rel="noreferrer"
        className={buttonClassName({ className: 'mt-7 w-full' })}
      >
        Avisar pelo WhatsApp
      </a>
    </Dialog>
  )
}
