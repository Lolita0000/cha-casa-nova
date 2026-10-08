import { useId, useRef } from 'react'

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
  const codeRef = useRef<HTMLTextAreaElement>(null)
  const codeId = useId()

  async function handleCopy() {
    const copied = await copy(payload)
    // Some browsers and in-app views block the clipboard: select the code so it can be copied by hand.
    if (!copied) codeRef.current?.select()
  }

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
        <Button size="sm" onClick={handleCopy} className="mt-4">
          {hasCopied ? 'Código copiado!' : 'Copiar código Pix'}
        </Button>
        <p className="sr-only" aria-live="polite">
          {hasCopied ? 'Código Pix copiado' : ''}
        </p>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={codeId} className="text-xs font-bold text-ash-600">
          Pix copia e cola
        </label>
        <textarea
          ref={codeRef}
          id={codeId}
          readOnly
          rows={2}
          value={payload}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-1 w-full resize-none rounded-2xl bg-ash-50 px-3 py-2 font-mono text-xs break-all text-ash-700 outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
    </div>
  )
}
