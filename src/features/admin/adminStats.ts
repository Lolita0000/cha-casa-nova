import { joinNames } from '@/features/registry/giverNames'
import type { GiftMethod, GiftRecord, GiftRecordStatus } from '@/features/registry/types'

export interface RegistrySummary {
  pixDeclaredInCents: number
  pixConfirmedInCents: number
  purchaseCount: number
  recordCount: number
  pendingCount: number
}

/** Cancelled records are left out of every total. */
export function summarize(records: GiftRecord[]): RegistrySummary {
  const active = records.filter((record) => record.status !== 'cancelled')
  const pix = active.filter((record) => record.method === 'pix')
  return {
    pixDeclaredInCents: pix.reduce((sum, record) => sum + record.totalInCents, 0),
    pixConfirmedInCents: pix
      .filter((record) => record.status === 'confirmed')
      .reduce((sum, record) => sum + record.totalInCents, 0),
    purchaseCount: active.filter((record) => record.method === 'purchase').length,
    recordCount: active.length,
    pendingCount: active.filter((record) => record.status === 'pending').length,
  }
}

export interface GiftSummary {
  giftId: string
  giftName: string
  pixInCents: number
  purchasers: string[]
  pixGivers: string[]
}

/** One row per gift, with who sent Pix and who will buy it. */
export function summarizeByGift(records: GiftRecord[]): GiftSummary[] {
  const byId = new Map<string, GiftSummary>()

  for (const record of records) {
    if (record.status === 'cancelled') continue
    const givers = joinNames(record.giverNames)
    for (const item of record.items) {
      const summary = byId.get(item.giftId) ?? {
        giftId: item.giftId,
        giftName: item.giftName,
        pixInCents: 0,
        purchasers: [],
        pixGivers: [],
      }
      if (record.method === 'pix') {
        summary.pixInCents += item.amountInCents
        summary.pixGivers.push(givers)
      } else {
        summary.purchasers.push(givers)
      }
      byId.set(item.giftId, summary)
    }
  }

  return [...byId.values()].sort((a, b) => a.giftName.localeCompare(b.giftName, 'pt-BR'))
}

export interface RecordFilters {
  status: GiftRecordStatus | 'all'
  method: GiftMethod | 'all'
  query: string
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Matches names, gift names and messages, ignoring accents. */
export function filterRecords(records: GiftRecord[], filters: RecordFilters): GiftRecord[] {
  const query = normalize(filters.query.trim())
  return records.filter((record) => {
    if (filters.status !== 'all' && record.status !== filters.status) return false
    if (filters.method !== 'all' && record.method !== filters.method) return false
    if (!query) return true
    const haystack = normalize(
      [
        ...record.giverNames,
        ...record.items.map((item) => item.giftName),
        record.message ?? '',
      ].join(' '),
    )
    return haystack.includes(query)
  })
}

const METHOD_LABELS: Record<GiftMethod, string> = { pix: 'Pix', purchase: 'Compra' }
const STATUS_LABELS: Record<GiftRecordStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
}

export function methodLabel(method: GiftMethod): string {
  return METHOD_LABELS[method]
}

export function statusLabel(status: GiftRecordStatus): string {
  return STATUS_LABELS[status]
}

function csvCell(value: string): string {
  return /[";\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

/** Semicolon separated, which is what Excel expects in pt-BR. */
export function recordsToCsv(records: GiftRecord[]): string {
  const header = ['Data', 'Quem deu', 'Forma', 'Situação', 'Presentes', 'Valor (R$)', 'Recado']
  const rows = records.map((record) => [
    new Date(record.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    joinNames(record.giverNames),
    methodLabel(record.method),
    statusLabel(record.status),
    record.items.map((item) => item.giftName).join(' + '),
    (record.totalInCents / 100).toFixed(2).replace('.', ','),
    record.message ?? '',
  ])
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\n')
}
