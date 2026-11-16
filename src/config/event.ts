import { siteConfig } from './site'

/** When presence confirmation closes, or undefined while it stays open. */
export const rsvpClosesAt = siteConfig.event.rsvpClosesAt
  ? new Date(siteConfig.event.rsvpClosesAt)
  : undefined

export function isRsvpOpen(
  now: Date = new Date(),
  closesAt: Date | null | undefined = rsvpClosesAt,
): boolean {
  return !closesAt || now.getTime() < closesAt.getTime()
}
