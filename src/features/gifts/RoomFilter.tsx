import type { RoomFilterOption, RoomFilterValue } from './roomFilterOptions'

interface RoomFilterProps {
  options: RoomFilterOption[]
  value: RoomFilterValue
  onChange: (value: RoomFilterValue) => void
}

export function RoomFilter({ options, value, onChange }: RoomFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por cômodo"
      className="sticky top-[env(safe-area-inset-top,0px)] z-10 -mx-5 bg-ash-50/90 px-5 py-3 backdrop-blur sm:mx-0 sm:px-0"
    >
      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto">
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
    </div>
  )
}
