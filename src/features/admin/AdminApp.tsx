import { useEffect, useState } from 'react'

import { Container } from '@/components/ui/Container'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { siteConfig } from '@/config/site'
import { joinNames } from '@/features/registry/giverNames'
import { publicAsset } from '@/lib/assets/publicAsset'
import { isBackendConfigured } from '@/lib/supabase/client'

import { GiftsDashboard } from './GiftsDashboard'
import { GuestListPanel } from './GuestListPanel'
import { LettersPanel } from './LettersPanel'
import { checkAdminKey } from '@/features/registry/api'

import { forgetAdminKey, loadAdminKey } from './adminKey'
import { AdminKeyContext } from './adminKeyContext'

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

type KeyState = 'checking' | 'valid' | 'invalid' | 'error'

function AdminContent() {
  const [adminKey] = useState(loadAdminKey)
  const [keyState, setKeyState] = useState<KeyState>(adminKey ? 'checking' : 'invalid')

  useEffect(() => {
    if (!adminKey) return
    let isCurrent = true
    checkAdminKey(adminKey)
      .then((valid) => {
        if (!isCurrent) return
        if (!valid) forgetAdminKey()
        setKeyState(valid ? 'valid' : 'invalid')
      })
      .catch(() => isCurrent && setKeyState('error'))
    return () => {
      isCurrent = false
    }
  }, [adminKey])

  if (keyState === 'checking') {
    return <p className="text-ash-600">Carregando...</p>
  }

  if (keyState !== 'valid' || !adminKey) {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 sm:p-8">
        <h1 className="font-display text-3xl text-ink-900">
          {keyState === 'error' ? 'Não deu pra abrir agora' : 'Painel fechado'}
        </h1>
        <p className="mt-3 text-ash-600">
          {keyState === 'error'
            ? 'O banco não respondeu. Tente recarregar a página daqui a pouquinho.'
            : 'Esse painel só abre pelo link especial da Aninha e do Gabriel.'}
        </p>
      </div>
    )
  }

  return (
    <AdminKeyContext.Provider value={adminKey}>
      <h1 className="mb-8 font-display text-4xl text-ink-900">Presentes, cartinhas e presença</h1>
      <AdminSections />
    </AdminKeyContext.Provider>
  )
}

type Section = 'gifts' | 'letters' | 'guests'

function AdminSections() {
  const [section, setSection] = useState<Section>('gifts')
  const sections: TabItem<Section>[] = [
    { id: 'gifts', label: 'Presentes', content: <GiftsDashboard /> },
    { id: 'letters', label: 'Cartinhas', content: <LettersPanel /> },
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
