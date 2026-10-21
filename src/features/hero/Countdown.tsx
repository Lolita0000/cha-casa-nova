import { daysUntil, describeDaysLeft } from '@/lib/date/event'

interface CountdownProps {
  /** Party day, 'YYYY-MM-DD'. */
  date: string
}

/** Days left until the party, as a little tear-off calendar page. */
export function Countdown({ date }: CountdownProps) {
  const days = daysUntil(date)
  if (days < 0) return null

  const isToday = days === 0

  return (
    <div
      role="img"
      aria-label={describeDaysLeft(days)}
      className="relative w-20 rotate-3 rounded-2xl bg-white text-center shadow-[0_5px_0_var(--color-rose-200)] sm:w-24"
    >
      {/* Binder rings */}
      <span className="absolute -top-1.5 left-4 h-3.5 w-1.5 rounded-full bg-ink-800 sm:left-5" />
      <span className="absolute -top-1.5 right-4 h-3.5 w-1.5 rounded-full bg-ink-800 sm:right-5" />

      <p className="rounded-t-2xl bg-rose-400 knit pt-2.5 pb-1 text-[0.65rem] font-extrabold tracking-[0.18em] text-white uppercase">
        {isToday ? 'chegou' : 'faltam'}
      </p>
      {isToday ? (
        <p className="px-1 py-3 font-display text-xl leading-tight text-ink-900">É hoje!</p>
      ) : (
        <>
          <p className="pt-2 font-display text-4xl leading-none text-ink-900 tabular-nums sm:text-5xl">
            {days}
          </p>
          <p className="pt-1 pb-2.5 text-xs font-bold text-rose-700">
            {days === 1 ? 'dia' : 'dias'}
          </p>
        </>
      )}
    </div>
  )
}
