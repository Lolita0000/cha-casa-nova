import { useEffect, useState } from 'react'

import { isRsvpOpen, rsvpClosesAt } from '@/config/event'

/** Whether guests can still confirm; flips by itself on pages left open at closing time. */
export function useRsvpOpen(): boolean {
  const [isOpen, setIsOpen] = useState(() => isRsvpOpen())

  useEffect(() => {
    if (!isOpen || !rsvpClosesAt) return
    const wait = rsvpClosesAt.getTime() - Date.now()
    // setTimeout can't wait longer than ~24 days; the page is reloaded long before that.
    if (wait > 2_000_000_000) return
    const timer = setTimeout(() => setIsOpen(false), Math.max(wait, 0))
    return () => clearTimeout(timer)
  }, [isOpen])

  return isOpen
}
