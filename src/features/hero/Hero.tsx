import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'
import { daysUntil, describeDaysLeft, formatEventDate, formatEventTime } from '@/lib/date/event'
import type { RoomId } from '@/types/gift'

import { FloorPlan } from './FloorPlan'

interface HeroProps {
  activeRoomIds: RoomId[]
}

export function Hero({ activeRoomIds }: HeroProps) {
  const { coupleNames, event } = siteConfig
  const eventDate = new Date(event.startsAt)

  return (
    <header className="bg-ink-800 text-ink-50">
      <Container className="flex items-center justify-between py-6 text-sm">
        <p className="font-display text-lg text-white">{coupleNames.join(' & ')}</p>
        <p className="rounded-full border border-ink-500 px-3 py-1 text-ink-100">
          {describeDaysLeft(daysUntil(eventDate))}
        </p>
      </Container>

      <Container className="grid items-center gap-12 pt-8 pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-14 lg:pb-28">
        <div>
          <h1 className="max-w-[14ch] font-display text-[2.6rem] leading-[1.08] text-white sm:text-6xl">
            Ajuda a gente a mobiliar a casa nova?
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-100">
            Montamos a lista cômodo por cômodo. Escolha um presente na planta ou mais abaixo e
            contribua com Pix ou cartão, do jeito que for mais fácil pra você.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-700 pt-6 text-sm">
            <div>
              <dt className="text-ink-300">Quando</dt>
              <dd className="mt-1 text-white first-letter:uppercase">
                {formatEventDate(eventDate)}, às {formatEventTime(eventDate)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-300">Onde</dt>
              <dd className="mt-1 text-white">
                {event.mapsUrl ? (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-blush-400 underline-offset-4 hover:text-blush-200"
                  >
                    {event.addressLine}
                  </a>
                ) : (
                  event.addressLine
                )}
              </dd>
            </div>
          </dl>
        </div>

        <figure className="w-full max-w-xl justify-self-center">
          <FloorPlan activeRoomIds={activeRoomIds} className="w-full" />
          <figcaption className="mt-3 text-center text-sm text-ink-300">
            Toque num cômodo para ir direto pra lista dele
          </figcaption>
        </figure>
      </Container>
    </header>
  )
}
