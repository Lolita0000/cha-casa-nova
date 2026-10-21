import { useCallback, useState } from 'react'

/**
 * Keeps the gift dialog open until the guest signs the gift: closing attempts
 * are counted so the form can say what is missing.
 */
export function useConfirmationLock(initiallyLocked = false) {
  const [isLocked, setIsLocked] = useState(initiallyLocked)
  const [closeAttempts, setCloseAttempts] = useState(0)

  const lock = useCallback(() => {
    setIsLocked(true)
    setCloseAttempts(0)
  }, [])
  const unlock = useCallback(() => setIsLocked(false), [])
  const registerCloseAttempt = useCallback(() => setCloseAttempts((count) => count + 1), [])

  return { isLocked, closeAttempts, lock, unlock, registerCloseAttempt }
}
