import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { isBackendConfigured } from '@/lib/supabase/client'

import { fetchPublicStatus } from './api'
import { EMPTY_STATUS, GiftStatusContext, type GiftStatusContextValue } from './giftStatusContext'
import type { GiftPublicStatus } from './types'

/** Loads what other guests already gave, so progress bars and "already bought" badges are live. */
export function GiftStatusProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<Map<string, GiftPublicStatus>>(new Map())
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!isBackendConfigured) return
    let isCurrent = true
    fetchPublicStatus()
      .then((next) => isCurrent && setStatuses(next))
      // The list still works with the static values if the backend is unreachable.
      .catch((error: unknown) => console.warn('Could not load gift status', error))
    return () => {
      isCurrent = false
    }
  }, [version])

  const refresh = useCallback(() => setVersion((current) => current + 1), [])

  const value = useMemo<GiftStatusContextValue>(
    () => ({ statusOf: (giftId) => statuses.get(giftId) ?? EMPTY_STATUS, refresh }),
    [statuses, refresh],
  )

  return <GiftStatusContext.Provider value={value}>{children}</GiftStatusContext.Provider>
}
