import { Button } from '@/components/ui/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { formatCents } from '@/lib/format/currency'

import { PixQrCode } from './PixQrCode'
import { usePixPayload } from './usePixPayload'

interface PixPaymentProps {
  /** Leave undefined to let the guest type the amount in their bank app. */
  amountInCents?: number
  description?: string
}

export function PixPayment({ amountInCents, description }: PixPaymentProps) {
  const payload = usePixPayload(amountInCents, description)
  const { copy, hasCopied } = useCopyToClipboard()

  return (
    <div className="grid items-center gap-5 sm:grid-cols-[10rem_1fr]">
      <div className="mx-auto rounded-3xl bg-rose-100 p-3">
        <PixQrCode payload={payload} className="w-36 rounded-2xl" />
      </div>
      <div className="text-center sm:text-left">
        <p className="text-ash-600">
          {amountInCents
            ? `Aponte a câmera do app do banco ou copie o código. O valor de ${formatCents(amountInCents)} já vem preenchido.`
            : 'Aponte a câmera do app do banco ou copie o código e digite o valor que quiser.'}
        </p>
        <Button size="sm" onClick={() => copy(payload)} className="mt-4">
          {hasCopied ? 'Código copiado!' : 'Copiar código Pix'}
        </Button>
        <p className="sr-only" aria-live="polite">
          {hasCopied ? 'Código Pix copiado' : ''}
        </p>
      </div>
    </div>
  )
}
