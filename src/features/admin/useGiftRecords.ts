import { useCallback, useEffect, useState } from 'react'

import { deleteRecord, fetchRecords, updateRecordStatus } from '@/features/registry/api'
import type { GiftRecord, GiftRecordStatus } from '@/features/registry/types'

import { useAdminKey } from './adminKeyContext'

function errorMessage(caught: unknown, fallback: string): string {
  return caught instanceof Error && caught.message ? caught.message : fallback
}

export function useGiftRecords() {
  const key = useAdminKey()
  const [records, setRecords] = useState<GiftRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true
    const load = () =>
      fetchRecords(key)
        .then((next) => {
          if (!isCurrent) return
          setRecords(next)
          setError(null)
        })
        .catch((caught: unknown) => {
          if (isCurrent) setError(errorMessage(caught, 'Não foi possível carregar os presentes.'))
        })
        .finally(() => {
          if (isCurrent) setIsLoading(false)
        })

    void load()
    // New gifts arrive while the page is open, so refresh when the admin comes back to it.
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

  const setStatus = useCallback(
    async (id: string, status: GiftRecordStatus) => {
      setRecords((current) =>
        current.map((record) => (record.id === id ? { ...record, status } : record)),
      )
      try {
        await updateRecordStatus(key, id, status)
      } catch (caught) {
        setError(errorMessage(caught, 'Não foi possível salvar.'))
        reload()
      }
    },
    [key, reload],
  )

  const remove = useCallback(
    async (id: string) => {
      setRecords((current) => current.filter((record) => record.id !== id))
      try {
        await deleteRecord(key, id)
      } catch (caught) {
        setError(errorMessage(caught, 'Não foi possível apagar.'))
        reload()
      }
    },
    [key, reload],
  )

  return { records, isLoading, error, reload, setStatus, remove }
}
