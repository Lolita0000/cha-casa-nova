import { createContext } from 'react'

import type { RememberedRsvp } from './rsvpMemory'

export interface RsvpContextValue {
  /** What this device already confirmed, if anything. */
  confirmed: RememberedRsvp | null
  isOpen: boolean
  open: () => void
  close: () => void
  markConfirmed: (rsvp: RememberedRsvp) => void
}

export const RsvpContext = createContext<RsvpContextValue | null>(null)
