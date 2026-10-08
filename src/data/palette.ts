export interface PaletteColor {
  name: string
  hex: string
  /** Where the color shows up in the house. */
  usage: string
}

export const housePalette: PaletteColor[] = [
  { name: 'Rosa antigo', hex: '#D69A9E', usage: 'Almofadas, mantas e o puff' },
  { name: 'Rosinha', hex: '#F1CFCD', usage: 'Cortinas, tapete e detalhes' },
  { name: 'Cinza sofá', hex: '#7E8087', usage: 'Sofá e estofados' },
  { name: 'Cinza parede', hex: '#EAE9E8', usage: 'Paredes e cortinas mais leves' },
  { name: 'Branco', hex: '#FFFFFF', usage: 'Mesinhas, molduras e louças' },
  { name: 'Azul marinho', hex: '#1F2B47', usage: 'Pequenos detalhes e quadros' },
  { name: 'Madeira clara', hex: '#C9A27E', usage: 'Pés de móveis, cestos e prateleiras' },
]
