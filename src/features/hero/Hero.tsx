import { buttonClassName } from '@/components/ui/buttonStyles'
import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'
import { daysUntil, describeDaysLeft, formatEventDate, formatEventTime } from '@/lib/date/event'

import { LivingRoomIllustration } from './LivingRoomIllustration'

export function Hero() {
  const { coupleNames, event } = siteConfig
  const eventDate = new Date(event.startsAt)

  return (
    <header className="overflow-hidden rounded-b-[3rem] bg-rose-100 md:rounded-b-[4rem]">
      <Container className="flex items-center justify-between py-6">
        <p className="font-display text-xl text-ink-800">{coupleNames.join(' & ')}</p>
        <p className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-rose-700">
          {describeDaysLeft(daysUntil(eventDate))}
        </p>
      </Container>

      <Container className="grid items-center gap-12 pt-6 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-12 lg:pb-28">
        <div>
          <h1 className="max-w-[13ch] font-display text-[2.75rem] leading-[1.05] text-ink-900 sm:text-[4.25rem]">
            Vem ajudar a gente a montar o nosso cantinho?
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
            Fizemos uma listinha com o que ainda falta na casa nova. Você escolhe um item e
            presenteia com Pix ou cartão, do jeito que for mais fácil.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            <li className="rounded-2xl bg-white px-4 py-2.5">
              <span className="font-bold text-ink-900">{formatEventDate(eventDate)}</span>
              <span className="text-ash-600">, às {formatEventTime(eventDate)}</span>
            </li>
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
          </ul>

          <a href="#lista" className={buttonClassName({ className: 'mt-10' })}>
            Ver a listinha
          </a>
        </div>

        <div className="mx-auto w-full max-w-md px-4">
          <div className="animate-[glow_2.4s_ease-in-out_1] rounded-full shadow-[0_0_0_10px_var(--color-white),0_0_50px_10px_var(--color-rose-200)]">
            <LivingRoomIllustration className="block w-full rounded-full" />
          </div>
        </div>
      </Container>
    </header>
  )
}
