import { useRef, useState } from 'react'

import type { Gift } from '@/types/gift'

import { PooledGiftCard } from './PooledGiftCard'
import { SimpleGiftCard } from './SimpleGiftCard'
import type { OpenContribution } from './types'

export interface PreviewCount {
  /** Cards per batch on phones, where every card adds a lot of scrolling. */
  phone: number
  /** Cards per batch from the small breakpoint up. */
  wide: number
}

interface GiftGridProps {
  gifts: Gift[]
  onContribute: OpenContribution
  preview: PreviewCount
}

/**
 * Gift cards shown a few at a time. "Ver mais presentes" adds another batch the
 * size of the preview, and "Ver menos" takes one batch away, so nothing jumps.
 */
export function GiftGrid({ gifts, onContribute, preview }: GiftGridProps) {
  const [extraBatches, setExtraBatches] = useState(0)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const count = gifts.length
  const phoneLimit = preview.phone * (extraBatches + 1)
  const wideLimit = preview.wide * (extraBatches + 1)

  function visibilityFor(index: number): string {
    if (index < phoneLimit) return ''
    return index < wideLimit ? 'max-sm:hidden' : 'hidden'
  }

  const moreVisibility = count > wideLimit ? '' : count > phoneLimit ? 'sm:hidden' : 'hidden'

  function showLess() {
    setExtraBatches((batches) => Math.max(batches - 1, 0))
    // Keep the buttons under the finger instead of leaving the guest further down the page.
    requestAnimationFrame(() => buttonsRef.current?.scrollIntoView({ block: 'nearest' }))
  }

  return (
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

      <div
        ref={buttonsRef}
        className={`mt-5 flex scroll-mb-24 flex-wrap justify-center gap-3 ${
          extraBatches === 0 ? moreVisibility : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setExtraBatches((batches) => batches + 1)}
          className={`${GRID_BUTTON} border-ink-800 bg-white text-ink-800 hover:bg-ink-800 hover:text-white ${moreVisibility}`}
        >
          Ver mais presentes
        </button>
        {extraBatches > 0 && (
          <button
            type="button"
            onClick={showLess}
            className={`${GRID_BUTTON} border-ash-200 bg-transparent text-ash-600 hover:border-ink-800 hover:text-ink-800`}
          >
            Ver menos
          </button>
        )}
      </div>
    </>
  )
}

const GRID_BUTTON = 'h-11 rounded-full border-2 px-6 text-sm font-bold transition-colors'
