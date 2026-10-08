const MS_PER_DAY = 1000 * 60 * 60 * 24

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Sao_Paulo',
})

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

export function formatEventDate(date: Date): string {
  const text = longDateFormatter.format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatEventTime(date: Date): string {
  return timeFormatter.format(date).replace(':', 'h')
}

/** Whole days left until the event, never negative. */
export function daysUntil(date: Date, now: Date = new Date()): number {
  return Math.max(Math.ceil((date.getTime() - now.getTime()) / MS_PER_DAY), 0)
}

export function describeDaysLeft(days: number): string {
  if (days === 0) return 'É hoje!'
  if (days === 1) return 'É amanhã!'
  return `Faltam ${days} dias`
}
