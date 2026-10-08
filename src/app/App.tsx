import { Footer } from '@/components/layout/Footer'
import { gifts } from '@/data/gifts'
import { rooms } from '@/data/rooms'
import { groupGiftsByRoom } from '@/data/selectors'
import { FreeContribution } from '@/features/free-contribution/FreeContribution'
import { GiftDialog } from '@/features/gifts/GiftDialog'
import { GiftList } from '@/features/gifts/GiftList'
import { useGiftDialog } from '@/features/gifts/useGiftDialog'
import { Hero } from '@/features/hero/Hero'
import { HowItWorks } from '@/features/how-it-works/HowItWorks'

const giftsByRoom = groupGiftsByRoom(rooms, gifts)
const activeRoomIds = giftsByRoom.map(({ room }) => room.id)

export function App() {
  const { state, open, close } = useGiftDialog()

  return (
    <>
      <Hero activeRoomIds={activeRoomIds} />
      <main>
        <HowItWorks />
        <GiftList giftsByRoom={giftsByRoom} onOpen={open} />
        <FreeContribution />
      </main>
      <Footer />

      <GiftDialog
        gift={state?.gift ?? null}
        initialTab={state?.initialTab ?? 'pix'}
        onClose={close}
      />
    </>
  )
}
