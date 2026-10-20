import { useId } from 'react'

import { siteConfig } from '@/config/site'

import { joinNames } from './giverNames'

export const MAX_LETTER_LENGTH = 2000

interface LetterFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  autoFocus?: boolean
}

const coupleNames = joinNames([...siteConfig.coupleNames])

/** A lined-paper textarea for the guest's letter to the couple. */
export function LetterField({
  value,
  onChange,
  label = `Escreva uma cartinha pra ${coupleNames}`,
  autoFocus = false,
}: LetterFieldProps) {
  const id = useId()
  const remaining = MAX_LETTER_LENGTH - value.length

  return (
    <div>
      <label htmlFor={id} className="font-bold text-ink-900">
        {label} <span className="font-normal text-ash-500">(opcional)</span>
      </label>
      <p className="mt-1 text-sm text-ash-600">Ela fica guardada aqui e só a gente lê.</p>
      <textarea
        id={id}
        rows={6}
        maxLength={MAX_LETTER_LENGTH}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Querida ${siteConfig.coupleNames[0]}, querido ${siteConfig.coupleNames[1]}...`}
        className="mt-2 w-full resize-y rounded-2xl border-2 border-rose-200 bg-rose-50 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(1.75rem-1px),var(--color-rose-200)_calc(1.75rem-1px),var(--color-rose-200)_1.75rem)] bg-local px-4 pt-[0.4rem] pb-3 text-base leading-[1.75rem] text-ink-900 outline-none placeholder:text-ash-400 focus:border-rose-400"
      />
      {remaining < 200 && (
        <p className="mt-1 text-right text-xs text-ash-500 tabular-nums">
          {remaining} letras restantes
        </p>
      )}
    </div>
  )
}
