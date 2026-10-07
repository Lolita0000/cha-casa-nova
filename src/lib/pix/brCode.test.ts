import { describe, expect, it } from 'vitest'

import { buildPixPayload, sanitizeText } from './brCode'
import { crc16Ccitt } from './crc16'

describe('crc16Ccitt', () => {
  it('matches the CRC-16/CCITT-FALSE check value', () => {
    expect(crc16Ccitt('123456789')).toBe('29B1')
  })
})

describe('sanitizeText', () => {
  it('removes accents and trims to the max length', () => {
    expect(sanitizeText('São João da Boa Vista', 15)).toBe('Sao Joao da Boa')
  })
})

describe('buildPixPayload', () => {
  const base = {
    key: 'chave@exemplo.com',
    receiverName: 'Fulana de Tal',
    receiverCity: 'Brasília',
  }

  it('builds a payload with a valid checksum', () => {
    const payload = buildPixPayload({ ...base, amountInCents: 18000 })
    const body = payload.slice(0, -4)

    expect(payload.startsWith('000201')).toBe(true)
    expect(body.endsWith('6304')).toBe(true)
    expect(payload.slice(-4)).toBe(crc16Ccitt(body))
  })

  it('includes the amount with two decimals', () => {
    expect(buildPixPayload({ ...base, amountInCents: 18000 })).toContain('5406180.00')
  })

  it('omits the amount when none is given', () => {
    expect(buildPixPayload(base)).not.toContain('5406')
  })

  it('normalizes receiver name and city', () => {
    const payload = buildPixPayload(base)
    expect(payload).toContain('5913FULANA DE TAL')
    expect(payload).toContain('6008BRASILIA')
  })

  it('adds a sanitized description to the merchant account field', () => {
    expect(buildPixPayload({ ...base, description: 'Jogo de panelas' })).toContain(
      '0215Jogo de panelas',
    )
  })

  it('throws without a key', () => {
    expect(() => buildPixPayload({ ...base, key: ' ' })).toThrow()
  })
})
