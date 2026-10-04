import type { RoomId } from '@/types/gift'

export function getRoomAnchor(roomId: RoomId): string {
  return `comodo-${roomId}`
}
