const STORAGE_KEY = 'cha-casa-nova:rsvp:v1'

export interface RememberedRsvp {
  guestNames: string[]
  attending: boolean
}

/** Lets the page say "you already confirmed" on this device. */
export function loadRememberedRsvp(): RememberedRsvp | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as RememberedRsvp).guestNames) &&
      typeof (parsed as RememberedRsvp).attending === 'boolean'
    ) {
      return parsed as RememberedRsvp
    }
    return null
  } catch {
    return null
  }
}

export function rememberRsvp(rsvp: RememberedRsvp): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvp))
  } catch {
    // The confirmation is saved on the server either way.
  }
}
