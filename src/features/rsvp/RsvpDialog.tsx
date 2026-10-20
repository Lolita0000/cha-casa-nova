import { Dialog } from '@/components/ui/Dialog'
import { rsvpDeadline } from '@/config/event'
import { formatShortDate } from '@/lib/date/event'

import { RsvpForm } from './RsvpForm'
import { useRsvp } from './useRsvp'

export function RsvpDialog() {
  const { isOpen, close } = useRsvp()

  return (
    <Dialog open={isOpen} onClose={close} title="Confirmar presença">
      {rsvpDeadline && (
        <p className="-mt-2 mb-6 text-ash-600">
          Confirme até <strong className="text-ink-900">{formatShortDate(rsvpDeadline)}</strong>,
          por favor. A entrada no condomínio é liberada pelo nome, então precisamos passar a lista
          pro porteiro com uma semana de antecedência.
        </p>
      )}
      {/* Remounted on every open, so a finished form starts fresh next time. */}
      {isOpen && <RsvpForm />}
    </Dialog>
  )
}
