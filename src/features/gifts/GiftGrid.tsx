import { useRef, useState } from 'react'

import type { Gift } from '@/types/gift'

import { PooledGiftCard } from './PooledGiftCard'
import { SimpleGiftCard } from './SimpleGiftCard'
import type { OpenContribution } from './types'

export interface PreviewCount {
  /** Cards shown on phones before "Ver todos", where every card adds a lot of scrolling. */
  phone: number
  /** Cards shown from the small breakpoint up. */
  wide: number
}

interface GiftGridProps {
  gifts: Gift[]
  onContribute: OpenContribution
  preview: PreviewCount
}

/** Gift cards with a short preview and a "Ver todos os presentes" button. */
export function GiftGrid({ gifts, onContribute, preview }: GiftGridProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const gridRef = useRef<HTMLUListElement>(null)
  const count = gifts.length
  const canCollapse = count > preview.phone
  const hiddenOnWide = Math.max(count - preview.wide, 0)

  function visibilityFor(index: number): string {
    if (isExpanded || index < preview.phone) return ''
    return index < preview.wide ? 'max-sm:hidden' : 'hidden'
  }

  function collapse() {
    setIsExpanded(false)
    // Without this the guest would be left far below, past the end of the shorter list.
    const top = gridRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) gridRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <ul ref={gridRef} className="grid scroll-mt-24 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
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
            {isExpanded ? 'Ver menos' : 'Ver todos os presentes'}
          </button>
        </div>
      )}
    </>
  )
}
