import { describe, expect, it } from 'vitest'

import { cleanGiverNames, joinNames, validateGiverNames } from './giverNames'

describe('cleanGiverNames', () => {
  it('trims, collapses spaces and drops empty names', () => {
    expect(cleanGiverNames(['  Tia  Rosa ', '', '   ', 'Beto'])).toEqual(['Tia Rosa', 'Beto'])
  })
})

describe('validateGiverNames', () => {
  it('asks for at least one name', () => {
    expect(validateGiverNames(['', ' '])).toBe('Escreva pelo menos um nome.')
  })

  it('limits the number and length of names', () => {
    expect(validateGiverNames(Array(13).fill('Ana'))).toContain('até 12 nomes')
    expect(validateGiverNames(['a'.repeat(81)])).toContain('até 80 letras')
  })

  it('accepts a family', () => {
    expect(validateGiverNames(['Ana', 'Beto', 'Carla'])).toBeNull()
  })
})

describe('joinNames', () => {
  it('joins names the way people say them', () => {
    expect(joinNames(['Ana'])).toBe('Ana')
    expect(joinNames(['Ana', 'Beto'])).toBe('Ana e Beto')
    expect(joinNames(['Ana', 'Beto', 'Carla'])).toBe('Ana, Beto e Carla')
  })
})
