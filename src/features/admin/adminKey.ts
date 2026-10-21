/**
 * The admin panel opens with a private link: `#/admin?chave=<key>`. The key is
 * remembered on the device so `#/admin` alone works afterwards.
 */
const STORAGE_KEY = 'cha-casa-nova:admin-key:v1'

function keyFromHash(hash: string): string | null {
  const query = hash.split('?')[1]
  return query ? new URLSearchParams(query).get('chave') : null
}

export function loadAdminKey(): string | null {
  const fromLink = keyFromHash(window.location.hash)
  if (fromLink) {
    try {
      localStorage.setItem(STORAGE_KEY, fromLink)
    } catch {
      // The link still works for this visit.
    }
    // Keep the key out of the address bar, so it isn't shared by accident.
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#/admin`,
    )
    return fromLink
  }
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function forgetAdminKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing stored.
  }
}
