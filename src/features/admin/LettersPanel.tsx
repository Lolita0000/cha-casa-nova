import { useEffect, useMemo, useState } from 'react'

import { joinNames } from '@/features/registry/giverNames'

import { collectLetters, countNewLetters } from './letters'
import { useGiftRecords } from './useGiftRecords'
import { useRsvps } from './useRsvps'

const LAST_SEEN_KEY = 'cha-casa-nova:letters-last-seen:v1'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

function readLastSeen(): string | null {
  try {
    return localStorage.getItem(LAST_SEEN_KEY)
  } catch {
    return null
  }
}

export function LettersPanel() {
  const gifts = useGiftRecords()
  const guests = useRsvps()
  // Read once, so letters stay marked as new for this whole visit.
  const [lastSeenAt] = useState(readLastSeen)

  const letters = useMemo(
    () => collectLetters(gifts.records, guests.rsvps),
    [gifts.records, guests.rsvps],
  )
  const newCount = countNewLetters(letters, lastSeenAt)
  const isLoading = gifts.isLoading || guests.isLoading

  useEffect(() => {
    if (isLoading || letters.length === 0) return
    try {
      localStorage.setItem(LAST_SEEN_KEY, letters[0].createdAt)
    } catch {
      // Without storage every letter just shows as new again next time.
    }
  }, [isLoading, letters])

  const error = gifts.error ?? guests.error

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-ash-600">
          {isLoading
            ? 'Carregando as cartinhas...'
            : letters.length === 0
              ? 'Nenhuma cartinha ainda. Quando alguém escrever, ela aparece aqui.'
              : `${letters.length} ${letters.length === 1 ? 'cartinha' : 'cartinhas'}${newCount > 0 ? `, ${newCount} ${newCount === 1 ? 'nova' : 'novas'}` : ''}.`}
        </p>
        <button
          type="button"
          onClick={() => {
            gifts.reload()
            guests.reload()
          }}
          className="h-10 rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-bold text-ink-800 hover:border-rose-300"
        >
          Atualizar
        </button>
        {error && (
          <p role="alert" className="text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}
      </div>

      <ul className="grid gap-4 lg:grid-cols-2">
        {letters.map((letter) => {
          const isNew = !lastSeenAt || letter.createdAt > lastSeenAt
          return (
            <li
              key={letter.id}
              className="rounded-[1.75rem] border-2 border-rose-200 bg-rose-50 p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm text-ash-600">
                  {dateFormatter.format(new Date(letter.createdAt))}
                </p>
                {isNew && (
                  <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                    Nova
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-xl leading-relaxed whitespace-pre-line text-ink-900">
                {letter.text}
              </p>
              <p className="mt-5 font-bold text-ink-900">Com carinho, {joinNames(letter.names)}</p>
              <p className="mt-1 text-sm text-ash-600">
                {letter.source === 'gift' ? `Presente: ${letter.context}` : letter.context}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
