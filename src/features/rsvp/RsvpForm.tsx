import { useId, useState, type FormEvent } from 'react'

import { HeartIcon } from '@/components/icons/icons'
import { Button } from '@/components/ui/Button'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { rsvpDeadline } from '@/config/event'
import { siteConfig } from '@/config/site'
import { registerRsvp } from '@/features/registry/api'
import { cleanGiverNames, joinNames, validateGiverNames } from '@/features/registry/giverNames'
import { NameListInput } from '@/features/registry/NameListInput'
import { loadRememberedNames, rememberNames } from '@/features/registry/rememberedNames'
import { describeEventTime, formatEventDate, formatShortDate, isOnOrBefore } from '@/lib/date/event'
import { isBackendConfigured } from '@/lib/supabase/client'
import { byCount } from '@/lib/text/plural'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

import { useRsvp } from './useRsvp'

interface RsvpFormProps {
  /** Pre-fills the names, e.g. with the people who just gave a gift. */
  initialNames?: string[]
}

const coupleNames = joinNames([...siteConfig.coupleNames])

export function RsvpForm({ initialNames }: RsvpFormProps) {
  const { confirmed, markConfirmed } = useRsvp()
  const [names, setNames] = useState<string[]>(() => {
    const start = initialNames?.length ? initialNames : loadRememberedNames()
    return start.length > 0 ? start : ['']
  })
  const [attending, setAttending] = useState(true)
  const [message, setMessage] = useState('')
  const [namesError, setNamesError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const messageId = useId()
  const peopleCount = cleanGiverNames(names).length

  if (rsvpDeadline && !isOnOrBefore(rsvpDeadline) && !isDone) {
    return (
      <p className="rounded-2xl bg-rose-50 p-4 text-ink-800">
        O prazo pra confirmar presença acabou no dia {formatShortDate(rsvpDeadline)}, porque já
        passamos a lista pro porteiro. Se você ainda quiser vir, fala direto com a gente que a gente
        dá um jeitinho.
      </p>
    )
  }

  if (isDone && confirmed) {
    const count = confirmed.guestNames.length
    return (
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-rose-100 text-rose-500">
          <HeartIcon className="size-7" />
        </span>
        {confirmed.attending ? (
          <>
            <p className="mt-4 font-display text-2xl text-ink-900">
              {byCount(count, 'Presença confirmada!', 'Presenças confirmadas!')}
            </p>
            <p className="mt-2 text-ash-600">
              {joinNames(confirmed.guestNames)},{' '}
              {byCount(
                count,
                'vamos deixar o seu nome com o porteiro.',
                'vamos deixar o nome de vocês com o porteiro.',
              )}
              {siteConfig.event.date &&
                ` ${byCount(count, 'Te esperamos', 'Esperamos vocês')} ${formatEventDate(siteConfig.event.date).toLowerCase()}${
                  siteConfig.event.time
                    ? `, ${describeEventTime(siteConfig.event.time).toLowerCase()}`
                    : ''
                }.`}
            </p>
            {siteConfig.event.mapsUrl && (
              <a
                href={siteConfig.event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonClassName({ variant: 'outline', className: 'mt-6 w-full' })}
              >
                Ver o endereço no mapa
              </a>
            )}
          </>
        ) : (
          <>
            <p className="mt-4 font-display text-2xl text-ink-900">Obrigado por avisar</p>
            <p className="mt-2 text-ash-600">
              {byCount(count, 'Vamos sentir sua falta!', 'Vamos sentir a falta de vocês!')} Fica o
              carinho de sempre.
            </p>
          </>
        )}
        {!isBackendConfigured && (
          <a
            href={buildWhatsAppUrl(
              siteConfig.whatsappNumber,
              confirmed.attending
                ? `Oi, ${coupleNames}! ${byCount(count, 'Confirmo', 'Confirmamos')} presença no chá: ${joinNames(confirmed.guestNames)}.`
                : `Oi, ${coupleNames}! Infelizmente ${byCount(count, 'não vou', 'não vamos')} conseguir ir no chá. ${joinNames(confirmed.guestNames)}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ className: 'mt-3 w-full' })}
          >
            Avisar no WhatsApp
          </a>
        )}
      </div>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = validateGiverNames(names)
    setNamesError(problem)
    if (problem) return

    const guestNames = cleanGiverNames(names)
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (isBackendConfigured) {
        await registerRsvp({ guestNames, attending, message })
      }
      rememberNames(guestNames)
      markConfirmed({ guestNames, attending })
      setIsDone(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? `Não conseguimos confirmar agora: ${error.message}`
          : 'Não conseguimos confirmar agora. Tente de novo em instantes.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {confirmed && (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-ink-800">
          Por aqui você já confirmou ({joinNames(confirmed.guestNames)}). Não precisa confirmar de
          novo, só se quiser incluir mais alguém.
        </p>
      )}

      <fieldset>
        <legend className="font-bold text-ink-900">Você vai?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <AnswerOption checked={attending} onSelect={() => setAttending(true)} title="Vou sim!" />
          <AnswerOption
            checked={!attending}
            onSelect={() => setAttending(false)}
            title="Não vou conseguir"
          />
        </div>
      </fieldset>

      <NameListInput
        names={names}
        onChange={setNames}
        error={namesError}
        legend={attending ? 'Quem vai?' : 'Quem não vai conseguir ir?'}
        hint={
          attending
            ? 'Coloque o nome completo de cada pessoa, crianças também. É essa lista que vai pro porteiro.'
            : 'Um nome em cada campo.'
        }
        firstPlaceholder="Nome completo"
        otherPlaceholder="Nome completo de mais alguém"
      />

      <div>
        <label htmlFor={messageId} className="font-bold text-ink-900">
          Quer deixar um recado? <span className="font-normal text-ash-500">(opcional)</span>
        </label>
        <textarea
          id={messageId}
          rows={2}
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 w-full resize-none rounded-2xl border-2 border-ash-200 bg-white px-4 py-3 text-ink-900 outline-none focus:border-rose-400"
        />
      </div>

      {submitError && (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? 'Enviando...'
          : attending
            ? byCount(
                peopleCount,
                'Confirmar presença',
                `Confirmar a presença de ${peopleCount} pessoas`,
              )
            : byCount(peopleCount, 'Avisar que não vou', 'Avisar que não vamos')}
      </Button>
    </form>
  )
}

interface AnswerOptionProps {
  checked: boolean
  onSelect: () => void
  title: string
}

function AnswerOption({ checked, onSelect, title }: AnswerOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 font-bold text-ink-900 transition-colors ${
        checked ? 'border-rose-400 bg-rose-50' : 'border-ash-200 bg-white hover:border-rose-300'
      }`}
    >
      <input
        type="radio"
        name="rsvp-answer"
        checked={checked}
        onChange={onSelect}
        className="size-4 accent-rose-500"
      />
      {title}
    </label>
  )
}
