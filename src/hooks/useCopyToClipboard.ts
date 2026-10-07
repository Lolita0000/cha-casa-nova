import { useCallback, useEffect, useRef, useState } from 'react'

const RESET_AFTER_MS = 2500

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setHasCopied(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setHasCopied(false), RESET_AFTER_MS)
      return true
    } catch {
      return false
    }
  }, [])

  return { copy, hasCopied }
}
