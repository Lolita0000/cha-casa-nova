import { useRef, useState } from 'react'

import type { RoomWithGifts } from '@/data/selectors'

import { PooledGiftCard } from './PooledGiftCard'
import { getRoomAnchor } from './roomAnchor'
import { SimpleGiftCard } from './SimpleGiftCard'
import type { OpenContribution } from './types'

type RoomSectionProps = RoomWithGifts & { onContribute: OpenContribution }

/** Cards shown before "Ver todos". Fewer on phones, where every card adds a lot of scrolling. */
const PREVIEW_COUNT = { phone: 4, wide: 6 }

export function RoomSection({ room, gifts, onContribute }: RoomSectionProps) {
  const headingId = `${getRoomAnchor(room.id)}-title`
  const count = gifts.length
  const [isExpanded, setIsExpanded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const canCollapse = count > PREVIEW_COUNT.phone
  const hiddenOnWide = Math.max(count - PREVIEW_COUNT.wide, 0)

  function visibilityFor(index: number): string {
    if (isExpanded || index < PREVIEW_COUNT.phone) return ''
    return index < PREVIEW_COUNT.wide ? 'max-sm:hidden' : 'hidden'
  }

  function collapse() {
    setIsExpanded(false)
    // Without this the guest would be left far below, in the middle of the next room.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) sectionRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <section
      ref={sectionRef}
      id={getRoomAnchor(room.id)}
      aria-labelledby={headingId}
      className="scroll-mt-24 pt-14"
    >
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
        <>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {gifts.map((gift, index) =>
              gift.kind === 'simple' ? (
                <SimpleGiftCard
                  key={gift.id}
                  gift={gift}
                  onContribute={onContribute}
                  className={visibilityFor(index)}
                />
              ) : (
                <PooledGiftCard
                  key={gift.id}
                  gift={gift}
                  onContribute={onContribute}
                  className={visibilityFor(index)}
                />
              ),
            )}
          </ul>

          {canCollapse && (
            <div
              className={`mt-5 flex justify-center ${!isExpanded && hiddenOnWide === 0 ? 'sm:hidden' : ''}`}
            >
              <button
                type="button"
                onClick={isExpanded ? collapse : () => setIsExpanded(true)}
                aria-expanded={isExpanded}
                className="h-11 rounded-full border-2 border-ink-800 bg-white px-6 text-sm font-bold text-ink-800 transition-colors hover:bg-ink-800 hover:text-white"
              >
                {isExpanded ? 'Ver menos' : `Ver todos os ${count} presentes`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
