import { buttonClassName } from '@/components/ui/buttonStyles'
import { Button } from '@/components/ui/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { formatCents } from '@/lib/format/currency'

import { PixQrCode } from './PixQrCode'
import { usePixPayload } from './usePixPayload'

interface PaymentOptionsProps {
  /** Leave undefined to let the guest type the amount in their bank app. */
  amountInCents?: number
  description?: string
  cardPaymentUrl?: string
}

export function PaymentOptions({
  amountInCents,
  description,
  cardPaymentUrl,
}: PaymentOptionsProps) {
  const payload = usePixPayload(amountInCents, description)
  const { copy, hasCopied } = useCopyToClipboard()

  return (
    <div className="space-y-6">
      <div className="grid items-center gap-5 sm:grid-cols-[9rem_1fr]">
        <PixQrCode payload={payload} className="mx-auto w-40 sm:w-36" />
        <div>
          <p className="font-medium text-ink-900">Pix</p>
          <p className="mt-1 text-sm text-ash-600">
            {amountInCents
              ? `Aponte a câmera ou copie o código. O valor de ${formatCents(amountInCents)} já vem preenchido.`
              : 'Aponte a câmera ou copie o código e digite o valor no app do banco.'}
          </p>
          <Button size="sm" variant="secondary" onClick={() => copy(payload)} className="mt-3">
            {hasCopied ? 'Código copiado' : 'Copiar código Pix'}
          </Button>
          <p className="sr-only" aria-live="polite">
            {hasCopied ? 'Código Pix copiado' : ''}
          </p>
        </div>
      </div>

      {cardPaymentUrl && (
        <div className="border-t border-ash-200 pt-5">
          <p className="font-medium text-ink-900">Cartão</p>
          <p className="mt-1 text-sm text-ash-600">
            Abre a página de pagamento segura numa nova aba. Dá pra parcelar.
          </p>
          <a
            href={cardPaymentUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ size: 'sm', className: 'mt-3' })}
          >
            Pagar com cartão
          </a>
        </div>
      )}
    </div>
  )
}
