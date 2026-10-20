import { useState } from 'react'

import { Container } from '@/components/ui/Container'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { siteConfig } from '@/config/site'
import { joinNames } from '@/features/registry/giverNames'
import { publicAsset } from '@/lib/assets/publicAsset'
import { isBackendConfigured } from '@/lib/supabase/client'

import { GiftsDashboard } from './GiftsDashboard'
import { GuestListPanel } from './GuestListPanel'
import { LoginForm } from './LoginForm'
import { useAdminSession } from './useAdminSession'

export function AdminApp() {
  return (
    <div className="min-h-svh bg-ash-50">
      <header className="bg-rose-100">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <p className="font-display text-2xl text-ink-900">Painel do chá</p>
            <p className="text-sm text-ink-700">{joinNames([...siteConfig.coupleNames])}</p>
          </div>
          <a
            href={publicAsset('/')}
            className="text-sm font-bold text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4"
          >
            Ver o convite
          </a>
        </Container>
      </header>
      <main>
        <Container className="py-10">
          {isBackendConfigured ? <AdminContent /> : <SetupNeeded />}
        </Container>
      </main>
    </div>
  )
}

function AdminContent() {
  const { session, signIn, signOut } = useAdminSession()

  if (session.state === 'loading') {
    return <p className="text-ash-600">Carregando...</p>
  }

  if (session.state === 'signed-out') {
    return (
      <div className="mx-auto max-w-sm rounded-[2rem] bg-white p-6 sm:p-8">
        <h1 className="mb-6 font-display text-3xl text-ink-900">Entrar</h1>
        <LoginForm onSignIn={signIn} />
      </div>
    )
  }

  const signOutButton = (
    <button
      type="button"
      onClick={() => void signOut()}
      className="text-sm font-bold text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4"
    >
      Sair
    </button>
  )

  if (session.state === 'not-admin') {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 sm:p-8">
        <p className="text-ink-900">
          A conta <strong>{session.email}</strong> ainda não tem acesso ao painel. Rode o arquivo{' '}
          <code>supabase/make-admin.sql</code> com esse e-mail no Supabase.
        </p>
        <div className="mt-6">{signOutButton}</div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-4xl text-ink-900">Presentes e presença</h1>
        <p className="flex items-center gap-3 text-sm text-ash-600">
          {session.email} {signOutButton}
        </p>
      </div>
      <AdminSections />
    </>
  )
}

type Section = 'gifts' | 'guests'

function AdminSections() {
  const [section, setSection] = useState<Section>('gifts')
  const sections: TabItem<Section>[] = [
    { id: 'gifts', label: 'Presentes', content: <GiftsDashboard /> },
    { id: 'guests', label: 'Lista de presença', content: <GuestListPanel /> },
  ]
  return <Tabs label="Seções do painel" tabs={sections} activeId={section} onChange={setSection} />
}

function SetupNeeded() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 sm:p-8">
      <h1 className="font-display text-3xl text-ink-900">Falta ligar o banco</h1>
      <p className="mt-3 text-ash-600">
        O site foi publicado sem as variáveis <code>VITE_SUPABASE_URL</code> e{' '}
        <code>VITE_SUPABASE_ANON_KEY</code>. O passo a passo está no README, na seção “Banco de
        dados e painel”.
      </p>
    </div>
  )
}
