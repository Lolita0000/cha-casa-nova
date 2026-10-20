const TIME_ZONE = 'America/Sao_Paulo'
const MS_PER_DAY = 1000 * 60 * 60 * 24

/** A calendar day, 'YYYY-MM-DD'. Event dates are days, not instants, so they never shift with time zones. */
export type IsoDate = string

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const isoDayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })

function toUtcMidnight(day: IsoDate): number {
  const [year, month, date] = day.split('-').map(Number)
  return Date.UTC(year, month - 1, date)
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "Sábado, 21 de novembro" */
export function formatEventDate(day: IsoDate): string {
  return capitalize(longDateFormatter.format(toUtcMidnight(day)))
}

/** "14 de novembro" */
export function formatShortDate(day: IsoDate): string {
  return shortDateFormatter.format(toUtcMidnight(day))
}

/** "15:00" becomes "15h", "15:30" stays "15h30". */
export function formatEventTime(time: string): string {
  const [hours, minutes] = time.split(':')
  return minutes === '00' ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`
}

/** Today's date in Brasília, whatever the guest's device time zone. */
export function todayInSaoPaulo(now: Date = new Date()): IsoDate {
  return isoDayFormatter.format(now)
}

export function addDays(day: IsoDate, amount: number): IsoDate {
  return new Date(toUtcMidnight(day) + amount * MS_PER_DAY).toISOString().slice(0, 10)
}

/** Whole calendar days from today until the given day, never negative. */
export function daysUntil(day: IsoDate, now: Date = new Date()): number {
  const diff = (toUtcMidnight(day) - toUtcMidnight(todayInSaoPaulo(now))) / MS_PER_DAY
  return Math.max(Math.round(diff), 0)
}

export function describeDaysLeft(days: number): string {
  if (days === 0) return 'É hoje!'
  if (days === 1) return 'É amanhã!'
  return `Faltam ${days} dias`
}

/** True until the end of the deadline day, Brasília time. */
export function isOnOrBefore(deadline: IsoDate, now: Date = new Date()): boolean {
  return todayInSaoPaulo(now) <= deadline
}
