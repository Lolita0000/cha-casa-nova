import { Container } from '@/components/ui/Container'
import type { RoomWithGifts } from '@/data/selectors'

import { RoomSection } from './RoomSection'
import type { GiftActions } from './types'

interface GiftListProps extends GiftActions {
  giftsByRoom: RoomWithGifts[]
}

export function GiftList({ giftsByRoom, onGive, onReserve }: GiftListProps) {
  return (
    <section aria-labelledby="gift-list-title" className="py-20 md:py-28">
      <Container>
        <h2 id="gift-list-title" className="font-display text-4xl text-ink-800 sm:text-5xl">
          A lista
        </h2>
        <p className="mt-4 mb-12 max-w-[60ch] text-ash-600">
          Os valores são uma referência do quanto cada coisa custa. Os itens com barra são os mais
          caros: dá pra ajudar com uma parte ou, se preferir, dar ele inteiro.
        </p>

        {giftsByRoom.length > 0 ? (
          giftsByRoom.map(({ room, gifts }) => (
            <RoomSection
              key={room.id}
              room={room}
              gifts={gifts}
              onGive={onGive}
              onReserve={onReserve}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-ash-400 p-8 text-ash-600">
            A lista ainda está sendo montada. Volte daqui a pouquinho.
          </p>
        )}
      </Container>
    </section>
  )
}
