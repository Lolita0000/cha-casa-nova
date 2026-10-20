import { addDays } from '@/lib/date/event'

import { siteConfig } from './site'

const { event } = siteConfig

/** Last day guests can confirm presence, or undefined while the party has no date. */
export const rsvpDeadline = event.date ? addDays(event.date, -event.rsvpDaysBefore) : undefined
