/** Picks the singular text for one person and the plural one for two or more. */
export function byCount<T>(count: number, one: T, many: T): T {
  return count > 1 ? many : one
}
