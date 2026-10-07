import { useMemo } from 'react'

import { siteConfig } from '@/config/site'
import { buildPixPayload } from '@/lib/pix/brCode'

export function usePixPayload(amountInCents: number | undefined, description?: string) {
  return useMemo(
    () =>
      buildPixPayload({
        ...siteConfig.pix,
        amountInCents,
        description,
      }),
    [amountInCents, description],
  )
}
