import { Container } from '@/components/ui/Container'

const explanations = [
  {
    title: 'Por que dinheiro e não o presente?',
    text: 'Se cada um comprasse o seu, a gente ia acabar com três liquidificadores e nenhuma geladeira. Com a contribuição, nada se repete e todo valor vira coisa pra casa.',
  },
  {
    title: 'Itens do dia a dia',
    text: 'Escolha o item e pague o valor dele por Pix ou cartão. Pode escolher o mesmo item que outra pessoa, sem problema nenhum.',
  },
  {
    title: 'Itens maiores',
    text: 'São os que mais importam pra gente agora. Dá pra ajudar com uma parte e acompanhar a barra enchendo. Se quiser dar um deles inteiro, avisa a gente antes pra ninguém comprar repetido.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-concrete-50 py-16 md:py-20">
      <Container className="grid gap-10 md:grid-cols-[13rem_1fr]">
        <h2 id="how-it-works-title" className="font-display text-3xl text-ink-800">
          Como funciona
        </h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {explanations.map(({ title, text }) => (
            <div key={title}>
              <h3 className="font-medium text-ink-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-concrete-600">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
