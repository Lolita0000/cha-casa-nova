import type { GiftSummary } from './adminStats'
import { formatCents } from '@/lib/format/currency'

interface GiftSummaryListProps {
  summaries: GiftSummary[]
}

export function GiftSummaryList({ summaries }: GiftSummaryListProps) {
  if (summaries.length === 0) {
    return (
      <p className="rounded-[1.5rem] bg-white p-6 text-ash-600">
        Nenhum presente registrado ainda.
      </p>
    )
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {summaries.map((summary) => (
        <li key={summary.giftId} className="rounded-[1.5rem] bg-white p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 font-bold text-ink-900">{summary.giftName}</p>
            {summary.pixInCents > 0 && (
              <p className="shrink-0 font-display text-xl text-rose-700 tabular-nums">
                {formatCents(summary.pixInCents)}
              </p>
            )}
          </div>
          {summary.purchasers.length > 0 && (
            <p className="mt-2 text-sm text-ink-800">
              <span className="font-bold">Vai comprar:</span> {summary.purchasers.join('; ')}
            </p>
          )}
          {summary.pixGivers.length > 0 && (
            <p className="mt-1 text-sm text-ash-600">
              <span className="font-bold">Pix de:</span> {summary.pixGivers.join('; ')}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
