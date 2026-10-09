import type { RoomWithGifts } from '@/data/selectors'

import { PooledGiftCard } from './PooledGiftCard'
import { getRoomAnchor } from './roomAnchor'
import { SimpleGiftCard } from './SimpleGiftCard'
import type { OpenContribution } from './types'

type RoomSectionProps = RoomWithGifts & { onContribute: OpenContribution }

export function RoomSection({ room, gifts, onContribute }: RoomSectionProps) {
  const headingId = `${getRoomAnchor(room.id)}-title`
  const count = gifts.length

  return (
    <section id={getRoomAnchor(room.id)} aria-labelledby={headingId} className="scroll-mt-24 pt-14">
      <div className="mb-6 flex items-baseline gap-3">
        <h3 id={headingId} className="font-display text-3xl text-ink-800 sm:text-4xl">
          {room.name}
        </h3>
        <span className="text-sm font-semibold text-ash-500">
          {count} {count === 1 ? 'presente' : 'presentes'}
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) =>
          gift.kind === 'simple' ? (
            <SimpleGiftCard key={gift.id} gift={gift} onContribute={onContribute} />
          ) : (
            <PooledGiftCard key={gift.id} gift={gift} onContribute={onContribute} />
          ),
        )}
      </ul>
    </section>
  )
}
