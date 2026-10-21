import type { RoomWithGifts } from '@/data/selectors'

import { GiftGrid } from './GiftGrid'
import { getRoomAnchor } from './roomAnchor'
import type { OpenContribution } from './types'

type RoomSectionProps = RoomWithGifts & { onContribute: OpenContribution }

const ROOM_PREVIEW = { phone: 4, wide: 6 }

export function RoomSection({ room, gifts, onContribute }: RoomSectionProps) {
  const headingId = `${getRoomAnchor(room.id)}-title`
  const count = gifts.length

  return (
    <section id={getRoomAnchor(room.id)} aria-labelledby={headingId} className="scroll-mt-24 pt-14">
      <div className="mb-6 flex items-baseline gap-3">
        <h3 id={headingId} className="font-display text-3xl text-ink-800 sm:text-4xl">
          {room.name}
        </h3>
        {count > 0 && (
          <span className="text-sm font-semibold text-ash-500">
            {count} {count === 1 ? 'presente' : 'presentes'}
          </span>
        )}
      </div>

      {count === 0 ? (
        <p className="rounded-[1.75rem] border-2 border-dashed border-rose-300 bg-white p-8 text-ash-600">
          {room.emptyMessage}
        </p>
      ) : (
        <GiftGrid gifts={gifts} onContribute={onContribute} preview={ROOM_PREVIEW} />
      )}
    </section>
  )
}
