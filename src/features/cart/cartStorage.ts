import type { CartLine } from './cart'

const STORAGE_KEY = 'cha-casa-nova:cart:v1'

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as Record<string, unknown>
  return typeof line.giftId === 'string' && typeof line.amountInCents === 'number'
}

/** Storage can be blocked (private mode, in-app browsers), so every access is guarded. */
export function loadCart(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : []
  } catch {
    return []
  }
}

export function saveCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // The cart still works for this visit, it just won't be remembered.
  }
}
