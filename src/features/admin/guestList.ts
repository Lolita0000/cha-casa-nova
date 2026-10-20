import { joinNames } from '@/features/registry/giverNames'
import type { Rsvp } from '@/features/registry/types'

function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Everyone who said they are coming, once each, in alphabetical order.
 * People sometimes confirm twice, so names are compared ignoring accents and case.
 */
export function doormanList(rsvps: Rsvp[]): string[] {
  const byKey = new Map<string, string>()
  for (const rsvp of rsvps) {
    if (!rsvp.attending) continue
    for (const name of rsvp.guestNames) {
      const key = normalizeName(name)
      if (!byKey.has(key)) byKey.set(key, name)
    }
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export interface GuestSummary {
  attendingCount: number
  notAttendingCount: number
  responseCount: number
}

export function summarizeGuests(rsvps: Rsvp[]): GuestSummary {
  return {
    attendingCount: doormanList(rsvps).length,
    notAttendingCount: rsvps
      .filter((rsvp) => !rsvp.attending)
      .reduce((sum, rsvp) => sum + rsvp.guestNames.length, 0),
    responseCount: rsvps.length,
  }
}

export function doormanText(rsvps: Rsvp[]): string {
  return doormanList(rsvps)
    .map((name, index) => `${index + 1}. ${name}`)
    .join('\n')
}

function csvCell(value: string): string {
  return /[";\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function rsvpsToCsv(rsvps: Rsvp[]): string {
  const header = ['Data', 'Nomes', 'Vai?', 'Recado']
  const rows = rsvps.map((rsvp) => [
    new Date(rsvp.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    joinNames(rsvp.guestNames),
    rsvp.attending ? 'Sim' : 'Não',
    rsvp.message ?? '',
  ])
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\n')
}
