/**
 * Everything personal about the event lives here.
 * Fill in the real values before publishing.
 */
export const siteConfig = {
  coupleNames: ['Fulana', 'Ciclano'] as const,

  event: {
    /** ISO date with timezone offset. */
    startsAt: '2026-11-21T15:00:00-03:00',
    addressLine: 'Endereço a definir',
    mapsUrl: '',
  },

  pix: {
    /** Pix key: e-mail, phone (+55...), CPF or random key. */
    key: 'chave-pix@exemplo.com',
    /** Receiver name as registered at the bank, max 25 characters, no accents. */
    receiverName: 'FULANA DE TAL',
    /** Receiver city, max 15 characters, no accents. */
    receiverCity: 'BRASILIA',
  },

  /** Number used for "I'll buy this one" messages, digits only with country code. */
  whatsappNumber: '5561900000000',

  /** Card payment link with an open amount, used by the free contribution section. */
  openAmountCardUrl: '',
} as const

export type SiteConfig = typeof siteConfig
