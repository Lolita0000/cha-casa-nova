import { describe, expect, it } from 'vitest'

import type { CartItem } from './cart'
import { buildBuyingMessage, buildPixDescription, buildPixSentMessage } from './messages'

const items: CartItem[] = [
  {
    gift: { id: 'a', kind: 'simple', roomId: 'kitchen', name: 'Jarra', priceInCents: 3999 },
    amountInCents: 3999,
  },
  {
    gift: { id: 'b', kind: 'simple', roomId: 'bathroom', name: 'Toalhas', priceInCents: 25670 },
    amountInCents: 25670,
  },
]

const normalize = (text: string) => text.replace(/\s/g, ' ')

describe('cart messages', () => {
  it('lists every item with its amount after a pix', () => {
    const message = normalize(buildPixSentMessage(items, 29669))
    expect(message).toContain('R$ 296,69')
    expect(message).toContain('Jarra (R$ 39,99)')
    expect(message).toContain('Toalhas (R$ 256,70)')
  })

  it('lists the items the guest will buy', () => {
    expect(buildBuyingMessage(items)).toContain('• Jarra\n• Toalhas')
  })

  it('uses the gift name as pix description for a single item', () => {
    expect(buildPixDescription(items.slice(0, 1))).toBe('Jarra')
    expect(buildPixDescription(items)).toBe('2 presentes cha casa nova')
  })
})
