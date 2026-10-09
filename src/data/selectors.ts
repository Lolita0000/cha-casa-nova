import type { Gift, PooledGift, Room } from '@/types/gift'

export interface RoomWithGifts {
  room: Room
  gifts: Gift[]
}

/** Groups gifts by room, keeping room order. Empty rooms are skipped unless they have an empty message. */
export function groupGiftsByRoom(rooms: Room[], gifts: Gift[]): RoomWithGifts[] {
  return rooms
    .map((room) => ({ room, gifts: gifts.filter((gift) => gift.roomId === room.id) }))
    .filter(({ room, gifts }) => gifts.length > 0 || Boolean(room.emptyMessage))
}

export function getProgress(gift: PooledGift): number {
  if (gift.goalInCents <= 0) return 0
  return Math.min(gift.raisedInCents / gift.goalInCents, 1)
}

export function isFunded(gift: PooledGift): boolean {
  return gift.raisedInCents >= gift.goalInCents
}

export function isUnavailable(gift: PooledGift): boolean {
  return Boolean(gift.reservedBy) || isFunded(gift)
}
