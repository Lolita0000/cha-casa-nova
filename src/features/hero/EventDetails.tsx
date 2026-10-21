import { CalendarIcon, ExternalIcon, PinIcon } from '@/components/icons/icons'
import type { SiteConfig } from '@/config/site'
import { describeEventTime, formatEventDate } from '@/lib/date/event'

interface EventDetailsProps {
  event: SiteConfig['event']
}

/** Date and place cards. Each one only shows up once it is filled in. */
export function EventDetails({ event }: EventDetailsProps) {
  if (!event.date && !event.addressLine) return null

  return (
    <ul className="mt-8 grid gap-2 sm:grid-cols-[auto_1fr]">
      {event.date && (
        <li className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
          <CalendarIcon className="size-5 shrink-0 text-rose-500" />
          <span>
            <span className="block font-bold text-ink-900">{formatEventDate(event.date)}</span>
            <span className="block text-sm text-ash-600">
              {event.time ? describeEventTime(event.time) : 'Horário a confirmar'}
            </span>
          </span>
        </li>
      )}
      {event.addressLine && (
        <li className="rounded-2xl bg-white px-4 py-3">
          <a
            href={event.mapsUrl || undefined}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3"
          >
            <PinIcon className="mt-0.5 size-5 shrink-0 text-rose-500" />
            <span className="min-w-0">
              <span className="block font-bold text-ink-900">
                {event.addressDetail ?? event.addressLine}
              </span>
              {event.addressDetail && (
                <span className="block text-sm text-ash-600">{event.addressLine}</span>
              )}
              {event.mapsUrl && (
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4 group-hover:decoration-rose-500">
                  Abrir no mapa
                  <ExternalIcon className="size-3.5" />
                </span>
              )}
            </span>
          </a>
        </li>
      )}
    </ul>
  )
}
