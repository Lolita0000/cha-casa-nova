import { describe, expect, it } from 'vitest'

import { buildCheckoutBody, findCheckoutUrl, normalizeHandle, readCheckoutReturn } from './checkout'

describe('InfinitePay checkout', () => {
  it('drops the dollar sign from the InfiniteTag', () => {
    expect(normalizeHandle(' $aninha ')).toBe('aninha')
  })

  it('sends prices in cents with a default quantity', () => {
    const body = buildCheckoutBody({
      handle: '$aninha',
      orderNsu: 'abc',
      redirectUrl: 'https://example.com/?pagamento=cartao',
      items: [{ description: 'Toalhas', priceInCents: 25670 }],
    })
    expect(body).toEqual({
      handle: 'aninha',
      order_nsu: 'abc',
      redirect_url: 'https://example.com/?pagamento=cartao',
      items: [{ quantity: 1, price: 25670, description: 'Toalhas' }],
    })
  })

  it('finds the checkout address under any key', () => {
    expect(findCheckoutUrl({ url: 'https://checkout.infinitepay.io/a' })).toBe(
      'https://checkout.infinitepay.io/a',
    )
    expect(findCheckoutUrl({ data: { link: 'https://checkout.infinitepay.io/b' } })).toBe(
      'https://checkout.infinitepay.io/b',
    )
    expect(findCheckoutUrl({ success: false })).toBeNull()
  })

  it('reads the receipt from the redirect', () => {
    expect(
      readCheckoutReturn(
        '?pagamento=cartao&order_nsu=abc&receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2Fx&transaction_nsu=9',
      ),
    ).toEqual({
      orderNsu: 'abc',
      receiptUrl: 'https://recibo.infinitepay.io/x',
      transactionNsu: '9',
    })
    expect(
      readCheckoutReturn('?receipt_url=javascript:alert(1)&order_nsu=a')?.receiptUrl,
    ).toBeNull()
    expect(readCheckoutReturn('')).toBeNull()
  })
})
