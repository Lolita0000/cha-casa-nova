import { CardPayment } from './CardPayment'
import { PixPayment } from './PixPayment'

interface PaymentOptionsProps {
  amountInCents?: number
  description?: string
  cardPaymentUrl?: string
}

/** Pix and card stacked together, for places that don't use tabs. */
export function PaymentOptions({
  amountInCents,
  description,
  cardPaymentUrl,
}: PaymentOptionsProps) {
  return (
    <div className="space-y-6">
      <PixPayment amountInCents={amountInCents} description={description} />
      {cardPaymentUrl && (
        <div className="border-t border-ash-200 pt-6">
          <CardPayment url={cardPaymentUrl} />
        </div>
      )}
    </div>
  )
}
