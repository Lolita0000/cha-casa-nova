import { Dialog } from '@/components/ui/Dialog'

import { RsvpForm } from './RsvpForm'
import { useRsvp } from './useRsvp'

export function RsvpDialog() {
  const { isOpen, close } = useRsvp()

  return (
    <Dialog open={isOpen} onClose={close} title="Confirmar presença">
      <p className="-mt-2 mb-6 text-ash-600">
        A entrada no condomínio é liberada pelo nome, então precisamos passar a lista pro porteiro.
      </p>
      {/* Remounted on every open, so a finished form starts fresh next time. */}
      {isOpen && <RsvpForm />}
    </Dialog>
  )
}
