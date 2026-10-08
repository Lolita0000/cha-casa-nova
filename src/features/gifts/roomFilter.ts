import type { RoomWithGifts } from '@/data/selectors'
import type { RoomId } from '@/types/gift'

export type RoomFilterValue = RoomId | 'all'

export interface RoomFilterOption {
  value: RoomFilterValue
  label: string
  count: number
}

export function buildRoomFilterOptions(giftsByRoom: RoomWithGifts[]): RoomFilterOption[] {
  const total = giftsByRoom.reduce((sum, { gifts }) => sum + gifts.length, 0)
  return [
    { value: 'all', label: 'Tudo', count: total },
    ...giftsByRoom.map(({ room, gifts }) => ({
      value: room.id,
      label: room.name,
      count: gifts.length,
    })),
  ]
}

export function filterRooms(giftsByRoom: RoomWithGifts[], value: RoomFilterValue) {
  return value === 'all' ? giftsByRoom : giftsByRoom.filter(({ room }) => room.id === value)
}
