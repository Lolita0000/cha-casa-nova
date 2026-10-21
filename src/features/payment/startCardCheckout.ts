import { siteConfig } from '@/config/site'
import type { GiftRecordItemInput } from '@/features/registry/types'
import { createCheckoutLink } from '@/lib/infinitepay/checkout'

import { savePendingCardPayment } from './pendingCardPayment'

export const isCardPaymentEnabled = siteConfig.infinitePayHandle.trim() !== ''

/** Where InfinitePay sends the guest back: this same page, without the hash. */
function returnUrl(): string {
  return `${window.location.origin}${window.location.pathname}?pagamento=cartao`
}

/** Creates the card payment page for these items and takes the guest there. */
export async function startCardCheckout(
  items: GiftRecordItemInput[],
  { fromCart }: { fromCart: boolean },
): Promise<void> {
  const orderNsu = crypto.randomUUID()
  const url = await createCheckoutLink({
    handle: siteConfig.infinitePayHandle,
    orderNsu,
    redirectUrl: returnUrl(),
    items: items.map((item) => ({ description: item.giftName, priceInCents: item.amountInCents })),
  })
  savePendingCardPayment({ orderNsu, items, fromCart, createdAt: new Date().toISOString() })
  window.location.assign(url)
}
