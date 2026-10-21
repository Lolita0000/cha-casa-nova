/**
 * InfinitePay checkout: creates a one-off payment page for an exact amount.
 * Only the account handle (InfiniteTag) is needed, no secret key, so it can be
 * called straight from the browser. "Checkout externo" must be enabled in the
 * InfinitePay app for the handle.
 */
const API_URL = 'https://api.checkout.infinitepay.io/links'

export interface CheckoutItem {
  description: string
  priceInCents: number
  quantity?: number
}

export interface CheckoutRequest {
  handle: string
  items: CheckoutItem[]
  /** Our id for the order; comes back in the redirect. */
  orderNsu: string
  /** Where the guest lands after paying. InfinitePay appends the receipt to it. */
  redirectUrl: string
}

/** The handle is the InfiniteTag without the leading `$`. */
export function normalizeHandle(handle: string): string {
  return handle.trim().replace(/^\$/, '')
}

export function buildCheckoutBody(request: CheckoutRequest) {
  return {
    handle: normalizeHandle(request.handle),
    order_nsu: request.orderNsu,
    redirect_url: request.redirectUrl,
    items: request.items.map((item) => ({
      quantity: item.quantity ?? 1,
      price: item.priceInCents,
      description: item.description.slice(0, 100),
    })),
  }
}

/** Finds the checkout address in the response, whatever key it comes under. */
export function findCheckoutUrl(response: unknown): string | null {
  if (typeof response === 'string') {
    return /^https:\/\/\S+$/.test(response) ? response : null
  }
  if (!response || typeof response !== 'object') return null
  const record = response as Record<string, unknown>
  for (const key of ['url', 'link', 'checkout_url', 'payment_url']) {
    const value = record[key]
    if (typeof value === 'string' && value.startsWith('https://')) return value
  }
  for (const value of Object.values(record)) {
    const nested = findCheckoutUrl(value)
    if (nested) return nested
  }
  return null
}

export async function createCheckoutLink(request: CheckoutRequest): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildCheckoutBody(request)),
  })
  const data: unknown = await response.json().catch(() => null)
  const url = response.ok ? findCheckoutUrl(data) : null
  if (!url) {
    const message =
      data && typeof data === 'object' && 'message' in data ? String(data.message) : ''
    throw new Error(message || 'Não conseguimos abrir o pagamento com cartão agora.')
  }
  return url
}

/** What InfinitePay adds to the redirect address after a payment. */
export interface CheckoutReturn {
  orderNsu: string
  receiptUrl: string | null
  transactionNsu: string | null
}

export function readCheckoutReturn(search: string): CheckoutReturn | null {
  const params = new URLSearchParams(search)
  const orderNsu = params.get('order_nsu')
  if (!orderNsu) return null
  const receiptUrl = params.get('receipt_url')
  return {
    orderNsu,
    receiptUrl: receiptUrl && /^https:\/\/\S+$/.test(receiptUrl) ? receiptUrl : null,
    transactionNsu: params.get('transaction_nsu'),
  }
}

export const CHECKOUT_RETURN_PARAMS = [
  'order_nsu',
  'receipt_url',
  'transaction_nsu',
  'slug',
  'capture_method',
]
