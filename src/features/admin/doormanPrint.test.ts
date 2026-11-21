import { describe, expect, it } from 'vitest'

import { buildDoormanHtml, tidyName } from './doormanPrint'

describe('doorman print', () => {
  it('tidies names typed in caps or lowercase', () => {
    expect(tidyName('THAGINARA GOMES DE CASTRO')).toBe('Thaginara Gomes de Castro')
    expect(tidyName('vitor hugo pereira de maman')).toBe('Vitor Hugo Pereira de Maman')
  })

  it('numbers every guest and escapes the names', () => {
    const html = buildDoormanHtml(['Ana <b>', 'Beto'])
    expect(html).toContain('2 convidados')
    expect(html).toContain('Ana &lt;b&gt;')
    expect(html).toContain('<span class="n">2.</span>')
  })
})
