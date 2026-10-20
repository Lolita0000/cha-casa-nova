import { useMemo, useState } from 'react'

import { rsvpDeadline } from '@/config/event'
import { joinNames } from '@/features/registry/giverNames'
import { formatShortDate } from '@/lib/date/event'

import { downloadCsv } from './download'
import { doormanList, doormanText, rsvpsToCsv, summarizeGuests } from './guestList'
import { useRsvps } from './useRsvps'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

const secondaryButton =
  'h-10 rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-bold text-ink-800 hover:border-rose-300 disabled:opacity-60'

export function GuestListPanel() {
  const { rsvps, isLoading, error, reload, remove } = useRsvps()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const summary = useMemo(() => summarizeGuests(rsvps), [rsvps])
  const names = useMemo(() => doormanList(rsvps), [rsvps])

  async function copyList() {
    try {
      await navigator.clipboard.writeText(doormanText(rsvps))
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Pessoas confirmadas" value={summary.attendingCount} highlight />
        <Stat label="Não vão" value={summary.notAttendingCount} />
        <Stat label="Respostas" value={summary.responseCount} />
      </dl>

      {rsvpDeadline && (
        <p className="text-ash-600">
          Prazo pros convidados:{' '}
          <strong className="text-ink-900">{formatShortDate(rsvpDeadline)}</strong>. Depois disso, o
          site avisa que a lista foi fechada.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={reload} disabled={isLoading} className={secondaryButton}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
        <button
          type="button"
          onClick={() => downloadCsv(rsvpsToCsv(rsvps), 'lista-de-presenca')}
          disabled={rsvps.length === 0}
          className={secondaryButton}
        >
          Baixar planilha
        </button>
        {error && (
          <p role="alert" className="text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}
      </div>

      <section aria-labelledby="doorman-title" className="rounded-[1.5rem] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="doorman-title" className="font-display text-2xl text-ink-900">
            Lista pro porteiro
          </h2>
          <button
            type="button"
            onClick={() => void copyList()}
            disabled={names.length === 0}
            className="h-10 rounded-full bg-ink-800 px-5 text-sm font-bold text-white hover:bg-ink-700 disabled:opacity-60"
          >
            {copyState === 'copied' ? 'Lista copiada!' : 'Copiar lista'}
          </button>
        </div>
        <p className="mt-1 text-sm text-ash-600">
          Só quem disse que vai, em ordem alfabética e sem repetir nomes.
        </p>
        {copyState === 'failed' && (
          <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
            O navegador não deixou copiar. Selecione a lista abaixo e copie.
          </p>
        )}
        {names.length === 0 ? (
          <p className="mt-4 text-ash-600">Ninguém confirmou ainda.</p>
        ) : (
          <ol className="mt-4 columns-1 gap-8 text-ink-900 sm:columns-2 lg:columns-3">
            {names.map((name, index) => (
              <li key={name} className="break-inside-avoid py-1 tabular-nums">
                <span className="text-ash-500">{index + 1}.</span> {name}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="answers-title">
        <h2 id="answers-title" className="mb-4 font-display text-2xl text-ink-900">
          Todas as respostas
        </h2>
        {rsvps.length === 0 ? (
          <p className="rounded-[1.5rem] bg-white p-6 text-ash-600">
            Quando alguém confirmar presença, aparece aqui.
          </p>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {rsvps.map((rsvp) => (
              <li key={rsvp.id} className="rounded-[1.5rem] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold break-words text-ink-900">
                      {joinNames(rsvp.guestNames)}
                    </p>
                    <p className="text-sm text-ash-600">
                      {dateFormatter.format(new Date(rsvp.createdAt))}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${rsvp.attending ? 'bg-rose-200 text-ink-900' : 'bg-ash-100 text-ash-600'}`}
                  >
                    {rsvp.attending
                      ? `${rsvp.guestNames.length > 1 ? 'Vão' : 'Vai'} (${rsvp.guestNames.length})`
                      : 'Não vai'}
                  </span>
                </div>
                {rsvp.message && (
                  <blockquote className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm text-ink-800 italic">
                    “{rsvp.message}”
                  </blockquote>
                )}
                <div className="mt-3 flex justify-end">
                  {pendingDelete === rsvp.id ? (
                    <span className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-rose-700">Apagar de vez?</span>
                      <button
                        type="button"
                        onClick={() => {
                          void remove(rsvp.id)
                          setPendingDelete(null)
                        }}
                        className="h-8 rounded-full bg-rose-700 px-3 font-bold text-white"
                      >
                        Sim, apagar
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="h-8 rounded-full border-2 border-ash-200 px-3 font-bold text-ink-800"
                      >
                        Não
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(rsvp.id)}
                      className="text-sm font-semibold text-ash-500 underline underline-offset-4 hover:text-rose-700"
                    >
                      Apagar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={`rounded-[1.5rem] p-5 ${highlight ? 'bg-rose-200' : 'bg-white'}`}>
      <dt className="text-sm font-semibold text-ash-600">{label}</dt>
      <dd className="mt-1 font-display text-3xl text-ink-900 tabular-nums">{value}</dd>
    </div>
  )
}
