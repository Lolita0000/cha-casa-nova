import { describe, expect, it } from 'vitest'

import type { Gift, Room } from '@/types/gift'

import { groupGiftsByRoom } from './selectors'

const rooms: Room[] = [
  { id: 'kitchen', name: 'Cozinha' },
  { id: 'laundry', name: 'Lavanderia' },
  { id: 'gabriel', name: 'Gabriel', emptyMessage: 'Em breve' },
]

const gifts: Gift[] = [
  { id: 'jar', kind: 'simple', roomId: 'kitchen', name: 'Jarra', priceInCents: 3999 },
]

describe('groupGiftsByRoom', () => {
  it('keeps room order, skips empty rooms and keeps rooms with an empty message', () => {
    expect(
      groupGiftsByRoom(rooms, gifts).map(({ room, gifts }) => [room.id, gifts.length]),
    ).toEqual([
      ['kitchen', 1],
      ['gabriel', 0],
    ])
  })
})
