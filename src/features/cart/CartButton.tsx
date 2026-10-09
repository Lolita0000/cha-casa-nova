import { BagIcon } from '@/components/icons/icons'
import { formatCents } from '@/lib/format/currency'

import { useCart } from './useCart'

export function CartButton() {
  const { items, totalInCents, open } = useCart()

  if (items.length === 0) return null

  return (
    <button
      type="button"
      onClick={open}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-20 flex items-center gap-3 rounded-full bg-ink-800 py-2 pr-5 pl-2 text-white shadow-[0_16px_40px_-12px] shadow-ink-900/60 transition-colors hover:bg-ink-700 sm:right-8 sm:bottom-8"
    >
      {/* Keyed on the count so the bump replays every time a gift is added. */}
      <span
        key={items.length}
        className="relative grid size-11 animate-[cart-bump_350ms_ease-out] place-items-center rounded-full bg-rose-200 text-ink-900"
      >
        <BagIcon className="size-5" />
        <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[11px] font-bold text-white tabular-nums">
          {items.length}
        </span>
      </span>
      <span className="text-left leading-tight">
        <span className="block text-xs text-ash-100">Ver carrinho</span>
        <span className="block font-bold tabular-nums">{formatCents(totalInCents)}</span>
      </span>
    </button>
  )
}
