import { createContext, useContext } from 'react'

/** The secret key from the admin link, needed by every admin call. */
export const AdminKeyContext = createContext('')

export function useAdminKey(): string {
  return useContext(AdminKeyContext)
}
