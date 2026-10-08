import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { siteConfig } from '@/config/site'
import { CardPayment } from '@/features/payment/CardPayment'
import { PixPayment } from '@/features/payment/PixPayment'

type FreeTab = 'pix' | 'card'

export function FreeContribution() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FreeTab>('pix')

  const tabs: TabItem<FreeTab>[] = [
    { id: 'pix', label: 'Pix', content: <PixPayment description="Cha de casa nova" /> },
    ...(siteConfig.openAmountCardUrl
      ? [
          {
            id: 'card' as const,
            label: 'Cartão',
            content: <CardPayment url={siteConfig.openAmountCardUrl} />,
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
              junta com o resto e usa no que estiver faltando na casa.
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="shrink-0 self-start md:self-auto">
            Mandar um pixzinho
          </Button>
        </div>
      </Container>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Um pixzinho pra casa">
        {tabs.length > 1 ? (
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
