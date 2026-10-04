import { rooms } from '@/data/rooms'
import { gifts } from '@/data/gifts'
import { groupGiftsByRoom } from '@/data/selectors'
import { Hero } from '@/features/hero/Hero'

const giftsByRoom = groupGiftsByRoom(rooms, gifts)
const activeRoomIds = giftsByRoom.map(({ room }) => room.id)

export function App() {
  return (
    <>
      <Hero activeRoomIds={activeRoomIds} />
      <main />
    </>
  )
}
