import { useContext } from 'react'

import { RsvpContext } from './rsvpContext'

export function useRsvp() {
  const context = useContext(RsvpContext)
  if (!context) throw new Error('useRsvp must be used inside <RsvpProvider>')
  return context
}
