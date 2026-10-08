import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="bg-ink-900 py-12 text-ink-100">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-display text-xl text-white">{siteConfig.coupleNames.join(' & ')}</p>
        <p className="text-sm text-ink-300">Obrigado por ajudar a montar o nosso cantinho.</p>
      </Container>
    </footer>
  )
}
