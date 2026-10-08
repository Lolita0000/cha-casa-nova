import type { RoomWithGifts } from '@/data/selectors'

import { PooledGiftCard } from './PooledGiftCard'
import { getRoomAnchor } from './roomAnchor'
import { SimpleGiftRow } from './SimpleGiftRow'
import type { GiftActions } from './types'

type RoomSectionProps = RoomWithGifts & GiftActions

export function RoomSection({ room, gifts, onGive, onReserve }: RoomSectionProps) {
  const headingId = `${getRoomAnchor(room.id)}-title`

  return (
    <section
      id={getRoomAnchor(room.id)}
      aria-labelledby={headingId}
      className="scroll-mt-6 border-t border-ink-800 py-10 md:grid md:grid-cols-[13rem_1fr] md:gap-10"
    >
      <div className="mb-4 md:mb-0">
        <h3 id={headingId} className="font-display text-3xl text-ink-800 md:sticky md:top-8">
          {room.name}
        </h3>
      </div>

      <ul>
        {gifts.map((gift) =>
          gift.kind === 'simple' ? (
            <SimpleGiftRow key={gift.id} gift={gift} onGive={onGive} />
          ) : (
            <PooledGiftCard key={gift.id} gift={gift} onContribute={onGive} onReserve={onReserve} />
          ),
        )}
      </ul>
    </section>
  )
}
