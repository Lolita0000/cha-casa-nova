import { buttonClassName } from '@/components/ui/buttonStyles'
import { Container } from '@/components/ui/Container'
import { rsvpDeadline } from '@/config/event'
import { siteConfig } from '@/config/site'
import { useRsvp } from '@/features/rsvp/useRsvp'
import { daysUntil, describeDaysLeft, formatShortDate, isOnOrBefore } from '@/lib/date/event'

import { EventDetails } from './EventDetails'
import { LivingRoomIllustration } from './LivingRoomIllustration'

export function Hero() {
  const { coupleNames, event } = siteConfig
  const { confirmed, open: openRsvp } = useRsvp()
  const isRsvpOpen = !rsvpDeadline || isOnOrBefore(rsvpDeadline)

  return (
    <header className="overflow-hidden rounded-b-[3rem] bg-rose-100 md:rounded-b-[4rem]">
      <Container className="flex items-center justify-between py-6">
        <p className="font-display text-xl text-ink-800">{coupleNames.join(' & ')}</p>
        {event.date && (
          <p className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-rose-700 tabular-nums">
            {describeDaysLeft(daysUntil(event.date))}
          </p>
        )}
      </Container>

      <Container className="grid items-center gap-12 pt-6 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-12 lg:pb-28">
        <div>
          <h1 className="max-w-[13ch] font-display text-[2.75rem] leading-[1.05] text-ink-900 sm:text-[4.25rem]">
            Vem ajudar a gente a montar o nosso cantinho?
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
            Fizemos uma listinha com o que ainda falta na casa nova. Você coloca no carrinho o que
            quiser dar e presenteia com Pix, do jeito que for mais fácil.
          </p>

          <EventDetails event={event} />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {isRsvpOpen && (
              <button type="button" onClick={openRsvp} className={buttonClassName()}>
                {confirmed ? 'Presença confirmada' : 'Confirmar presença'}
              </button>
            )}
            <a href="#lista" className={buttonClassName({ variant: 'outline' })}>
              Ver a listinha
            </a>
          </div>
          {rsvpDeadline && isRsvpOpen && (
            <p className="mt-4 max-w-[46ch] text-sm text-ink-700">
              {confirmed
                ? 'Você já confirmou por aqui, não precisa confirmar de novo.'
                : `Confirme até ${formatShortDate(rsvpDeadline)}, pra gente passar seu nome pro porteiro. Se já confirmou, não precisa confirmar de novo.`}
            </p>
          )}
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
