import { formatCents } from '@/lib/format/currency'

import type { CartItem } from './cart'

function listItems(items: CartItem[]): string {
  return items
    .map(({ gift, amountInCents }) => `• ${gift.name} (${formatCents(amountInCents)})`)
    .join('\n')
}

export function buildPixSentMessage(items: CartItem[], totalInCents: number): string {
  return `Oi! Mandei um Pix de ${formatCents(totalInCents)} pra casa nova:\n${listItems(items)}`
}

export function buildBuyingMessage(items: CartItem[]): string {
  const names = items.map(({ gift }) => `• ${gift.name}`).join('\n')
  return `Oi! Vou comprar esses presentes pra vocês, podem deixar como reservado?\n${names}`
}

/** Short reference for the payer's bank app, e.g. "3 presentes cha casa nova". */
export function buildPixDescription(items: CartItem[]): string {
  if (items.length === 1) return items[0].gift.name
  return `${items.length} presentes cha casa nova`
}
