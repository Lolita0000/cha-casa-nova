import { useMemo, useState } from 'react'

import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { formatCents } from '@/lib/format/currency'

import {
  filterRecords,
  recordsToCsv,
  summarize,
  summarizeByGift,
  type RecordFilters,
} from './adminStats'
import { downloadCsv } from './download'
import { GiftSummaryList } from './GiftSummaryList'
import { RecordCard } from './RecordCard'
import { useGiftRecords } from './useGiftRecords'

type DashboardTab = 'records' | 'gifts'

export function GiftsDashboard() {
  const { records, isLoading, error, reload, setStatus, remove } = useGiftRecords()
  const [tab, setTab] = useState<DashboardTab>('records')
  const [filters, setFilters] = useState<RecordFilters>({ status: 'all', method: 'all', query: '' })

  const summary = useMemo(() => summarize(records), [records])
  const giftSummaries = useMemo(() => summarizeByGift(records), [records])
  const visibleRecords = useMemo(() => filterRecords(records, filters), [records, filters])

  const tabs: TabItem<DashboardTab>[] = [
    {
      id: 'records',
      label: 'Quem deu',
      content: (
        <>
          <Filters filters={filters} onChange={setFilters} />
          {visibleRecords.length === 0 ? (
            <p className="mt-4 rounded-[1.5rem] bg-white p-6 text-ash-600">
              {records.length === 0
                ? 'Ninguém registrou presente ainda. Quando alguém confirmar, aparece aqui.'
                : 'Nenhum registro com esses filtros.'}
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 lg:grid-cols-2">
              {visibleRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onStatusChange={setStatus}
                  onDelete={remove}
                />
              ))}
            </ul>
          )}
        </>
      ),
    },
    { id: 'gifts', label: 'Por presente', content: <GiftSummaryList summaries={giftSummaries} /> },
  ]

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pix informados" value={formatCents(summary.pixDeclaredInCents)} />
        <Stat label="Pix confirmados" value={formatCents(summary.pixConfirmedInCents)} />
        <Stat label="Itens que vão comprar" value={String(summary.purchaseCount)} />
        <Stat
          label="Pra conferir"
          value={String(summary.pendingCount)}
          highlight={summary.pendingCount > 0}
        />
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="h-10 rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-bold text-ink-800 hover:border-rose-300 disabled:opacity-60"
        >
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
        <button
          type="button"
          onClick={() => downloadCsv(recordsToCsv(records), 'presentes')}
          disabled={records.length === 0}
          className="h-10 rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-bold text-ink-800 hover:border-rose-300 disabled:opacity-60"
        >
          Baixar planilha
        </button>
        {error && (
          <p role="alert" className="text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}
      </div>

      <Tabs label="Visualização" tabs={tabs} activeId={tab} onChange={setTab} />
    </div>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-[1.5rem] p-5 ${highlight ? 'bg-rose-200' : 'bg-white'}`}>
      <dt className="text-sm font-semibold text-ash-600">{label}</dt>
      <dd className="mt-1 font-display text-2xl text-ink-900 tabular-nums sm:text-3xl">{value}</dd>
    </div>
  )
}

interface FiltersProps {
  filters: RecordFilters
  onChange: (filters: RecordFilters) => void
}

function Filters({ filters, onChange }: FiltersProps) {
  const selectClass =
    'h-11 rounded-full border-2 border-ash-200 bg-white px-4 text-sm font-semibold text-ink-800 outline-none focus:border-rose-400'
  return (
    <div className="flex flex-wrap gap-2">
      <label className="sr-only" htmlFor="admin-search">
        Buscar
      </label>
      <input
        id="admin-search"
        type="search"
        placeholder="Buscar nome ou presente"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        className="h-11 min-w-0 flex-1 basis-56 rounded-full border-2 border-ash-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
      />
      <label className="sr-only" htmlFor="admin-status">
        Situação
      </label>
      <select
        id="admin-status"
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as RecordFilters['status'] })
        }
        className={selectClass}
      >
        <option value="all">Todas as situações</option>
        <option value="pending">Pendentes</option>
        <option value="confirmed">Confirmados</option>
        <option value="cancelled">Cancelados</option>
      </select>
      <label className="sr-only" htmlFor="admin-method">
        Forma
      </label>
      <select
        id="admin-method"
        value={filters.method}
        onChange={(event) =>
          onChange({ ...filters, method: event.target.value as RecordFilters['method'] })
        }
        className={selectClass}
      >
        <option value="all">Pix e compras</option>
        <option value="pix">Só Pix</option>
        <option value="purchase">Só compras</option>
      </select>
    </div>
  )
}
