import type { GiftRecord, Rsvp } from '@/features/registry/types'

export interface Letter {
  id: string
  source: 'gift' | 'rsvp'
  createdAt: string
  names: string[]
  /** What the letter came with: the gifts, or the presence answer. */
  context: string
  text: string
}

/** Every message guests left, newest first. Cancelled gifts are left out. */
export function collectLetters(records: GiftRecord[], rsvps: Rsvp[]): Letter[] {
  const fromGifts = records
    .filter((record) => record.message && record.status !== 'cancelled')
    .map<Letter>((record) => ({
      id: `gift-${record.id}`,
      source: 'gift',
      createdAt: record.createdAt,
      names: record.giverNames,
      context: record.items.map((item) => item.giftName).join(', '),
      text: record.message ?? '',
    }))

  const fromRsvps = rsvps
    .filter((rsvp) => rsvp.message)
    .map<Letter>((rsvp) => ({
      id: `rsvp-${rsvp.id}`,
      source: 'rsvp',
      createdAt: rsvp.createdAt,
      names: rsvp.guestNames,
      context: rsvp.attending ? 'Junto com a confirmação de presença' : 'Avisou que não vai',
      text: rsvp.message ?? '',
    }))

  return [...fromGifts, ...fromRsvps].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function countNewLetters(letters: Letter[], lastSeenAt: string | null): number {
  if (!lastSeenAt) return letters.length
  return letters.filter((letter) => letter.createdAt > lastSeenAt).length
}
