import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Dialog } from '@/components/ui/Dialog'
import { siteConfig } from '@/config/site'
import { PaymentOptions } from '@/features/payment/PaymentOptions'

export function FreeContribution() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section aria-labelledby="free-contribution-title" className="bg-blush-100 py-16 md:py-20">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2
            id="free-contribution-title"
            className="font-display text-3xl leading-tight text-ink-800 sm:text-4xl"
          >
            Não achou nada a sua cara?
          </h2>
          <p className="mt-4 leading-relaxed text-ink-700">
            Tudo bem! Se preferir, manda um pixzinho do valor que quiser. A gente junta com o resto
            e usa no que estiver faltando na casa.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="shrink-0 self-start md:self-auto">
          Mandar um Pix
        </Button>
      </Container>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Um pixzinho pra casa">
        <PaymentOptions
          description="Cha de casa nova"
          cardPaymentUrl={siteConfig.openAmountCardUrl || undefined}
        />
      </Dialog>
    </section>
  )
}
