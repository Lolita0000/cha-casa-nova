/**
 * Everything personal about the event lives here.
 * Fill in the real values before publishing.
 */
export const siteConfig = {
  coupleNames: ['Aninha', 'Gabriel'] as const,

  event: {
    /** ISO date with timezone offset. */
    startsAt: '2026-11-21T15:00:00-03:00',
    addressLine: 'Endereço a definir',
    mapsUrl: '',
  },

  pix: {
    /** Pix key: e-mail, phone (+55...), CPF or random key. */
    key: '0b5b23e3-dec3-44aa-9af5-3ad5b2fe82b7',
    /**
     * Receiver name, max 25 characters, no accents. The payer's bank shows the
     * name registered with the key (Ana Luiza Rodrigues Machado, PicPay), so an
     * abbreviation here is fine.
     */
    receiverName: 'ANA LUIZA R MACHADO',
    /** Receiver city, max 15 characters, no accents. */
    receiverCity: 'BRASILIA',
  },

  /** Number used for "I'll buy this one" messages, digits only with country code. */
  whatsappNumber: '5561900000000',

  /** Card payment link with an open amount, used by the free contribution section. */
  openAmountCardUrl: '',
} as const

export type SiteConfig = typeof siteConfig
