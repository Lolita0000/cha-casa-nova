/**
 * CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF), the checksum required by
 * the Pix BR Code spec. Returns 4 uppercase hex characters.
 */
export function crc16Ccitt(payload: string): string {
  let crc = 0xffff

  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}
