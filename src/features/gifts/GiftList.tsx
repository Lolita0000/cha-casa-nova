import { Container } from '@/components/ui/Container'
import type { RoomWithGifts } from '@/data/selectors'

import { RoomNav } from './RoomNav'
import { RoomSection } from './RoomSection'
import type { OpenGiftDialog } from './types'

interface GiftListProps {
  giftsByRoom: RoomWithGifts[]
  onOpen: OpenGiftDialog
}

export function GiftList({ giftsByRoom, onOpen }: GiftListProps) {
  return (
    <section id="lista" aria-labelledby="gift-list-title" className="pt-20 pb-24 md:pt-28">
      <Container>
        <h2 id="gift-list-title" className="font-display text-5xl text-ink-800 sm:text-6xl">
          A nossa listinha
        </h2>
        <p className="mt-4 mb-8 max-w-[58ch] text-lg text-ash-600">
          Separada por cômodo. Os valores são uma referência do quanto cada coisa custa, e os cards
          cinza são os itens maiores, que vamos juntando aos poucos.
        </p>

        {giftsByRoom.length > 0 ? (
          <>
            <RoomNav rooms={giftsByRoom.map(({ room }) => room)} />
            {giftsByRoom.map(({ room, gifts }) => (
              <RoomSection key={room.id} room={room} gifts={gifts} onOpen={onOpen} />
            ))}
          </>
        ) : (
          <p className="rounded-[1.75rem] border-2 border-dashed border-rose-300 bg-white p-8 text-ash-600">
            A lista ainda está sendo montada. Volte daqui a pouquinho.
          </p>
        )}
      </Container>
    </section>
  )
}
