import { Container } from '@/components/ui/Container'
import { materialsToAvoid, preferredMaterials } from '@/data/materials'

export function MaterialsNote() {
  return (
    <section aria-labelledby="materials-title" className="pb-24 md:pb-28">
      <Container>
        <div className="grid gap-10 rounded-[2.5rem] bg-white p-6 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <h2 id="materials-title" className="font-display text-4xl text-ink-800 sm:text-5xl">
              Um pedidinho com carinho
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ash-600">
              Se você for comprar algum item fora da lista pra cozinha, pedimos com todo carinho que
              não seja de plástico nem de silicone. Por questão de saúde, estamos evitando esses
              materiais em tudo que fica em contato com os alimentos: potes, utensílios, formas e
              afins.
            </p>
            <p className="mt-4 leading-relaxed text-ash-600">
              Pra outras coisas da casa, fique à vontade. E obrigado por entender!
            </p>
          </div>

          <div className="grid content-start gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <MaterialGroup title="Preferimos" materials={preferredMaterials} tone="rose" />
            <MaterialGroup title="Evitamos com comida" materials={materialsToAvoid} tone="ash" />
          </div>
        </div>
      </Container>
    </section>
  )
}

interface MaterialGroupProps {
  title: string
  materials: string[]
  tone: 'rose' | 'ash'
}

function MaterialGroup({ title, materials, tone }: MaterialGroupProps) {
  const chipClass =
    tone === 'rose'
      ? 'bg-rose-100 text-ink-900'
      : 'bg-ash-100 text-ash-600 line-through decoration-ash-400'

  return (
    <div>
      <h3 className="font-bold text-ink-900">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {materials.map((material) => (
          <li
            key={material}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${chipClass}`}
          >
            {material}
          </li>
        ))}
      </ul>
    </div>
  )
}
