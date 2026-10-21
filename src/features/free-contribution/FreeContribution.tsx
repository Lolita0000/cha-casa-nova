import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { CardCheckout } from '@/features/payment/CardCheckout'
import { PixPayment } from '@/features/payment/PixPayment'
import { isCardPaymentEnabled } from '@/features/payment/startCardCheckout'
import { GiftConfirmation } from '@/features/registry/GiftConfirmation'
import { useConfirmationLock } from '@/features/registry/useConfirmationLock'
import { useGiftStatus } from '@/features/registry/useGiftStatus'

type FreeTab = 'pix' | 'card'

/** Free contributions are stored like any other gift, under this id. */
const FREE_CONTRIBUTION = { giftId: 'pixzinho', giftName: 'Pixzinho pra casa' }

export function FreeContribution() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FreeTab>('pix')
  const [isConfirming, setIsConfirming] = useState(false)
  const { refresh } = useGiftStatus()
  const confirmation = useConfirmationLock()

  function close() {
    setIsOpen(false)
    setIsConfirming(false)
  }

  const tabs: TabItem<FreeTab>[] = [
    {
      id: 'pix',
      label: 'Pix',
      content: (
        <>
          <PixPayment description="Cha de casa nova" />
          <Button
            variant="soft"
            onClick={() => {
              setIsConfirming(true)
              confirmation.lock()
            }}
            className="mt-5 w-full"
          >
            Já fiz o Pix
          </Button>
        </>
      ),
    },
    ...(isCardPaymentEnabled
      ? [
          {
            id: 'card' as const,
            label: 'Cartão',
            content: <CardCheckout openAmountFor={FREE_CONTRIBUTION} />,
          },
        ]
      : []),
  ]

  return (
    <section aria-labelledby="free-contribution-title">
      <Container>
        <div className="flex flex-col gap-8 rounded-[2.5rem] bg-rose-300 knit px-6 py-12 sm:px-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-xl">
            <h2
              id="free-contribution-title"
              className="font-display text-4xl leading-tight text-ink-900 sm:text-5xl"
            >
              Não achou nada a sua cara?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-800">
              Não tem problema nenhum! Se preferir, manda um pixzinho do valor que quiser. A gente
              junta e usa no que estiver faltando na casa.
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="shrink-0 self-start md:self-auto">
            Mandar um pixzinho
          </Button>
        </div>
      </Container>

      <Dialog
        open={isOpen}
        onClose={close}
        locked={confirmation.isLocked}
        onCloseBlocked={confirmation.registerCloseAttempt}
        title={isConfirming ? 'Confirmar pixzinho' : 'Um pixzinho pra casa'}
      >
        {isConfirming ? (
          <GiftConfirmation
            items={[]}
            defaultMethod="pix"
            allowPurchase={false}
            customAmountFor={FREE_CONTRIBUTION}
            closeAttempts={confirmation.closeAttempts}
            onConfirmed={() => {
              confirmation.unlock()
              refresh()
            }}
          />
        ) : tabs.length > 1 ? (
          <Tabs
            label="Forma de pagamento"
            tabs={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
          />
        ) : (
          tabs[0].content
        )}
      </Dialog>
    </section>
  )
}
