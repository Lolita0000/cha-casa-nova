export const MAX_GIVER_NAMES = 12
export const MAX_NAME_LENGTH = 80

/** Trims every name and drops the empty ones. */
export function cleanGiverNames(names: string[]): string[] {
  return names.map((name) => name.trim().replace(/\s+/g, ' ')).filter(Boolean)
}

export function validateGiverNames(names: string[]): string | null {
  const cleaned = cleanGiverNames(names)
  if (cleaned.length === 0) return 'Escreva pelo menos um nome.'
  if (cleaned.length > MAX_GIVER_NAMES) return `Dá pra colocar até ${MAX_GIVER_NAMES} nomes.`
  if (cleaned.some((name) => name.length > MAX_NAME_LENGTH)) {
    return `Cada nome pode ter até ${MAX_NAME_LENGTH} letras.`
  }
  return null
}

/** "Ana", "Ana e Beto", "Ana, Beto e Carla". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}
