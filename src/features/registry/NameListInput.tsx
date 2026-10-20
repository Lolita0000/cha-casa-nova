import { useId } from 'react'

import { CloseIcon } from '@/components/icons/icons'

import { MAX_GIVER_NAMES, MAX_NAME_LENGTH } from './giverNames'

interface NameListInputProps {
  names: string[]
  onChange: (names: string[]) => void
  error?: string | null
  legend?: string
  hint?: string
  firstPlaceholder?: string
  otherPlaceholder?: string
}

/** One field per person, so a couple or a whole family can sign the gift. */
export function NameListInput({
  names,
  onChange,
  error,
  legend = 'Quem está presenteando?',
  hint = 'Se for um casal ou uma família, coloque um nome em cada campo.',
  firstPlaceholder = 'Seu nome',
  otherPlaceholder = 'Outro nome',
}: NameListInputProps) {
  const baseId = useId()

  function update(index: number, value: string) {
    onChange(names.map((name, current) => (current === index ? value : name)))
  }

  function remove(index: number) {
    onChange(names.filter((_, current) => current !== index))
  }

  return (
    <fieldset>
      <legend className="font-bold text-ink-900">{legend}</legend>
      <p className="mt-1 text-sm text-ash-600">{hint}</p>

      <ul className="mt-3 space-y-2">
        {names.map((name, index) => (
          <li key={index} className="flex items-center gap-2">
            <label htmlFor={`${baseId}-${index}`} className="sr-only">
              Nome {index + 1}
            </label>
            <input
              id={`${baseId}-${index}`}
              value={name}
              maxLength={MAX_NAME_LENGTH}
              autoComplete={index === 0 ? 'name' : 'off'}
              placeholder={index === 0 ? firstPlaceholder : otherPlaceholder}
              onChange={(event) => update(index, event.target.value)}
              aria-invalid={Boolean(error) || undefined}
              className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-ash-200 bg-white px-4 text-ink-900 outline-none placeholder:text-ash-400 focus:border-rose-400"
            />
            {names.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remover ${name || `nome ${index + 1}`}`}
                className="grid size-10 shrink-0 place-items-center rounded-full text-ash-500 hover:bg-rose-50 hover:text-rose-700"
              >
                <CloseIcon className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {names.length < MAX_GIVER_NAMES && (
        <button
          type="button"
          onClick={() => onChange([...names, ''])}
          className="mt-3 text-sm font-bold text-ink-800 underline decoration-rose-400 decoration-2 underline-offset-4"
        >
          + Adicionar outro nome
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
    </fieldset>
  )
}
