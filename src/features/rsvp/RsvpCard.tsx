import { CheckIcon } from '@/components/icons/icons'
import { Button } from '@/components/ui/Button'
import { joinNames } from '@/features/registry/giverNames'
import { byCount } from '@/lib/text/plural'

import { RsvpClosedNote } from './RsvpClosedNote'
import { useRsvp } from './useRsvp'
import { useRsvpOpen } from './useRsvpOpen'

interface RsvpCardProps {
  className?: string
}

/** "Você vem?": asks guests to confirm presence so their names can go to the doorman. */
export function RsvpCard({ className = '' }: RsvpCardProps) {
  const { confirmed, open } = useRsvp()
  const isOpenForRsvp = useRsvpOpen()

  return (
    <section
      id="presenca"
      aria-labelledby="rsvp-title"
      className={`scroll-mt-6 rounded-[2rem] bg-ink-800 px-6 py-8 text-white sm:px-8 ${className}`}
    >
      <h2 id="rsvp-title" className="font-display text-3xl leading-tight sm:text-4xl">
        Você vem?
      </h2>
      {isOpenForRsvp ? (
        <>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-ash-100">
            A entrada no condomínio é liberada pelo nome, então precisamos passar a lista pro
            porteiro. Por favor, confirme sua presença.
          </p>
          <p className="mt-2 text-sm text-rose-200">
            Se você já confirmou, não precisa confirmar de novo.
          </p>
        </>
      ) : (
        <RsvpClosedNote className="mt-3 max-w-[52ch] leading-relaxed text-ash-100" />
      )}

      <div className="mt-6">
        {confirmed ? (
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="flex items-center gap-2 font-bold">
              <CheckIcon className="size-5 text-rose-300" />
              {confirmed.attending
                ? byCount(
                    confirmed.guestNames.length,
                    'Presença confirmada',
                    'Presenças confirmadas',
                  )
                : byCount(
                    confirmed.guestNames.length,
                    'Você avisou que não vem',
                    'Vocês avisaram que não vêm',
                  )}
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
          isOpenForRsvp && (
            <Button onClick={open} variant="soft" className="w-full sm:w-auto">
              Confirmar presença
            </Button>
          )
        )}
      </div>
    </section>
  )
}
