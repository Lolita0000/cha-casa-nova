const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const brlCompactFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function formatCents(cents: number): string {
  return brlFormatter.format(cents / 100)
}

/** Drops the decimals when they are zero: R$ 180 instead of R$ 180,00. */
export function formatCentsShort(cents: number): string {
  return cents % 100 === 0 ? brlCompactFormatter.format(cents / 100) : formatCents(cents)
}

export function reaisToCents(reais: number): number {
  return Math.round(reais * 100)
}
