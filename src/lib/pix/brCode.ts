import { crc16Ccitt } from './crc16'

/**
 * Builds a static Pix "copia e cola" payload (BR Code), following the
 * EMV QRCPS-MPM layout used by the Central Bank of Brazil.
 * No API or payment provider involved: the payload is generated locally.
 */

export interface PixPayloadOptions {
  key: string
  receiverName: string
  receiverCity: string
  amountInCents?: number
  /** Short message shown in the payer's banking app. */
  description?: string
  /** Transaction id, letters and digits only. Defaults to "***". */
  txid?: string
}

const ID = {
  payloadFormat: '00',
  merchantAccount: '26',
  merchantCategory: '52',
  currency: '53',
  amount: '54',
  country: '58',
  receiverName: '59',
  receiverCity: '60',
  additionalData: '62',
  crc: '63',
} as const

const MERCHANT_ACCOUNT = { gui: '00', key: '01', description: '02' } as const
const ADDITIONAL_DATA_TXID = '05'
const PIX_GUI = 'br.gov.bcb.pix'
const BRL_CURRENCY_CODE = '986'

const MAX_NAME_LENGTH = 25
const MAX_CITY_LENGTH = 15
const MAX_TXID_LENGTH = 25
const MAX_FIELD_LENGTH = 99

function field(id: string, value: string): string {
  if (value.length > MAX_FIELD_LENGTH) {
    throw new Error(`Pix field ${id} exceeds ${MAX_FIELD_LENGTH} characters`)
  }
  return `${id}${value.length.toString().padStart(2, '0')}${value}`
}

/** Removes accents and characters banks tend to reject. */
export function sanitizeText(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9 .,@+\-_/]/g, '')
    .trim()
    .slice(0, maxLength)
}

function merchantAccountInfo(key: string, description?: string): string {
  const base = field(MERCHANT_ACCOUNT.gui, PIX_GUI) + field(MERCHANT_ACCOUNT.key, key.trim())
  if (!description) return base

  // Keep the whole template within the 99 character limit.
  const room = MAX_FIELD_LENGTH - base.length - 4
  const safeDescription = sanitizeText(description, Math.max(room, 0))
  return safeDescription ? base + field(MERCHANT_ACCOUNT.description, safeDescription) : base
}

export function buildPixPayload({
  key,
  receiverName,
  receiverCity,
  amountInCents,
  description,
  txid = '***',
}: PixPayloadOptions): string {
  if (!key.trim()) throw new Error('A Pix key is required')

  const safeTxid = txid === '***' ? txid : sanitizeText(txid, MAX_TXID_LENGTH).replace(/\W/g, '')

  const parts = [
    field(ID.payloadFormat, '01'),
    field(ID.merchantAccount, merchantAccountInfo(key, description)),
    field(ID.merchantCategory, '0000'),
    field(ID.currency, BRL_CURRENCY_CODE),
    amountInCents && amountInCents > 0 ? field(ID.amount, (amountInCents / 100).toFixed(2)) : '',
    field(ID.country, 'BR'),
    field(ID.receiverName, sanitizeText(receiverName, MAX_NAME_LENGTH).toUpperCase()),
    field(ID.receiverCity, sanitizeText(receiverCity, MAX_CITY_LENGTH).toUpperCase()),
    field(ID.additionalData, field(ADDITIONAL_DATA_TXID, safeTxid || '***')),
  ]

  const withoutCrc = `${parts.join('')}${ID.crc}04`
  return withoutCrc + crc16Ccitt(withoutCrc)
}
