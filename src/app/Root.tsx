import { lazy, Suspense, useEffect, useState } from 'react'

import { App } from './App'

// Guests never download the admin code.
const AdminApp = lazy(() =>
  import('@/features/admin/AdminApp').then((module) => ({ default: module.AdminApp })),
)

const ADMIN_HASH = '#/admin'

function isAdminRoute() {
  return window.location.hash.startsWith(ADMIN_HASH)
}

/** Hash routing keeps GitHub Pages happy: there is a single index.html. */
export function Root() {
  const [isAdmin, setIsAdmin] = useState(isAdminRoute)

  useEffect(() => {
    const onHashChange = () => setIsAdmin(isAdminRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (!isAdmin) return <App />

  return (
    <Suspense fallback={<p className="p-8 text-ash-600">Carregando...</p>}>
      <AdminApp />
    </Suspense>
  )
}
