import { describe, expect, it } from 'vitest'

import type { RoomWithGifts } from '@/data/selectors'
import type { Gift } from '@/types/gift'

import { buildRoomFilterOptions, filterRooms } from './roomFilter'

function gift(id: string, roomId: Gift['roomId']): Gift {
  return { id, kind: 'simple', roomId, name: id, priceInCents: 1000 }
}

const giftsByRoom: RoomWithGifts[] = [
  { room: { id: 'kitchen', name: 'Cozinha' }, gifts: [gift('a', 'kitchen'), gift('b', 'kitchen')] },
  { room: { id: 'bathroom', name: 'Banheiro' }, gifts: [gift('c', 'bathroom')] },
]

describe('buildRoomFilterOptions', () => {
  it('starts with an "all" option counting every gift', () => {
    expect(buildRoomFilterOptions(giftsByRoom)).toEqual([
      { value: 'all', label: 'Tudo', count: 3 },
      { value: 'kitchen', label: 'Cozinha', count: 2 },
      { value: 'bathroom', label: 'Banheiro', count: 1 },
    ])
  })
})

describe('filterRooms', () => {
  it('returns every room for "all"', () => {
    expect(filterRooms(giftsByRoom, 'all')).toHaveLength(2)
  })

  it('returns only the selected room', () => {
    expect(filterRooms(giftsByRoom, 'bathroom').map(({ room }) => room.id)).toEqual(['bathroom'])
  })

  it('returns nothing for a room without gifts', () => {
    expect(filterRooms(giftsByRoom, 'laundry')).toEqual([])
  })
})
