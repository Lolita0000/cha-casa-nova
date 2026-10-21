import { siteConfig } from '@/config/site'
import { formatCents } from '@/lib/format/currency'

import { joinNames } from './giverNames'
import type { GiftMethod, GiftRecordItemInput } from './types'

const coupleNames = joinNames([...siteConfig.coupleNames])

export function buildNotifyMessage(
  method: GiftMethod,
  giverNames: string[],
  items: GiftRecordItemInput[],
): string {
  const greeting = `Oi, ${coupleNames}! Aqui é ${joinNames(giverNames)}.`

  if (method !== 'purchase') {
    const total = items.reduce((sum, item) => sum + item.amountInCents, 0)
    const lines = items.map((item) => `• ${item.giftName} (${formatCents(item.amountInCents)})`)
    const how = method === 'pix' ? 'um Pix' : 'um presente no cartão'
    return `${greeting} Mandei ${how} de ${formatCents(total)} pra casa nova:\n${lines.join('\n')}`
  }

  const lines = items.map((item) => `• ${item.giftName}`)
  return `${greeting} Vou comprar esses presentes pra vocês, podem deixar como reservado?\n${lines.join('\n')}`
}

/** Short reference shown in the payer's bank app. */
export function buildPixDescription(items: { giftName: string }[]): string {
  if (items.length === 1) return items[0].giftName
  return `${items.length} presentes cha casa nova`
}
