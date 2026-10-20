import { describe, expect, it } from 'vitest'

import { buildNotifyMessage, buildPixDescription } from './messages'
import type { GiftRecordItemInput } from './types'

const items: GiftRecordItemInput[] = [
  { giftId: 'a', giftName: 'Jarra', amountInCents: 3999 },
  { giftId: 'b', giftName: 'Toalhas', amountInCents: 25670 },
]

const normalize = (text: string) => text.replace(/\s/g, ' ')

describe('buildNotifyMessage', () => {
  it('signs a pix with every name and lists the amounts', () => {
    const message = normalize(buildNotifyMessage('pix', ['Tia Rosa', 'Tio Beto'], items))
    expect(message).toContain('Aqui é Tia Rosa e Tio Beto.')
    expect(message).toContain('Mandei um Pix de R$ 296,69')
    expect(message).toContain('Jarra (R$ 39,99)')
  })

  it('asks to reserve the items the guest will buy', () => {
    const message = buildNotifyMessage('purchase', ['Ana'], items)
    expect(message).toContain('podem deixar como reservado?\n• Jarra\n• Toalhas')
  })
})

describe('buildPixDescription', () => {
  it('uses the gift name for a single item', () => {
    expect(buildPixDescription(items.slice(0, 1))).toBe('Jarra')
    expect(buildPixDescription(items)).toBe('2 presentes cha casa nova')
  })
})
