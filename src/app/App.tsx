import { Footer } from '@/components/layout/Footer'
import { rooms } from '@/data/rooms'
import { gifts } from '@/data/gifts'
import { groupGiftsByRoom } from '@/data/selectors'
import { FreeContribution } from '@/features/free-contribution/FreeContribution'
import { GiftList } from '@/features/gifts/GiftList'
import { GiveGiftDialog } from '@/features/gifts/GiveGiftDialog'
import { ReserveGiftDialog } from '@/features/gifts/ReserveGiftDialog'
import { useGiftDialogs } from '@/features/gifts/useGiftDialogs'
import { Hero } from '@/features/hero/Hero'
import { HowItWorks } from '@/features/how-it-works/HowItWorks'

const giftsByRoom = groupGiftsByRoom(rooms, gifts)
const activeRoomIds = giftsByRoom.map(({ room }) => room.id)

export function App() {
  const { giftToGive, giftToReserve, openGive, openReserve, close } = useGiftDialogs()

  return (
    <>
      <Hero activeRoomIds={activeRoomIds} />
      <main>
        <HowItWorks />
        <GiftList giftsByRoom={giftsByRoom} onGive={openGive} onReserve={openReserve} />
        <FreeContribution />
      </main>
      <Footer />

      <GiveGiftDialog gift={giftToGive} onClose={close} />
      <ReserveGiftDialog gift={giftToReserve} onClose={close} />
    </>
  )
}
