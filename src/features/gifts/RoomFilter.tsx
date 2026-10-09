import { useEffect, useRef } from 'react'

import { ChevronIcon } from '@/components/icons/icons'
import { useScrollEdges } from '@/hooks/useScrollEdges'

import type { RoomFilterOption, RoomFilterValue } from './roomFilterOptions'

interface RoomFilterProps {
  options: RoomFilterOption[]
  value: RoomFilterValue
  onChange: (value: RoomFilterValue) => void
}

export function RoomFilter({ options, value, onChange }: RoomFilterProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const { canScrollStart, canScrollEnd } = useScrollEdges(listRef)

  // Keep the selected chip in view, scrolling only the chip row and never the page.
  useEffect(() => {
    const list = listRef.current
    const chip = list?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!list || !chip) return

    const chipStart = chip.offsetLeft - list.offsetLeft
    const chipEnd = chipStart + chip.offsetWidth
    const padding = 48
    if (chipStart < list.scrollLeft + padding) {
      list.scrollTo({ left: chipStart - padding, behavior: 'smooth' })
    } else if (chipEnd > list.scrollLeft + list.clientWidth - padding) {
      list.scrollTo({ left: chipEnd - list.clientWidth + padding, behavior: 'smooth' })
    }
  }, [value])

  function scrollBy(direction: 1 | -1) {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * list.clientWidth * 0.7, behavior: 'smooth' })
  }

  return (
    <div
      role="group"
      aria-label="Filtrar por cômodo"
      className="sticky top-[env(safe-area-inset-top,0px)] z-10 -mx-5 bg-ash-50/90 py-3 backdrop-blur sm:mx-0"
    >
      <div className="relative">
        <ul
          ref={listRef}
          className="flex [scrollbar-width:none] gap-2 overflow-x-auto scroll-smooth px-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange(option.value)}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
                    isSelected
                      ? 'border-ink-800 bg-ink-800 text-white'
                      : 'border-ash-200 bg-white text-ink-800 hover:border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  {option.label}
                  <span
                    className={`rounded-full px-1.5 text-xs tabular-nums ${
                      isSelected ? 'bg-white/20' : 'bg-ash-100 text-ash-600'
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {canScrollStart && <ScrollHint side="start" onClick={() => scrollBy(-1)} />}
        {canScrollEnd && <ScrollHint side="end" onClick={() => scrollBy(1)} />}
      </div>

      {canScrollEnd && !canScrollStart && (
        <p className="mt-2 px-5 text-xs font-semibold text-ash-500 sm:px-0">
          Deslize pro lado pra ver todos os cômodos
        </p>
      )}
    </div>
  )
}

interface ScrollHintProps {
  side: 'start' | 'end'
  onClick: () => void
}

/** Fades the clipped edge and offers a button that scrolls to the hidden chips. */
function ScrollHint({ side, onClick }: ScrollHintProps) {
  const isEnd = side === 'end'

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 flex w-20 items-center ${
        isEnd
          ? 'right-0 justify-end bg-gradient-to-l from-ash-50 via-ash-50/90 to-transparent pr-2'
          : 'left-0 justify-start bg-gradient-to-r from-ash-50 via-ash-50/90 to-transparent pl-2'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={isEnd ? 'Ver mais cômodos' : 'Voltar pros primeiros cômodos'}
        className="pointer-events-auto grid size-9 place-items-center rounded-full bg-ink-800 text-white shadow-md"
      >
        <ChevronIcon className={`size-4 ${isEnd ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
