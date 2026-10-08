import { useMemo, useState } from 'react'

import type { RoomWithGifts } from '@/data/selectors'

import { buildRoomFilterOptions, filterRooms, type RoomFilterValue } from './roomFilter'

export function useRoomFilter(giftsByRoom: RoomWithGifts[]) {
  const [selected, setSelected] = useState<RoomFilterValue>('all')

  const options = useMemo(() => buildRoomFilterOptions(giftsByRoom), [giftsByRoom])
  const visibleRooms = useMemo(() => filterRooms(giftsByRoom, selected), [giftsByRoom, selected])

  return { options, selected, setSelected, visibleRooms }
}
