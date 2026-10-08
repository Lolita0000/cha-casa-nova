import { formatEventDate, formatEventTime } from '@/lib/date/event'
import type { SiteConfig } from '@/config/site'

interface EventDetailsProps {
  event: SiteConfig['event']
}

/** Date and place chips. Renders nothing until at least one of them is set. */
export function EventDetails({ event }: EventDetailsProps) {
  const eventDate = event.startsAt ? new Date(event.startsAt) : undefined

  if (!eventDate && !event.addressLine) return null

  return (
    <ul className="mt-8 flex flex-wrap gap-2 text-sm">
      {eventDate && (
        <li className="rounded-2xl bg-white px-4 py-2.5">
          <span className="font-bold text-ink-900">{formatEventDate(eventDate)}</span>
          <span className="text-ash-600">, às {formatEventTime(eventDate)}</span>
        </li>
      )}
      {event.addressLine && (
        <li className="rounded-2xl bg-white px-4 py-2.5 font-bold text-ink-900">
          {event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-rose-400 decoration-2 underline-offset-4"
            >
              {event.addressLine}
            </a>
          ) : (
            event.addressLine
          )}
        </li>
      )}
    </ul>
  )
}
