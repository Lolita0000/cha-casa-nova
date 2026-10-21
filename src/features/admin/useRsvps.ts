import { useCallback, useEffect, useState } from 'react'

import { deleteRsvp, fetchRsvps } from '@/features/registry/api'
import type { Rsvp } from '@/features/registry/types'

import { useAdminKey } from './adminKeyContext'

function errorMessage(caught: unknown, fallback: string): string {
  return caught instanceof Error && caught.message ? caught.message : fallback
}

export function useRsvps() {
  const key = useAdminKey()
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true
    const load = () =>
      fetchRsvps(key)
        .then((next) => {
          if (!isCurrent) return
          setRsvps(next)
          setError(null)
        })
        .catch((caught: unknown) => {
          if (isCurrent) setError(errorMessage(caught, 'Não foi possível carregar a lista.'))
        })
        .finally(() => {
          if (isCurrent) setIsLoading(false)
        })

    void load()
    const onFocus = () => void load()
    window.addEventListener('focus', onFocus)
    return () => {
      isCurrent = false
      window.removeEventListener('focus', onFocus)
    }
  }, [key, version])

  const reload = useCallback(() => {
    setIsLoading(true)
    setVersion((current) => current + 1)
  }, [])

  const remove = useCallback(
    async (id: string) => {
      setRsvps((current) => current.filter((rsvp) => rsvp.id !== id))
      try {
        await deleteRsvp(key, id)
      } catch (caught) {
        setError(errorMessage(caught, 'Não foi possível apagar.'))
        reload()
      }
    },
    [key, reload],
  )

  return { rsvps, isLoading, error, reload, remove }
}
