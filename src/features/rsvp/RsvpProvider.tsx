import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { RsvpContext, type RsvpContextValue } from './rsvpContext'
import { loadRememberedRsvp, rememberRsvp, type RememberedRsvp } from './rsvpMemory'

export function RsvpProvider({ children }: { children: ReactNode }) {
  const [confirmed, setConfirmed] = useState<RememberedRsvp | null>(loadRememberedRsvp)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const markConfirmed = useCallback((rsvp: RememberedRsvp) => {
    rememberRsvp(rsvp)
    setConfirmed(rsvp)
  }, [])

  const value = useMemo<RsvpContextValue>(
    () => ({ confirmed, isOpen, open, close, markConfirmed }),
    [confirmed, isOpen, open, close, markConfirmed],
  )

  return <RsvpContext.Provider value={value}>{children}</RsvpContext.Provider>
}
