import { HeartIcon } from '@/components/icons/icons'
import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="rounded-t-[3rem] bg-ash-600 py-14 text-white md:rounded-t-[4rem]">
      <Container className="flex flex-col items-center gap-3 text-center">
        <HeartIcon className="size-6 text-rose-300" />
        <p className="font-display text-3xl">{siteConfig.coupleNames.join(' & ')}</p>
        <p className="text-ash-100">Obrigado por ajudar a montar o nosso cantinho.</p>
      </Container>
    </footer>
  )
}
