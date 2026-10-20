import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase/client'

export type AdminSession =
  | { state: 'loading' }
  | { state: 'signed-out' }
  | { state: 'not-admin'; email: string }
  | { state: 'admin'; email: string }

async function resolveSession(session: Session | null): Promise<AdminSession> {
  if (!session || !supabase) return { state: 'signed-out' }
  const email = session.user.email ?? ''
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true ? { state: 'admin', email } : { state: 'not-admin', email }
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession>({ state: 'loading' })

  useEffect(() => {
    if (!supabase) return
    let isCurrent = true
    const update = (next: Session | null) =>
      resolveSession(next).then((resolved) => isCurrent && setSession(resolved))

    supabase.auth.getSession().then(({ data }) => update(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      void update(next)
    })
    return () => {
      isCurrent = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'O banco ainda não foi configurado.'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? 'E-mail ou senha incorretos.' : null
  }, [])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return { session, signIn, signOut }
}
