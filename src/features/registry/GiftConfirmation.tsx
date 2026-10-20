import { useId, useState, type FormEvent } from 'react'

import { HeartIcon } from '@/components/icons/icons'
import { Button } from '@/components/ui/Button'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { siteConfig } from '@/config/site'
import { formatCents, reaisToCents } from '@/lib/format/currency'
import { isBackendConfigured } from '@/lib/supabase/client'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { rsvpDeadline } from '@/config/event'
import { RsvpForm } from '@/features/rsvp/RsvpForm'
import { useRsvp } from '@/features/rsvp/useRsvp'
import { formatShortDate, isOnOrBefore } from '@/lib/date/event'

import { addGiftLetter, registerGift } from './api'
import { cleanGiverNames, joinNames, validateGiverNames } from './giverNames'
import { buildNotifyMessage } from './messages'
import { LetterField } from './LetterField'
import { NameListInput } from './NameListInput'
import { loadRememberedNames, rememberNames } from './rememberedNames'
import type { GiftMethod, GiftRecordItemInput } from './types'

interface GiftConfirmationProps {
  items: GiftRecordItemInput[]
  defaultMethod: GiftMethod
  /** Free Pix contributions can't be "bought", so they hide that choice. */
  allowPurchase?: boolean
  /** Asks for the amount, for contributions without a fixed value. */
  customAmountFor?: { giftId: string; giftName: string }
  onBack?: () => void
  onConfirmed?: () => void
}

type Step =
  | { name: 'form' }
  | {
      name: 'done'
      names: string[]
      method: GiftMethod
      items: GiftRecordItemInput[]
      recordId: string | null
      hasLetter: boolean
    }

const coupleNames = joinNames([...siteConfig.coupleNames])

export function GiftConfirmation({
  items,
  defaultMethod,
  allowPurchase = true,
  customAmountFor,
  onBack,
  onConfirmed,
}: GiftConfirmationProps) {
  const [step, setStep] = useState<Step>({ name: 'form' })
  const [method, setMethod] = useState<GiftMethod>(defaultMethod)
  const [names, setNames] = useState<string[]>(() => {
    const remembered = loadRememberedNames()
    return remembered.length > 0 ? remembered : ['']
  })
  const [message, setMessage] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [namesError, setNamesError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const amountId = useId()

  function resolveItems(): GiftRecordItemInput[] | null {
    if (!customAmountFor) return items
    const reais = Number(customAmount.replace(',', '.'))
    if (!customAmount || Number.isNaN(reais) || reais <= 0) {
      setAmountError('Escreva o valor do Pix que você mandou.')
      return null
    }
    setAmountError(null)
    return [{ ...customAmountFor, amountInCents: reaisToCents(reais) }]
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nameProblem = validateGiverNames(names)
    setNamesError(nameProblem)
    const finalItems = resolveItems()
    if (nameProblem || !finalItems) return

    const giverNames = cleanGiverNames(names)
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const recordId = isBackendConfigured
        ? await registerGift({ giverNames, method, items: finalItems, message })
        : null
      rememberNames(giverNames)
      setStep({
        name: 'done',
        names: giverNames,
        method,
        items: finalItems,
        recordId,
        hasLetter: message.trim().length > 0,
      })
      onConfirmed?.()
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? `Não conseguimos registrar agora: ${error.message}`
          : 'Não conseguimos registrar agora. Tente de novo em instantes.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step.name === 'done') {
    return (
      <>
        <GiftThanks
          names={step.names}
          method={step.method}
          items={step.items}
          recordId={step.recordId}
          hasLetter={step.hasLetter}
        />
        <RsvpPrompt names={step.names} />
      </>
    )
  }

  const total = items.reduce((sum, item) => sum + item.amountInCents, 0)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {allowPurchase && (
        <fieldset>
          <legend className="font-bold text-ink-900">Como você presenteou?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <MethodOption
              checked={method === 'pix'}
              onSelect={() => setMethod('pix')}
              title="Fiz o Pix"
              detail={total > 0 ? `de ${formatCents(total)}` : 'pelo QR Code ou copia e cola'}
            />
            <MethodOption
              checked={method === 'purchase'}
              onSelect={() => setMethod('purchase')}
              title="Vou comprar os itens"
              detail="ou já comprei"
            />
          </div>
        </fieldset>
      )}

      {customAmountFor && (
        <div>
          <label htmlFor={amountId} className="font-bold text-ink-900">
            Quanto você mandou?
          </label>
          <div className="mt-2 flex h-12 items-center gap-2 rounded-2xl border-2 border-ash-200 bg-white px-4 focus-within:border-rose-400">
            <span className="text-ash-600">R$</span>
            <input
              id={amountId}
              inputMode="decimal"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="0,00"
              aria-invalid={Boolean(amountError) || undefined}
              className="min-w-0 flex-1 bg-transparent text-ink-900 tabular-nums outline-none"
            />
          </div>
          {amountError && (
            <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
              {amountError}
            </p>
          )}
        </div>
      )}

      <NameListInput names={names} onChange={setNames} error={namesError} />

      <LetterField value={message} onChange={setMessage} />

      {submitError && (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? 'Registrando...'
            : method === 'pix'
              ? 'Confirmar que mandei o Pix'
              : 'Confirmar que vou comprar'}
        </Button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-ash-600 underline underline-offset-4 hover:text-ink-800"
          >
            Voltar
          </button>
        )}
      </div>
    </form>
  )
}

interface MethodOptionProps {
  checked: boolean
  onSelect: () => void
  title: string
  detail: string
}

function MethodOption({ checked, onSelect, title, detail }: MethodOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${
        checked ? 'border-rose-400 bg-rose-50' : 'border-ash-200 bg-white hover:border-rose-300'
      }`}
    >
      <input
        type="radio"
        name="gift-method"
        checked={checked}
        onChange={onSelect}
        className="mt-1 size-4 accent-rose-500"
      />
      <span>
        <span className="block font-bold text-ink-900">{title}</span>
        <span className="block text-sm text-ash-600">{detail}</span>
      </span>
    </label>
  )
}

interface GiftThanksProps {
  names: string[]
  method: GiftMethod
  items: GiftRecordItemInput[]
  recordId: string | null
  hasLetter: boolean
}

function GiftThanks({ names, method, items, recordId, hasLetter }: GiftThanksProps) {
  return (
    <div className="text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-rose-100 text-rose-500">
        <HeartIcon className="size-7" />
      </span>
      <p className="mt-4 font-display text-2xl text-ink-900">Obrigado, {joinNames(names)}!</p>
      <p className="mt-2 text-ash-600">
        {method === 'pix'
          ? `Seu Pix ficou registrado e ${coupleNames} já ficam sabendo por aqui.`
          : `Esses itens ficaram reservados e ${coupleNames} já ficam sabendo por aqui.`}
        {hasLetter && ' Sua cartinha foi entregue também.'}
      </p>

      {recordId && !hasLetter && <LaterLetter recordId={recordId} />}

      {!isBackendConfigured && (
        // Without the database nothing reaches the couple, so WhatsApp is the fallback.
        <a
          href={buildWhatsAppUrl(
            siteConfig.whatsappNumber,
            buildNotifyMessage(method, names, items),
          )}
          target="_blank"
          rel="noreferrer"
          className={buttonClassName({ className: 'mt-6 w-full' })}
        >
          Avisar {coupleNames} no WhatsApp
        </a>
      )}
    </div>
  )
}

/** For guests who skipped the letter: they can still write it here. */
function LaterLetter({ recordId }: { recordId: string }) {
  const [state, setState] = useState<'closed' | 'writing' | 'sending' | 'sent'>('closed')
  const [letter, setLetter] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function send() {
    if (!letter.trim()) {
      setError('Escreva a cartinha antes de enviar.')
      return
    }
    setState('sending')
    setError(null)
    try {
      await addGiftLetter(recordId, letter)
      setState('sent')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não conseguimos enviar agora.')
      setState('writing')
    }
  }

  if (state === 'sent') {
    return (
      <p className="mt-6 rounded-2xl bg-rose-50 p-4 font-semibold text-ink-800">
        Cartinha entregue!
      </p>
    )
  }

  if (state === 'closed') {
    return (
      <Button variant="outline" onClick={() => setState('writing')} className="mt-6 w-full">
        Escrever uma cartinha
      </Button>
    )
  }

  return (
    <div className="mt-6 space-y-3 text-left">
      <LetterField value={letter} onChange={setLetter} autoFocus />
      {error && (
        <p role="alert" className="text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
      <Button onClick={() => void send()} disabled={state === 'sending'} className="w-full">
        {state === 'sending' ? 'Enviando...' : 'Enviar cartinha'}
      </Button>
    </div>
  )
}

/** Right after a gift is the easiest moment to also confirm presence. */
function RsvpPrompt({ names }: { names: string[] }) {
  const { confirmed } = useRsvp()
  const [isOpen, setIsOpen] = useState(false)

  if (rsvpDeadline && !isOnOrBefore(rsvpDeadline)) return null

  if (isOpen) {
    return (
      <div className="mt-8 border-t-2 border-ash-100 pt-6">
        <p className="mb-5 font-display text-2xl text-ink-900">Confirmar presença</p>
        <RsvpForm initialNames={names} />
      </div>
    )
  }

  if (confirmed) {
    return (
      <p className="mt-6 text-center text-sm text-ash-600">
        Sua presença já está confirmada, não precisa confirmar de novo.
      </p>
    )
  }

  return (
    <div className="mt-8 rounded-3xl bg-rose-50 p-5 text-left">
      <p className="font-bold text-ink-900">E aí, vai estar na festa?</p>
      <p className="mt-1 text-sm text-ash-600">
        {rsvpDeadline
          ? `Confirme sua presença até ${formatShortDate(rsvpDeadline)}, pra gente passar seu nome pro porteiro.`
          : 'Confirme sua presença pra gente passar seu nome pro porteiro.'}
      </p>
      <Button variant="soft" size="sm" onClick={() => setIsOpen(true)} className="mt-4">
        Confirmar presença
      </Button>
    </div>
  )
}
