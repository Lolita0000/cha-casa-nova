import { CheckIcon } from '@/components/icons/icons'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { rsvpDeadline } from '@/config/event'
import { joinNames } from '@/features/registry/giverNames'
import { formatShortDate, isOnOrBefore } from '@/lib/date/event'

import { useRsvp } from './useRsvp'

export function RsvpSection() {
  const { confirmed, open } = useRsvp()
  const isOpenForRsvp = !rsvpDeadline || isOnOrBefore(rsvpDeadline)

  return (
    <section id="presenca" aria-labelledby="rsvp-title" className="scroll-mt-6 pt-16 md:pt-20">
      <Container>
        <div className="grid gap-6 rounded-[2.5rem] bg-ink-800 px-6 py-10 text-white sm:px-12 md:grid-cols-[1.4fr_1fr] md:items-center md:py-14">
          <div>
            <h2 id="rsvp-title" className="font-display text-4xl leading-tight sm:text-5xl">
              Você vem?
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ash-100">
              A entrada no condomínio é liberada pelo nome, então precisamos passar a lista pro
              porteiro.{' '}
              {rsvpDeadline && (
                <>
                  Por favor, confirme sua presença até{' '}
                  <strong className="text-white">{formatShortDate(rsvpDeadline)}</strong>.
                </>
              )}
            </p>
            <p className="mt-3 text-sm text-rose-200">
              Se você já confirmou, não precisa confirmar de novo.
            </p>
          </div>

          <div className="md:justify-self-end">
            {confirmed ? (
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="flex items-center gap-2 font-bold">
                  <CheckIcon className="size-5 text-rose-300" />
                  {confirmed.attending ? 'Presença confirmada' : 'Você avisou que não vem'}
                </p>
                <p className="mt-1 text-sm text-ash-100">{joinNames(confirmed.guestNames)}</p>
                {isOpenForRsvp && (
                  <button
                    type="button"
                    onClick={open}
                    className="mt-3 text-sm font-bold underline decoration-rose-300 decoration-2 underline-offset-4"
                  >
                    Incluir mais alguém
                  </button>
                )}
              </div>
            ) : (
              <Button onClick={open} variant="soft" className="w-full md:w-auto">
                {isOpenForRsvp ? 'Confirmar presença' : 'Ver como confirmar'}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
