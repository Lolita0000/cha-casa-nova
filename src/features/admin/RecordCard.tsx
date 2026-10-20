import { useState } from 'react'

import { joinNames } from '@/features/registry/giverNames'
import type { GiftRecord, GiftRecordStatus } from '@/features/registry/types'
import { formatCents } from '@/lib/format/currency'

import { methodLabel, statusLabel } from './adminStats'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

const STATUS_STYLES: Record<GiftRecordStatus, string> = {
  pending: 'bg-wood-200 text-ink-900',
  confirmed: 'bg-rose-200 text-ink-900',
  cancelled: 'bg-ash-100 text-ash-600 line-through',
}

interface RecordCardProps {
  record: GiftRecord
  onStatusChange: (id: string, status: GiftRecordStatus) => void
  onDelete: (id: string) => void
}

export function RecordCard({ record, onStatusChange, onDelete }: RecordCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const isPix = record.method === 'pix'

  return (
    <li
      className={`rounded-[1.5rem] bg-white p-5 sm:p-6 ${record.status === 'cancelled' ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-bold break-words text-ink-900">
            {joinNames(record.giverNames)}
          </p>
          <p className="text-sm text-ash-600">{dateFormatter.format(new Date(record.createdAt))}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${isPix ? 'bg-ink-800 text-white' : 'bg-ash-600 text-white'}`}
          >
            {methodLabel(record.method)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[record.status]}`}
          >
            {statusLabel(record.status)}
          </span>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-ash-100 border-y border-ash-100">
        {record.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 py-2 text-sm">
            <span className="min-w-0 text-ink-800">{item.giftName}</span>
            {isPix && (
              <span className="shrink-0 font-semibold text-ink-900 tabular-nums">
                {formatCents(item.amountInCents)}
              </span>
            )}
          </li>
        ))}
      </ul>

      {isPix && (
        <p className="mt-3 flex justify-between font-bold text-ink-900">
          <span>Total do Pix</span>
          <span className="tabular-nums">{formatCents(record.totalInCents)}</span>
        </p>
      )}

      {record.message && (
        <blockquote className="mt-4 rounded-2xl bg-rose-50 p-4 text-ink-800 italic">
          “{record.message}”
        </blockquote>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {record.status !== 'confirmed' && (
          <ActionButton onClick={() => onStatusChange(record.id, 'confirmed')} primary>
            {isPix ? 'Confirmar que recebi' : 'Confirmar'}
          </ActionButton>
        )}
        {record.status !== 'pending' && (
          <ActionButton onClick={() => onStatusChange(record.id, 'pending')}>
            Voltar pra pendente
          </ActionButton>
        )}
        {record.status !== 'cancelled' && (
          <ActionButton onClick={() => onStatusChange(record.id, 'cancelled')}>
            Cancelar
          </ActionButton>
        )}
        {isConfirmingDelete ? (
          <span className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-rose-700">Apagar de vez?</span>
            <ActionButton onClick={() => onDelete(record.id)} danger>
              Sim, apagar
            </ActionButton>
            <ActionButton onClick={() => setIsConfirmingDelete(false)}>Não</ActionButton>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="ml-auto text-sm font-semibold text-ash-500 underline underline-offset-4 hover:text-rose-700"
          >
            Apagar
          </button>
        )}
      </div>
    </li>
  )
}

interface ActionButtonProps {
  onClick: () => void
  children: React.ReactNode
  primary?: boolean
  danger?: boolean
}

function ActionButton({ onClick, children, primary = false, danger = false }: ActionButtonProps) {
  const tone = danger
    ? 'bg-rose-700 text-white hover:bg-rose-500'
    : primary
      ? 'bg-ink-800 text-white hover:bg-ink-700'
      : 'border-2 border-ash-200 text-ink-800 hover:border-rose-300'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full px-4 text-sm font-bold transition-colors ${tone}`}
    >
      {children}
    </button>
  )
}
