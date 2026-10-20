const STORAGE_KEY = 'cha-casa-nova:giver-names:v1'

/** Remembers who gave last time, so a second gift doesn't mean typing the family again. */
export function loadRememberedNames(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((name) => typeof name === 'string') : []
  } catch {
    return []
  }
}

export function rememberNames(names: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names))
  } catch {
    // Not remembering the names is fine.
  }
}
