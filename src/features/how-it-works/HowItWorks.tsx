import { HeartIcon } from '@/components/icons/icons'
import { Container } from '@/components/ui/Container'

const explanations = [
  {
    title: 'Por que Pix e não o presente?',
    text: 'Se cada um comprasse o seu, a gente ia acabar com três liquidificadores e nenhuma geladeira. Com o Pix nada se repete, e todo valor vira coisa pra casa.',
  },
  {
    title: 'Itens do dia a dia',
    text: 'Coloque no carrinho os presentes que quiser e pague tudo de uma vez por Pix. Pode escolher o mesmo item que outra pessoa, sem problema nenhum.',
  },
  {
    title: 'Itens maiores',
    text: 'São os que mais importam pra gente agora. O dinheiro dos outros presentes também ajuda a juntar pra eles, e dá pra acompanhar a barrinha enchendo.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="pt-20 md:pt-28">
      <Container>
        <h2 id="how-it-works-title" className="font-display text-4xl text-ink-800 sm:text-5xl">
          Como funciona
        </h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {explanations.map(({ title, text }) => (
            <div key={title} className="border-t-2 border-rose-200 pt-5">
              <h3 className="text-lg font-bold text-ink-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-ash-600">{text}</p>
            </div>
          ))}
        </div>

        <aside className="mt-12 flex gap-4 rounded-[1.75rem] bg-white p-6 sm:items-center sm:p-8">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500">
            <HeartIcon className="size-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl text-ink-900">Prefere comprar o item?</h3>
            <p className="mt-1 leading-relaxed text-ash-600">
              Caso você queira comprar o item e não mandar o Pix, nos avise que deixaremos o item
              como reservado. No carrinho tem a aba{' '}
              <strong className="text-ink-800">Comprar os itens</strong>, com o link de cada produto
              e um atalho pra falar com a gente.
            </p>
          </div>
        </aside>
      </Container>
    </section>
  )
}
