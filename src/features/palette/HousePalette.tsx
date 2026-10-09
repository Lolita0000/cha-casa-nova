import { Container } from '@/components/ui/Container'
import { housePalette } from '@/data/palette'

export function HousePalette() {
  return (
    <section aria-labelledby="palette-title" className="py-24 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 id="palette-title" className="font-display text-4xl text-ink-800 sm:text-5xl">
            As cores da casa nova
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ash-600">
            Vai dar um presente que não está na lista? Essa é a paletinha que escolhemos: muito
            rosa, cinza e branco, com uns toques de azul marinho e madeira clara.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-7">
          {housePalette.map((color) => (
            <li key={color.hex} className="text-center">
              <span
                className="mx-auto block aspect-square w-full max-w-36 rounded-full knit ring-1 ring-ash-200 ring-inset"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <p className="mt-4 font-bold text-ink-900">{color.name}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
