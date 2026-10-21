import { useEffect, useState } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { useCart } from '@/features/cart/useCart'
import { GiftConfirmation } from '@/features/registry/GiftConfirmation'
import { useGiftStatus } from '@/features/registry/useGiftStatus'
import { CHECKOUT_RETURN_PARAMS, readCheckoutReturn } from '@/lib/infinitepay/checkout'

import {
  clearPendingCardPayment,
  loadPendingCardPayment,
  type PendingCardPayment,
} from './pendingCardPayment'

interface ReturnedPayment {
  pending: PendingCardPayment
  receiptUrl: string | undefined
}

/** Matches the redirect from InfinitePay with the payment the guest started here. */
function readReturnedPayment(): ReturnedPayment | null {
  const returned = readCheckoutReturn(window.location.search)
  const pending = loadPendingCardPayment()
  if (!returned || !pending || pending.orderNsu !== returned.orderNsu) return null
  return { pending, receiptUrl: returned.receiptUrl ?? undefined }
}

/** Removes InfinitePay's parameters so a reload doesn't reopen the dialog. */
function cleanAddressBar() {
  const url = new URL(window.location.href)
  const params = [...CHECKOUT_RETURN_PARAMS, 'pagamento']
  if (!params.some((param) => url.searchParams.has(param))) return
  params.forEach((param) => url.searchParams.delete(param))
  window.history.replaceState(null, '', url)
}

/** After paying by card the guest lands back here to sign the gift. */
export function CardPaymentReturn() {
  const [payment, setPayment] = useState(readReturnedPayment)
  const { clear } = useCart()
  const { refresh } = useGiftStatus()

  useEffect(cleanAddressBar, [])

  if (!payment) return null

  return (
    <Dialog open onClose={() => setPayment(null)} title="Pagamento feito!">
      <p className="-mt-2 mb-6 text-ash-600">
        Obrigado! Agora é só deixar seu nome pra gente saber de quem veio.
      </p>
      <GiftConfirmation
        items={payment.pending.items}
        defaultMethod="card"
        allowPurchase={false}
        receiptUrl={payment.receiptUrl}
        onConfirmed={() => {
          clearPendingCardPayment()
          if (payment.pending.fromCart) clear()
          refresh()
        }}
      />
    </Dialog>
  )
}
